var rp = require('request-promise-native');
var models = require('../models')
var config = require('../config')

JandanType = {
    PIC: 0,
    OOXX: 1
}

async function getCommentByAPI(jandanType) {

    if (jandanType == JandanType.PIC) {
        json = await rp({ uri: config.jandan.PIC_API_URL, json: true })
        await saveAllComment(json['comments'], JandanType.PIC)
    } else if (jandanType = JandanType.OOXX) {
        json = await rp({ uri: config.jandan.OOXX_API_URL, json: true })
        await saveAllComment(json['comments'], JandanType.OOXX)
    }
}

async function getAllComment() {
    await getCommentByAPI(JandanType.PIC)
    await getCommentByAPI(JandanType.OOXX)
}

function saveAllComment(data, type) {
    if (type == JandanType.PIC) {
        sourceQuery = { where: { name: 'Jandan Pic', link: config.jandan.PIC_API_URL, type: "api" } }
    } else if (type == JandanType.OOXX) {
        sourceQuery = { where: { name: 'Jandan OOXX', link: config.jandan.OOXX_API_URL, type: 'api' } }
    }
    models.Source.findOrCreate(sourceQuery).spread(async function (source, created) {
        for (var d in data) {
            var entry = {
                eid: data[d].comment_ID,
                description: data[d].text_content.trim(),
                content: data[d].comment_content.trim(),
                score: getScore(data[d].vote_positive, data[d].vote_negative),
                source_id: source.get('id')
            }
            var created = await models.Entry.upsert(entry).catch(function (err) {
                console.log(err)
            })
            if (created) {
                entry = await models.Entry.findOne({ where: { eid: entry.eid, source_id: entry.source_id }, raw: true }).catch(function (err) {
                    console.log(err)
                })
                var picArr = []
                data[d].pics.forEach((pic) => {
                    picArr.push({ url: pic, entry_id: entry.id })
                })
                models.Image.bulkCreate(picArr).catch(function (err) {
                    console.log(err)
                })
            }

        }
    }).catch(function (err) {
        console.log(err)
    })
}


function getScore(oo, xx) {
    return oo - xx
}

module.exports.getAllComment = getAllComment;