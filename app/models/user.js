var db = require("../../db.js");
var Questions = require("./question.js");
var mongojs = require('mongojs');
var ObjectId = mongojs.ObjectId; 
module.exports = {
	createUser:function (params, callback) {
		var name = params.name;
		var dept_id = params.dept_id;
		var userdoc = {
			"name":name,
			"dept_id" : dept_id
		};
		db.user.insert(userdoc, function(err, docs) {
            callback(err,docs);       
        });
	},
	getUsers : function(params, callback){
		db.user.find({},function(err,docs){
			callback(err,docs);
		})
	},
	getUserQuestions : function(params,callback){
		db.statistics.find({_id:params.id},function(err,docs){
			if(!err && docs.length === 0){
				Questions.getQuestionsWithAnswers(params,function(err,docs){
					callback(err,docs);
				});
			}else{
				callback(err,docs)
			}
		})
	}
}