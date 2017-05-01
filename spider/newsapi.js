var rp = require('request-promise-native');
var models = require('../models')
var config = require('../config')

exports.getAllNews = async function () {
    await getNewsSource()


}

async function getNewsSource() {
    console.log(config.newsapi.URL)
    response = await rp({ uri: config.newsapi.URL, json: true })
    response.sources.forEach((ns) => {
        models.Source.findOrCreate({
            where: { sid: ns.id, name: ns.name, link: ns.url, description: ns.description, type: "newsapi" }, raw: true
        }).spread((instance, created) => {
            console.log(instance)

        })

    })
}