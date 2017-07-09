const Expo = require('exponent-server-sdk');
const queue = require('../queue');
const Source = require('../models/source');
const Entry = require('../models/entry');
// const util = require('util');

// const setTimeoutPromise = util.promisify(setTimeout);

queue.process('push all', async (job, done) => {
  try {
    const allSources = await Source.find({});

    const entries = await Promise.all(
      allSources.map(
        item =>
          Entry.find({ source: item._id, createdAt: { $gt: item.lastPushed } })
            .sort({ createdAt: -1 }).limit(10).exec()),
    );

    entries.forEach((entriesList) => {
      if (entriesList.length > 0) {
        job.log(`push ${entriesList.length} entries from ${entriesList[0].source}`);
        queue
          .create('push', { title: `push ${entriesList[0].source}`, entries: entriesList })
          .attempts(3)
          .removeOnComplete(true).save();
      }
    }, this);

    done();
  } catch (error) {
    done(error);
  }
});

queue.process('push', async (job, done) => {
  try {
    const data = job.data.entries;

    // All sources (no duplicate)
    const sources = data.map(e => e.source).filter((e, index, self) => index === self.indexOf(e));
    // All sources and theirs subscriptors (tokens)
    const subs = await Source.where('_id').in(sources).populate('subscriptions', 'pushToken');
    // Convert to map (key:source-id value:tokens)
    const users = {};
    subs.forEach((sub) => {
      const sid = sub._id;
      if (users[sid] === undefined) users[sid] = [];
      sub.subscriptions.forEach((u) => {
        users[sid].push(...u.pushToken);
      }, this);
    }, this);
    job.log(users);

    const messages = [];
    data.forEach((e) => {
      users[e.source].forEach((token) => {
        messages.push({
          to: token,
          sound: 'default',
          body: e.title,
          data: e,
        });
      }, this);
    }, this);

    // Push to all subscriptors and all their devices
    const expo = new Expo();
    const notifications = [];
    for (let index = 0; index < messages.length; index += Expo.pushNotificationChunkSizeLimit) {
      // Expo supports sending an array of up to 100 messages at once
      const chunk = messages.slice(index, index + Expo.pushNotificationChunkSizeLimit);
      notifications.push(expo.sendPushNotificationsAsync(chunk));
    }
    const recipes = await Promise.all(notifications);
    job.log(recipes);

    await Source.update(
      { _id: { $in: sources } },
      { lastPushed: Date.now() });
    done();
  } catch (error) {
    // TODO: resend notifications
    done(error);
  }
});
