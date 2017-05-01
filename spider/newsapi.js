var rp = require('request-promise-native');
var models = require('../models')
var config = require('../config')
var Sequelize = require('sequelize');

exports.getAllNews = async function () {
    await getNewsSource()


}

async function getNewsSource() {
    var response = await rp({ uri: config.newsapi.SOURCE_URL, json: true })
    response.sources.forEach((ns) => {
        models.Source.findOrCreate({
            where: { sid: ns.id, name: ns.name, link: ns.url, description: ns.description, type: "newsapi" }, raw: true
        }).spread(async (instance, created) => {
            if (ns.sortBysAvailable.indexOf("latest") > -1) {
                //In the array!
                var sortBy = "latest"
            } else {
                //Not in the array
                var sortBy = "top"
            }
            var article_url = config.newsapi.ARTICLE_URL + '?apiKey=' + config.newsapi.API_KEY + '&source=' + instance.sid + '&sortBy=' + sortBy
            var res = await rp({ uri: article_url, json: true })
            res.articles.forEach((article) => {
                var entry = {
                    eid: article.url,
                    title: article.title,
                    link: article.url,

                    description: article.description,
                    published_at: article.publishedAt,
                    source_id: instance.id
                }
                models.Entry.findOrCreate({ where: entry, raw: true }).spread((instance, created) => {
                    if (created && article.urlToImage != null) {
                        image = { url: article.urlToImage, entry_id: instance.id }
                        models.Image.create(image).catch(function (err) {
                            console.log(err)
                        })
                    }
                }).catch(function (err) {
                    console.log(err)
                })
            })
        }).catch(function (err) {
            console.log(err)
        })

    })
}