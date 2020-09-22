/** Main app for server to start a small REST API for tweets
 * The included ./blackbox/store.js gives you access to a "database" which contains
 * already tweets with id 101 and 102, as well as users with id 103 and 104.
 * On each restart the db will be reset (it is only in memory).
 * Best start with GET http://localhost:3000/tweets to see the JSON for it
 *
 * TODO: Start the server and play a little with Postman
 * TODO: Look at the Routes-section (starting line 68) and start there to add your code 
 * 
 * @author Johannes Konert
 * @licence CC BY-SA 4.0
 *
 */
"use strict";  // tell node.js to be more "strict" in JavaScript parsing (e.g. not allow variables without var before)

// node module imports
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');

// our own modules imports
var store = require('./blackbox/store.js');

// creating the server application
var app = express();

// Helper functions ******************************

/**
 * Function to match ids and ids or ids and href.
 * By splitting the href you access the id.
 * @param pattern to match a string
 * @param string to match a pattern
 * @returns boolean
 */
function stringMatcher(pattern, string) {
    var tempArray = [];
    string = string + '';
    tempArray = string.split('/') || [string];
    
    console.log('Matching IDs !');
    console.log('String: ' + tempArray[tempArray.length - 1] + ' Pattern: ' + pattern);
    
    if (tempArray[tempArray.length - 1] == pattern) {
        console.log('true');
        return true;
    } else {
        console.log('false');
        return false;
    }
}

/**
 * Function to show all Users.
 * shows the Relation between Users and Tweets.
 * @param request object
 * @param response object
 * @returns void
 */
function deepLookIntoUsers (res, req) {
    var jsonObject = {};
    var jsonArrayUsers = store.select('users');
    var jsonArrayTweets = store.select('tweets');
    
    if(req.query.expand === 'tweets'){
        for (var i = 0; i < jsonArrayUsers.length; i++){
            var index = 0;
            jsonArrayUsers[i].tweets = {};
            jsonArrayUsers[i].tweets.href = req.protocol + '://' + req.get('host') + req.path + '/' + jsonArrayUsers[i].id + "/tweets";
            jsonArrayUsers[i].tweets.item = [];
            jsonObject.href = req.protocol + '://' + req.get('host') + req.originalUrl;
        
            for (var j = 0; j < jsonArrayTweets.length; j++){
                if (stringMatcher(jsonArrayUsers[i].id, jsonArrayTweets[j].creator.href)){
                    jsonArrayUsers[i].tweets.item[index] = jsonArrayTweets[j];
                    jsonArrayUsers[i].tweets.item[index].href = req.protocol + '://' + req.get('host') + '/tweets/' + jsonArrayTweets[j].id;
                    index++;
                }    
            }
        } 
    } else {
        jsonObject.href = req.protocol + '://' + req.get('host') + req.path;
        for (var i = 0; i < jsonArrayUsers.length; i++){
            jsonArrayUsers[i].tweets = {};
            jsonArrayUsers[i].tweets.href = req.protocol + '://' + req.get('host') + req.path + '/' + jsonArrayUsers[i].id + "/tweets";
        }
    }
    
    jsonObject.item = jsonArrayUsers;
    
    res.json(jsonObject);
}

/**
 * Function to show all Tweetss.
 * shows the Relation between Tweets and Users.
 * @param request object
 * @param response object
 * @returns void
 */
