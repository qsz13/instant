const rp = require('request-promise-native');
const config = require('../config');
const mongoose = require('mongoose');
const Source = require('../models/source');
const Entry = require('../models/entry');

async function getNewsSource() {
  const response = await rp({ uri: config.newsapi.SOURCE_URL, json: true });
  return response.sources;
}

async function getNews(url) {
  const response = await rp({ uri: url, json: true });
  return response.articles;
}


exports.getAllNews = async (report) => {
  const newsSource = await getNewsSource();
  let progress = 0;
  const total = newsSource.length * 2;
  report(progress, total);

  // Update news sources
  const sources = await Promise.all(newsSource.map(async (ns) => {
    const sortBy = ns.sortBysAvailable.indexOf('latest') > -1 ? 'latest' : 'top';
    const articleUrl = `${config.newsapi.ARTICLE_URL}?apiKey=${config.newsapi.API_KEY}&source=${ns.id}&sortBy=${sortBy}`;
    const source = new Source({ _id: ns.id, name: ns.name, link: articleUrl, description: ns.description, type: 'newsapi' });

    await Source.update({ _id: ns.id }, source, { upsert: true });

    progress += 1;
    report(progress, total);

    return source;
  }));

  // Fetch news for every source
  await Promise.all(sources.map(async (source) => {
    const news = await getNews(source.link);
    await Promise.all(news.map(async (article) => {
      const entry = {
        eid: article.url,
        title: article.title,
        images: [article.urlToImage],
        url: article.url,
        description: article.description,
        source: source._id,
        createdAt: article.publishedAt,
      };
      if (source._id === 'usa-today' || article.publishedAt === null) {
        delete entry.createdAt;
        await Entry.updateOne({ eid: article.url, source: source._id }, {
          $set: entry,
          $setOnInsert: { createdAt: new Date() },
        }, { upsert: true });
      } else {
        await Entry.updateOne({ eid: article.url, source: source._id }, entry, { upsert: true });
      }
    }));


    progress += 1;
    report(progress, total);
  }));

  report(total, total);
};

