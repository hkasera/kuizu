#!/bin/env node
//  OpenShift sample Node application
var express = require('express');
var fs      = require('fs');
var bodyParser = require('body-parser');
var path    =  require('path');
var ejs = require('ejs');
var forEach = require('async-foreach').forEach;
var Users = require("./app/models/user.js");
var Stats = require("./app/models/stats.js");
var Utils = require("./app/utils.js");
/**
 *  Define the sample application.
 */
var SampleApp = function() {

    //  Scope.
    var self = this;


    /*  ================================================================  */
    /*  Helper functions.                                                 */
    /*  ================================================================  */

    /**
     *  Set up server IP address and port # using env variables/defaults.
     */
    self.setupVariables = function() {
        //  Set the environment variables we need.
        self.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
        self.port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;

        if (typeof self.ipaddress === "undefined") {
            //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
            //  allows us to run/test the app locally.
            console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
            self.ipaddress = "127.0.0.1";
        };
    };


    /**
     *  Populate the cache.
     */
    self.populateCache = function() {
        if (typeof self.zcache === "undefined") {
            self.zcache = { 'index.html': '' };
        }

        //  Local cache for static content.
        //self.zcache['index.html'] = fs.readFileSync('./index.html');
    };


    /**
     *  Retrieve entry (content) from cache.
     *  @param {string} key  Key identifying content to retrieve from cache.
     */
    self.cache_get = function(key) { return self.zcache[key]; };


    /**
     *  terminator === the termination handler
     *  Terminate server on receipt of the specified signal.
     *  @param {string} sig  Signal to terminate on.
     */
    self.terminator = function(sig){
        if (typeof sig === "string") {
           console.log('%s: Received %s - terminating sample app ...',
                       Date(Date.now()), sig);
           process.exit(1);
        }
        console.log('%s: Node server stopped.', Date(Date.now()) );
    };


    /**
     *  Setup termination handlers (for exit and a list of signals).
     */
    self.setupTerminationHandlers = function(){
        //  Process on exit and signals.
        process.on('exit', function() { self.terminator(); });

        // Removed 'SIGPIPE' from the list - bugz 852598.
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
         'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function(element, index, array) {
            process.on(element, function() { self.terminator(element); });
        });
    };


    /*  ================================================================  */
    /*  App server functions (main app logic here).                       */
    /*  ================================================================  */

    /**
     *  Create the routing table entries + handlers for the application.
     */
    self.createRoutes = function() {
        self.routes = { };
        self.postroutes = { };

        self.routes['/asciimo'] = function(req, res) {
            var link = "http://i.imgur.com/kmbjB.png";
            res.send("<html><body><img src='" + link + "'></body></html>");
        };

        self.routes['/'] = function(req, res) {
            res.setHeader('Content-Type', 'text/html');
            res.render('index.ejs');
        };

        self.postroutes['/user'] = function(req, res) {
            var params = {};
            params.name = req.body.name;
            params.dept_id = req.body.dept_id;
            if(params.name == undefined || params.name.length == 0 || params.dept_id == undefined ||  params.dept_id.length == 0){
                res.status(500).send({});
                return;
            }
            Users.createUser(params,function(err,docs){
                if(!err){
                    res.redirect('/quiz/'+docs._id);
                }else{
                    console.log(err.code);
                    res.render('error.ejs',{message:Utils.ERROR_CODE[err.code]})
                }
            });
        };

        self.routes['/quiz/:id'] = function(req,res){
            console.log(req.headers['referer']);
            var params = {};
            params.id = req.params.id;
            res.setHeader('Content-Type', 'text/html');
            Users.getUserQuestions(params,function(err,docs){
                if(!err){
                    res.render('quiz.ejs',{questions:docs,userid:params.id});
                }else{
                    res.send(err);
                }
            });       
        }

        self.postroutes['/quiz/:id/submit'] = function(req,res){
            var params = {};
            params.id = req.params.id;
            params.questions = req.body;
            res.setHeader('Content-Type', 'text/html');
            Stats.createStats(params,function(err,docs){
                console.log(err,docs,"--------");
                if(!err){
                    res.render('success.ejs',{output:docs});
                }else{
                    res.send(err);
                }
            });         
        }
    };


    /**
     *  Initialize the server (express) and create the routes and register
     *  the handlers.
     */
    self.initializeServer = function() {
        self.createRoutes();
        self.app = express();

        self.app.use(bodyParser.json()); // support json encoded bodies
        self.app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

        

        //  Add handlers for the app (from the routes).
        for (var r in self.routes) {
            self.app.get(r, self.routes[r]);
        }
        for (var r in self.postroutes) {
            self.app.post(r, self.postroutes[r]);
        }
        require('./app/apiroutes')(self);
    };


    /**
     *  Initializes the sample application.
     */
    self.initialize = function() {
        self.setupVariables();
        self.populateCache();
        self.setupTerminationHandlers();

        // Create the express server and routes.
        self.initializeServer();
    };


    /**
     *  Start the server (starts up the sample application).
     */
    self.start = function() {
        self.app.engine('html', ejs.renderFile);
        self.app.use(express.static(path.join(__dirname, 'public')));
        //  Start the app on the specific interface (and port).
        self.app.listen(self.port, self.ipaddress, function() {
            console.log('%s: Node server started on %s:%d ...',
                        Date(Date.now() ), self.ipaddress, self.port);
        });
    };

};   /*  Sample Application.  */



/**
 *  main():  Main code.
 */
var zapp = new SampleApp();
zapp.initialize();
zapp.start();

