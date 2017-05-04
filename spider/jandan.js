var rp = require('request-promise-native');
var config = require('../config')
var Source = require('../models/source')
var Entry = require('../models/entry')

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


async function saveAllComment(data, type) {
    if (type == JandanType.PIC) {
        var source = { _id: "jandan-pic", name: "Jandan Pic", link: config.jandan.PIC_API_URL, description: "Jandan boring pics.", type: "api", updatedAt: new Date() }
    } else if (type == JandanType.OOXX) {
        var source = { _id: "jandan-ooxx", name: "Jandan OOXX", link: config.jandan.OOXX_API_URL, description: "Jandan Meizi pics.", type: "api", updatedAt: new Date() }
    }

    await Source.update({ _id: source._id }, source, { upsert: true })
    
    await Promise.all(data.map(async (comment) => {
        var entry = {
            eid: comment.comment_ID,
            description: comment.text_content.trim(),
            content: comment.comment_content.trim(),
            images: comment.pics,
            score: getScore(comment.vote_positive, comment.vote_negative),
            source: source._id,
             createdAt: new Date(comment.comment_date_gmt)
        }

        await Entry.updateOne({ eid: entry.eid, source: entry.source }, entry, { upsert: true })
    }))
}


function getScore(oo, xx) {
    return oo - xx
}

module.exports.getAllComment = getAllComment;