var request = require('request');
var config = require('../config')
var rp = require('request-promise-native');
var models = require('../models')
var config = require('../config')

JandanType = {
    PIC:0,
    OOXX:1
}

function getCommentByAPI(jandanType) {
    if(jandanType == JandanType.PIC) {
        rp({uri:config.jandan.PIC_API_URL,json:true}).then((json)=>{saveComment(json['comments'], JandanType.PIC)})
    } else if (jandanType = JandanType.OOXX) {
        rp({uri:config.jandan.OOXX_API_URL,json:true}).then((json)=>{saveComment(json['comments'], JandanType.OOXX)})
    }
}

function getAllComment() {
    getCommentByAPI(JandanType.PIC)
    getCommentByAPI(JandanType.OOXX)
    // console.log(ooxxComment)
}

function saveComment(data, type) {
    createJandanSource(type)
    
}

function createJandanSource(type) {
    if(type == JandanType.PIC){
        models.Source
        .findOrCreate({where:{name:'Jandan Pic',link: config.jandan.PIC_API_URL}})
        .spread(function(source, created) {
    console.log(source.get({
      plain: true
    }))

    /*
      {
        username: 'sdepold',
        job: 'Technical Lead JavaScript',
        id: 1,
        createdAt: Fri Mar 22 2013 21: 28: 34 GMT + 0100(CET),
        updatedAt: Fri Mar 22 2013 21: 28: 34 GMT + 0100(CET)
      }
      created: true
    */
  })
    } else if(type == JandanType.PIC) {

    }
}


module.exports.getAllComment = getAllComment;