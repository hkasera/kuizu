var db = require("../../db.js");
var mongojs = require('mongojs');
var ObjectId = mongojs.ObjectId; 
module.exports = {
	createStats:function (params, callback) {
		
	},
	getUserStats : function(params, callback){
		db.stats.find({_id:params.id},function(err,docs){
			callback(err,docs);
		})
	}
}