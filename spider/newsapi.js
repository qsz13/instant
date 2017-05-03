var rp = require('request-promise-native');
var config = require('../config')
var mongojs = require('mongojs')

var db = mongojs(config.DATABASE_URL, ['source', 'entry'])

exports.getAllNews = async function () {
    var newsSource = await getNewsSource()
    newsSource.forEach((ns) => {
        if (ns.sortBysAvailable.indexOf("latest") > -1) var sortBy = "latest"
        else var sortBy = "top"
        var article_url = config.newsapi.ARTICLE_URL + '?apiKey=' + config.newsapi.API_KEY + '&source=' + ns.id + '&sortBy=' + sortBy
        var source = { _id: ns.id, name: ns.name, link: article_url, description: ns.description, type: "newsapi", updatedAt: new Date() }
        db.source.update({ _id: source._id }, { $set: source, $setOnInsert: { createdAt: new Date() } }, { upsert: true }, async (err) => {
            if (err) console.log(err)
            var news = await getNews(source.link)
            news.forEach((article) => {
                var entry = {
                    eid: article.url,
                    title: article.title,
                    images: [article.urlToImage],
                    url: article.url,
                    description: article.description,
                    published_at: article.publishedAt,
                    source_id: source._id,
                    updatedAt: new Date()
                }
                db.entry.update({ eid: article.url, source_id: source._id }, { $set: entry, $setOnInsert: { createdAt: new Date() } }, { upsert: true }, (err) => { if (err) console.log(err) })
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