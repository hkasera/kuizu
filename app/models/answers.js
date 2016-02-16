var db = require("../../db.js");
var mongojs = require('mongojs');
var ObjectId = mongojs.ObjectId; 
module.exports = {
	createAnswers:function (params, callback) {
		var question_id = params.question_id;
		var text = params.text;
		var is_correct = params.isCorrect;
		var answerDoc = {
			"text":text,
			"question_id" : ObjectId(question_id),
			"is_correct" : is_correct
		};
		db.answer.insert(answerDoc, function(err, docs) {
            callback(err,docs);       
        });
	},
	getAnswers : function(params, callback){
		db.answer.find({},function(err,docs){
			callback(err,docs);
		})
	}
}