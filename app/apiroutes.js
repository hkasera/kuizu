var Users = require("./models/user.js");
var Questions = require("./models/question.js");
var Answers = require("./models/answers.js");

module.exports = function(self){
	self.app.get('/get/users' , function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        Users.getUsers({},function(err,docs){
            if(!err){
                res.send(docs);
            }else{
                res.send(err);
            }
        });
    });
    self.app.get('/get/user/:id/questions' , function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        var params = {};
        params.id = req.params.id;
        Users.getUserQuestions(params,function(err,docs){
            if(!err){
                res.send(docs);
            }else{
                res.send(err);
            }
        });
    });

    self.app.post('/create/user' , function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        var params = {};
        params.name = req.body.name;
        params.dept_id = req.body.dept_id;
        Users.createUser(params,function(err,docs){
            if(!err){
                res.send(docs);
            }else{
                res.send(err);
            }
        });
    });
    self.app.post('/create/question' , function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        var params = {};
        params.text = req.body.text;
        Questions.createQuestions(params,function(err,docs){
            if(!err){
                res.send(docs);
            }else{
                res.send(err);
            }
        });
    });

    self.app.get('/get/questions' , function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        Questions.getQuestionsWithAnswers({},function(err,docs){
            if(!err){
                res.send(docs);
            }else{
                res.send(err);
            }
        });
    });
    self.app.get('/get/question/:id' , function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        var params = {};
        params.id = req.params.id;
        Questions.getQuestionWithAnswers(params,function(err,docs){
            if(!err){
                res.send(docs);
            }else{
                res.send(err);
            }
        });
    });
    self.app.get('/get/answers' , function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        Answers.getAnswers({},function(err,docs){
            if(!err){
                res.send(docs);
            }else{
                res.send(err);
            }
        });
    });

    self.app.post('/create/answer' , function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        var params = {};
        params.question_id = req.body.question_id;
		params.text = req.body.text;
		params.is_correct = req.body.is_correct;
        Answers.createAnswers(params,function(err,docs){
            if(!err){
                res.send(docs);
            }else{
                res.send(err);
            }
        });
    });
}