function deepLookIntoTweets (res, req) {
    var jsonObject = {};
    var jsonArrayUsers = store.select('users');
    var jsonArrayTweets = store.select('tweets');
    
    
    if(req.query.expand === 'users'){
        for (var i = 0; i < jsonArrayTweets.length; i++){
            var index = 0;
            jsonArrayTweets[i].users = {}
            jsonArrayTweets[i].users.href = req.protocol + '://' + req.get('host') + req.path + '/' + jsonArrayTweets[i].id + "/users";
            jsonArrayTweets[i].users.item = [];
            var creatorID = jsonArrayTweets[i].creator.href.split('/');
            jsonObject.href = req.protocol + '://' + req.get('host') + req.originalUrl;
            
            for (var j = 0; j < jsonArrayUsers.length; j++){
                if (stringMatcher(creatorID[creatorID.length - 1], jsonArrayUsers[j].id)){
                    jsonArrayTweets[i].users.item[index] = jsonArrayUsers[j];
                    jsonArrayTweets[i].users.item[index].href = req.protocol + '://' + req.get('host') + '/users/' + jsonArrayUsers[j].id;
                    index++;
                }    
            }
        }
    } else {
        jsonObject.href = req.protocol + '://' + req.get('host') + req.path;
        for(var i = 0; i < jsonArrayTweets.length; i++){
          jsonArrayTweets[i].users = {}
            jsonArrayTweets[i].users.href = req.protocol + '://' + req.get('host') + req.path + '/' + jsonArrayTweets[i].id + "/users";  
        }
    }
    
    jsonObject.item = jsonArrayTweets;
    
    res.json(jsonObject);
}

/**
 * Function to show one User based on id.
 * shows the Relation between User and Tweets.
 * @param request object
 * @param response object
 * @returns void
 */
function flatLookIntoUsers (res, req) {
    var jsonObjectUser = store.select('users', req.params.id);
    var jsonArrayTweets = store.select('tweets');
    var index = 0;
    
    if(jsonObjectUser === undefined){
        res.status('404').send('Invalid id.');
        return;
    } else if(jsonObjectUser.id === undefined){
        res.status('404').send('Invalid id.');
        return;
    } else if(req.query.expand === 'tweets') {
        jsonObjectUser.href = req.protocol + '://' + req.get('host') + req.originalUrl;
        jsonObjectUser.tweets = {};
        jsonObjectUser.tweets.href = req.protocol + '://' + req.get('host') + req.path + '/tweets';
        jsonObjectUser.tweets.item = [];
    
        for (var i = 0; i < jsonArrayTweets.length; i++){
            if (stringMatcher(jsonObjectUser.id, jsonArrayTweets[i].creator.href)){
                jsonObjectUser.tweets.item[index] = jsonArrayTweets[i];
                jsonObjectUser.tweets.item[index].href = req.protocol + '://' + req.get('host') + '/tweets/' + jsonArrayTweets[i].id;
                index++;
            }
        }
    
    } else {
        jsonObjectUser.href = req.protocol + '://' + req.get('host') + req.path;
        jsonObjectUser.tweets = {};
        jsonObjectUser.tweets.href = req.protocol + '://' + req.get('host') + req.path + '/tweets'; 
    }
    
    res.json(jsonObjectUser);
}

/**
 * Function to show one Tweet based on id.
 * shows the Relation between Tweet and Users.
 * @param request object
 * @param response object
 * @returns void
 */
function flatLookIntoTweets (res, req) {
    var jsonArrayUsers = store.select('users');
    var jsonObjectTweet = store.select('tweets', req.params.id);
    var index = 0;
    
    if(jsonObjectTweet === undefined){
        res.status('404').send('Invalid id.');
        return;
    } else if(jsonObjectTweet.id === undefined){
        res.status('404').send('Invalid id.');
        return;
    } else if(req.query.expand === 'users'){
        var creatorID = jsonObjectTweet.creator.href.split('/');
        jsonObjectTweet.href = req.protocol + '://' + req.get('host') + req.originalUrl;
        jsonObjectTweet.users = {};
        jsonObjectTweet.users.href = req.protocol + '://' + req.get('host') + req.path + '/users';
        jsonObjectTweet.users.item = [];
    
        for (var i = 0; i < jsonArrayUsers.length; i++){
            if (stringMatcher(creatorID[creatorID.length -1], jsonArrayUsers[i].id)){
                jsonObjectTweet.users.item[index] = jsonArrayUsers[i];
                jsonObjectTweet.users.item[index].href = req.protocol + '://' + req.get('host') + '/users/' + jsonArrayUsers[i].id;
                index++;
            }
        }
    }else {
        jsonObjectTweet.href = req.protocol + '://' + req.get('host') + req.path;
        jsonObjectTweet.users = {};
        jsonObjectTweet.users.href = req.protocol + '://' + req.get('host') + req.path + '/users';
    }
    
    res.json(jsonObjectTweet);
}

