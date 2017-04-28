var request = require('request');
var config = require('../config')
var rp = require('request-promise-native');
var models = require('../models')
var config = require('../config')

JandanType = {
    PIC: 0,
    OOXX: 1
}

function getCommentByAPI(jandanType) {
    if (jandanType == JandanType.PIC) {
        rp({ uri: config.jandan.PIC_API_URL, json: true }).then((json) => { saveAllComment(json['comments'], JandanType.PIC) })
    } else if (jandanType = JandanType.OOXX) {
        rp({ uri: config.jandan.OOXX_API_URL, json: true }).then((json) => { saveAllComment(json['comments'], JandanType.OOXX) })
    }
}

function getAllComment() {
    getCommentByAPI(JandanType.PIC)
    getCommentByAPI(JandanType.OOXX)
}

function saveAllComment(data, type) {
    if (type == JandanType.PIC) {
        sourceQuery = { where: { name: 'Jandan Pic', link: config.jandan.PIC_API_URL } }
    } else if (type == JandanType.OOXX) {
        sourceQuery = { where: { name: 'Jandan OOXX', link: config.jandan.OOXX_API_URL } }
    }
    models.Source.findOrCreate(sourceQuery).spread(function (source, created) {
        for (var d in data) {
            models.Entry.upsert({
                entry_id: data[d].comment_ID,
                title: '',
                link: data[d].pics.join('\n'),
                description: data[d].text_content.trim(),
                content: data[d].comment_content.trim(),
                score: getScore(data[d].vote_positive, data[d].vote_negative),
                SourceId: source.get('id')
            }).catch((err) => {
                console.log(err)
            })
        }
    })
}

function getScore(oo, xx) {
    return oo - xx
}

module.exports.getAllComment = getAllComment;