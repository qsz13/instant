var request = require('request');
var config = require('../config')
var rp = require('request-promise-native');

JandanType = {
    PIC:0,
    OOXX:1
}

async function getCommentByAPI(jandanType) {
    if(jandanType == JandanType.PIC) {
        return rp({uri:config.jandan.PIC_API_URL,json:true})
    } else if (jandanType = JandanType.OOXX) {
        return rp({uri:config.jandan.OOXX_API_URL,json:true})
    }
}

async function getAllComment() {
    picComment = await getCommentByAPI(JandanType.PIC)
    ooxxComment = await getCommentByAPI(JandanType.OOXX)
    console.log(picComment)
    console.log(ooxxComment)
}



module.exports.getAllComment = getAllComment;