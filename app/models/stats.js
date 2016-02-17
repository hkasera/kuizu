var db = require("../../db.js");
var mongojs = require('mongojs');
var ObjectId = mongojs.ObjectId; 
var forEach = require('async-foreach').forEach;
module.exports = {
	createStats:function (params, callback) {
		var userid = params.userid;
		var answer = db.collection('answer');

		var res = {count:0};
		var questions = [];
		var question_ids = Object.keys(params.questions);
		for (var id in question_ids) {
		    question = {};
		    console.log(id);
		    question._id = question_ids[id];
		    question.details = params.questions[question._id ];
		    questions.push(question);
		}
		forEach(questions,function(question,i,questions){
			var done = this.async();
			db.answer.find({_id:ObjectId(params.questions[question._id]),question_id:ObjectId(question._id),is_correct:true}, function(err, docs) {        	  
            	  if(!err && docs.length != 0){
            	  		questions[i].is_correct  = true;
            	  }else{
            	  		questions[i].is_correct  = false;
            	  }
            	  done(res);
        	});
		},function(notaborted,res){
			//console.log("werwR4F",res,"w3e4R")
			var count = 0;
			for(i in res){
				if(res[i].is_correct){
					count++;
				}
			}
			//callback(notaborted,res);
			var statDoc = {
				"userid" : ObjectId(params.userid),
				"questions" : question_ids,
				"correct" : count
			}
			//console.log(statDoc);
			db.statistics.insert(statDoc,function(err,docs){
				console.log(err,docs);
				callback(err,docs);
			})
		});
		
	},
	getUserStats : function(params, callback){
		db.statistics.find({_id:params.id},function(err,docs){
			callback(err,docs);
		})
	}
}