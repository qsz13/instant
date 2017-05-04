var rp = require('request-promise-native');
var config = require('../config')
var mongoose = require('mongoose');
var Source = require('../models/source')
var Entry = require('../models/entry')



// var db = mongojs(config.DATABASE_URL, ['source', 'entry'])

exports.getAllNews = async function () {
    var newsSource = await getNewsSource()
    newsSource.forEach((ns) => {
        if (ns.sortBysAvailable.indexOf("latest") > -1) var sortBy = "latest"
        else var sortBy = "top"
        var article_url = config.newsapi.ARTICLE_URL + '?apiKey=' + config.newsapi.API_KEY + '&source=' + ns.id + '&sortBy=' + sortBy
        var source = new Source({ _id: ns.id, name: ns.name, link: article_url, description: ns.description, type: "newsapi" })
        Source.update({ _id: ns.id }, source, { upsert: true }, async (err) => {
            if (err) console.log(err)
            var news = await getNews(source.link)
            news.forEach(async (article) => {
                var entry = {
                    eid: article.url,
                    title: article.title,
                    images: [article.urlToImage],
                    url: article.url,
                    description: article.description,
                    source: source._id
                }
                await Entry.update({ eid: article.url, source: source._id }, entry, { upsert: true }, async (err) => {
                    if (err) console.log(err)
                    await Entry.updateOne({ eid: article.url, source: source._id }, { createdAt: article.publishedAt }, (err) => {
                        if (err) console.log(err)
                    })
                })
            })
        })

    })
}



async function getNewsSource() {
    var response = await rp({ uri: config.newsapi.SOURCE_URL, json: true })
    return response.sources
}

async function getNews(url) {
    var response = await rp({ uri: url, json: true })
    return response.articles
}