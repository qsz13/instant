'use strict';

var FeedParser = require('feedparser');
var request = require('request');
var models = require('../models')

function getRSSFeed(url, callback) {
    var req = request(url, { timeout: 10000, pool: false });
    req.setMaxListeners(50);
    // Some feeds do not respond without user-agent and accept headers.
    req.setHeader('user-agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36');
    req.setHeader('accept', 'text/html,application/xhtml+xml');

    var feedparser = new FeedParser();

    // Define our handlers
    req.on('error', (err) => { console.log(err); });
    req.on('response', function (res) {
        if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));
        var encoding = res.headers['content-encoding'] || 'identity'
            , charset = getParams(res.headers['content-type'] || '').charset;
        res = maybeDecompress(res, encoding);
        res = maybeTranslate(res, charset);
        res.pipe(feedparser);
    });

    feedparser.on('error', (err) => { console.log(err); });
    feedparser.on('readable', function () { callback(this) });
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
    return await getRSSFeed(rss.link, (stream) => {
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
        return models.Source.upsert(rss)
    })

}

exports.getAllRss = async function () {
    var sourceList = await models.Source.getSourcesOfType("rss")

    sourceList.forEach((source) => {
        getRSSFeed(source.link, function (stream) {
            var item;
            while (item = stream.read()) {
                var entry = {
                    entry_id: item.guid,
                    title: item.title,
                    link: item.link,
                    description: item.description,
                    content: item.content,
                    SourceId: source.id
                }
                models.Entry.saveEntry(entry);
            }

        })
    })

}