/**
 * Function to patch one Tweet based on id.
 * changes partially values of Tweet
 * @param request object
 * @param response object
 * @returns void
 */
function patchingTweets (res, req) {
    var jsonObjectTweet = store.select('tweets', req.param.id);
    var newJsonOpjectTweet = req.body;
    
    if(jsonObjectTweet !== undefined){
        Object.assign(jsonObjectTweet, newJsonOpjectTweet);
        res.status(200).json(jsonObjectTweet);
    }else{
        res.status(404).send('Invalid id !');
    }
}

// Middleware ************************************
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// logging
app.use(function(req, res, next) {
    console.log('Request of type '+req.method + ' to URL ' + req.originalUrl);
    next();
});

// API-Version control. We use HTTP Header field Accept-Version instead of URL-part /v1/
app.use(function(req, res, next){
    // expect the Accept-Version header to be NOT set or being 1.0
    var versionWanted = req.get('Accept-Version');
    if (versionWanted !== undefined && versionWanted !== '1.0') {
        // 406 Accept-* header cannot be fulfilled.
        res.status(406).send('Accept-Version cannot be fulfilled').end();
    } else {
        next(); // all OK, call next handler
    }
});

// request type application/json check
app.use(function(req, res, next) {
    if (['POST', 'PUT'].indexOf(req.method) > -1 &&
        !( /application\/json/.test(req.get('Content-Type')) )) {
        // send error code 415: unsupported media type
        res.status(415).send('wrong Content-Type');  // user has SEND the wrong type
    } else if (!req.accepts('json')) {
        // send 406 that response will be application/json and request does not support it by now as answer
        // user has REQUESTED the wrong type
        res.status(406).send('response of application/json only supported, please accept this');
    }
    else {
        next(); // let this request pass through as it is OK
    }
});


// Routes ***************************************

app.get('/tweets', function(req,res,next) {   
    deepLookIntoTweets(res, req);
});

app.post('/tweets', function(req,res,next) {
    var id = store.insert('tweets', req.body); 
    // set code 201 "created" and send the item back
    res.status(201).json(store.select('tweets', id));
});


app.get('/tweets/:id', function(req,res,next) {
    flatLookIntoTweets(res, req);
});

app.delete('/tweets/:id', function(req,res,next) {
    store.remove('tweets', req.params.id);
    res.status(200).end();
});

app.put('/tweets/:id', function(req,res,next) {
    store.replace('tweets', req.params.id, req.body);
    res.status(200).end();
});

app.patch('/tweets/:id', function(req,res,next){
    patchingTweets(res, req);
});


// TODO: add your routes etc.

app.get('/users', function(req,res,next) {
    deepLookIntoUsers(res, req);
});

app.post('/users', function(req,res,next) {
    var id = store.insert('users', req.body); 
    // set code 201 "created" and send the item back
    res.status(201).json(store.select('users', id));
});


app.get('/users/:id', function(req,res,next) {
    flatLookIntoUsers(res, req);
});

app.delete('/users/:id', function(req,res,next) {
    store.remove('users', req.params.id);
    res.status(200).end();
});

app.put('/users/:id', function(req,res,next) {
    store.replace('users', req.params.id, req.body);
    res.status(200).end();
});

// CatchAll for the rest (unfound routes/resources) ********
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers (express recognizes it by 4 parameters!)

// development error handler
// will print stacktrace as JSON response
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        console.log('Internal Error: ', err.stack);
        res.status(err.status || 500);
        res.json({
            error: {
                message: err.message,
                error: err.stack
            }
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message,
            error: {}
        }
    });
});


// Start server ****************************
app.listen(3000, function(err) {
    if (err !== undefined) {
        console.log('Error on startup, ',err);
    }
    else {
        console.log('Listening on port 3000');
    }
});