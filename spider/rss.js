'use strict';

var FeedParser = require('feedparser')
var Iconv = require('iconv').Iconv
var zlib = require('zlib')
var request = require('request')
var Source = require('../models/source')
var Entry = require('../models/entry')

async function getRSSFeed(url, callback) {
    var options = {
        uri:url,
        headers:{
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36',
            'accept': 'text/html,application/xhtml+xml'
        },
        timeout: 10000,
        pool: false
    };
    var req = request(options)
    req.setMaxListeners(50);

    var res = await new Promise((resolve, reject) => {
        req.on('error', (err) => { reject(err) })
        req.on('response', res => { resolve(res) })
    })

    if (res.statusCode != 200) throw new Error('Bad status code');
    var encoding = res.headers['content-encoding'] || 'identity'
        , charset = getParams(res.headers['content-type'] || '').charset;
    res = maybeDecompress(res, encoding)
    res = maybeTranslate(res, charset)
    
    var feedparser = new FeedParser()
    res.pipe(feedparser)

    return await new Promise((resolve, reject) => {
        feedparser.on('error', (err) => { reject(err) })
        feedparser.on('readable', () => { resolve(feedparser) })
    });
}

function getParams(str) {
    var params = str.split(';').reduce(function (params, param) {
        var parts = param.split('=').map(function (part) { return part.trim(); });
        if (parts.length === 2) {
            params[parts[0]] = parts[1];
        }
        return params;
    }, {});
    return params;
}


function maybeDecompress(res, encoding) {
    var decompress;
    if (encoding.match(/\bdeflate\b/)) {
        decompress = zlib.createInflate();
    } else if (encoding.match(/\bgzip\b/)) {
        decompress = zlib.createGunzip();
    }
    return decompress ? res.pipe(decompress) : res;
}



function maybeTranslate(res, charset) {
    var iconv;
    // Use iconv if its not utf8 already.
    if (!iconv && charset && !/utf-*8/i.test(charset)) {
        try {
            iconv = new Iconv(charset, 'utf-8');
            console.log('Converting from charset %s to utf-8', charset);
            iconv.on('error', done);
            // If we're using iconv, stream will be the output of iconv
            // otherwise it will remain the output of request
            res = res.pipe(iconv);
        } catch (err) {
            res.emit('error', err);
        }
    }
    return res;
}



exports.saveRSSSource = async function (rss) {
    var stream = await getRSSFeed(rss.link)

    var meta = stream.meta
    if (rss.name == null) {
        rss.name = meta.title
    }
    if (rss.description == null) {
        rss.description = meta.description
    }
    if (rss.image == null) {
        rss.image = meta.image.url
    }
    
    rss._id = rss.link
    rss.type = 'rss'
    await Source.updateOne({ _id: rss._id }, rss, { upsert: true })
}

exports.getAllRss = async function () {
    var sourceList = await Source.find({'type':'rss'})

    await Promise.all(sourceList.map(async (source) => {
        var stream = await getRSSFeed(source.link)

        var item;
        while (item = stream.read()) {
            var entry = {
                eid: item.guid,
                title: item.title,
                link: item.link,
                description: item.description,
                content: item.content,
                source: source.id
            }

            await Entry.updateOne({ eid: entry.eid, source: entry.source }, entry, { upsert: true })
        }

    }))

}