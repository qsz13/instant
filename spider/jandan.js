var rp = require('request-promise-native');
var config = require('../config')
var mongojs = require('mongojs')

var db = mongojs(config.DATABASE_URL, ['source', 'entry'])

JandanType = {
    PIC: 0,
    OOXX: 1
}

async function getAllComment() {
    await getCommentByAPI(JandanType.PIC)
    await getCommentByAPI(JandanType.OOXX)
}

async function getCommentByAPI(jandanType) {
    if (jandanType == JandanType.PIC) {
        json = await rp({ uri: config.jandan.PIC_API_URL, json: true })
        await saveAllComment(json['comments'], JandanType.PIC)
    } else if (jandanType == JandanType.OOXX) {
        json = await rp({ uri: config.jandan.OOXX_API_URL, json: true })
        await saveAllComment(json['comments'], JandanType.OOXX)
    }
}


function saveAllComment(data, type) {
    // console.log(data)
    if (type == JandanType.PIC) {
        var source = { _id: "jandan-pic", name: "Jandan Pic", link: config.jandan.PIC_API_URL, description: "Jandan boring pics.", type: "api" }
    } else if (type == JandanType.OOXX) {
        var source = { _id: "jandan-ooxx", name: "Jandan OOXX", link: config.jandan.OOXX_API_URL, description: "Jandan Meizi pics.", type: "api" }
    }
    db.source.save(source, (err) => {
        data.forEach((e) => {
            var entry = {
                eid: e.comment_ID,
                description: e.text_content.trim(),
                content: e.comment_content.trim(),
                images: e.pics,
                score: getScore(e.vote_positive, e.vote_negative),
                source_id: source._id
            }
            db.entry.update({ eid: e.comment_ID, source_id: source._id }, entry, { upsert: true }, (err) => {
                if (err) console.log(err);
            })
        })
    })

}


function getScore(oo, xx) {
    return oo - xx
}

module.exports.getAllComment = getAllComment;