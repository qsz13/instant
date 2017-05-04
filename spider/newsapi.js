var rp = require('request-promise-native');
var config = require('../config')
var mongoose = require('mongoose');
var Source = require('../models/source')
var Entry = require('../models/entry')



// var db = mongojs(config.DATABASE_URL, ['source', 'entry'])

exports.getAllNews = async function () {
    var newsSource = await getNewsSource()
    await Promise.all(newsSource.map(async (ns)=>{
        if (ns.sortBysAvailable.indexOf("latest") > -1) var sortBy = "latest"
        else var sortBy = "top"
        var article_url = config.newsapi.ARTICLE_URL + '?apiKey=' + config.newsapi.API_KEY + '&source=' + ns.id + '&sortBy=' + sortBy
        var source = new Source({ _id: ns.id, name: ns.name, link: article_url, description: ns.description, type: "newsapi" })
        
        await Source.update({ _id: ns.id }, source, { upsert: true })

        var news = await getNews(source.link)
        await Promise.all(news.map(async (article)=>{
            var entry = {
                eid: article.url,
                title: article.title,
                images: [article.urlToImage],
                url: article.url,
                description: article.description,
                source: source._id,
                createdAt: article.publishedAt
            }
            
            await Entry.updateOne({ eid: article.url, source: source._id }, entry, { upsert: true })
        }))
    }))
}



async function getNewsSource() {
    var response = await rp({ uri: config.newsapi.SOURCE_URL, json: true })
    return response.sources
}

async function getNews(url) {
    var response = await rp({ uri: url, json: true })
    return response.articles
}