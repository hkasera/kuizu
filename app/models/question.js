var db = require("../../db.js");
var mongojs = require('mongojs');
var ObjectId = mongojs.ObjectId; 
var forEach = require('async-foreach').forEach;

module.exports = {
	createQuestions:function (params, callback) {
		var text = params.text;
		var questionDoc = {
			"text":text,
			"_random_sample": Math.random()
		};
		db.question.insert(questionDoc, function(err, docs) {
            callback(err,docs);       
        });
	},
	getQuestions : function(params, callback){
		db.question.find({},function(err,docs){
			callback(err,docs);
		})
	},
	getQuestionsWithAnswers : function(params, callback){
		var answer = db.collection('answer');
		var rand = Math.random();
		//console.log(rand);
		db.question.find({},
			//db.question.find({},
			{
							"_id" :true,
							"text":true
						}).skip(Math.random()*80).limit(10).toArray(
			function(err,docs){
			
			if(!err && docs.length != 0){

				forEach(docs,function(doc,i,docs){
					var done = this.async();
					db.answer.find({"question_id": doc._id },
						{
							"_id" :true,
							"text":true
						},
						function(er,dc){
	    					docs[i].answers = dc;
	    					done();
	    				}
	    			);
	    			
				},function(notaborted,docs){
					callback(err,docs);
				});
			}else{
				callback(err,docs);
			}
		})
	},
	checkQuestionAnswers : function(params, callback){
		var answer = db.collection('answer');
		var res = {};
		var question_ids = Object.keys(params.questions);;
		forEach(question_ids,function(question_id,i,question_ids){
			db.answer.find({_id:ObjectId(params[question_id]),question_id:ObjectId(question_id),is_correct:true}, function(err, docs) {
            	  if(!err && docs.length != 0){
            	  		res[question_id]  = true;
            	  }else{
            	  		res[question_id]  = false;
            	  }
        	});
		},function(notaborted,res){
			callback(err,res);
		});
	},
	getQuestionWithAnswers : function(params, callback){
		var answer = db.collection('answer');
		var question_id = ObjectId(params.id);
		db.question.findOne({_id:question_id},function(err,docs){
			console.log(err,docs);
			if(!err){
				db.answer.find({"question_id": question_id },
					{
						"_id" :true,
						"text":true
					},
					function(er,dc){
						console.log(err,dc);
    				docs.answers = dc;
    				callback(er,docs);
    			});
			}else{
				callback(err,docs);
			}
		})
	}
}