/** This module defines the routes for videos using a mongoose model
 *
 * @author Johannes Konert
 * @licence CC BY-SA 4.0
 *
 * @module routes/videos
 * @type {Router}
 */

// remember: in modules you have 3 variables given by CommonJS
// 1.) require() function
// 2.) module.exports
// 3.) exports (which is module.exports)

// modules
var express = require('express');
var logger = require('debug')('me2u5:videos');

// TODO add here your require for your own model file
var mongoose = require('mongoose');
var VideoModel = require('../models/videos');

var videos = express.Router();


// routes **********************
videos.route('/')
    .get(function(req, res, next) {
        VideoModel.find({}, function(err, videoOut){
            if(!err){
                if(videoOut.length == 0){
                    res.set('Content-Type', 'application/json');
                    res.status(204).send();
                    return;
                }
                res.set('Content-Type', 'application/json');
                res.status(200);
                res.json(videoOut);
                return;
            } else {
                next(err);
                return;
            }
        });
    })
    .post(function(req,res,next) {
        req.body.timestamp = new Date().getTime();
        var video = new VideoModel(req.body);
        video.save(function(err, videoIn) {
            if (!err) {
                res.status(201)
                res.json(videoIn);
                return;
            }
            else {  
                err.status = 400; 
                err.message += ' in fields: ' 
                            + Object.getOwnPropertyNames(err.errors); 
                next(err);
                return;
            } 
        });
    })
    .all(function(req, res, next) {
        if (res.locals.processed) {
            next();
        } else {
            // reply with wrong method code 405
            var err = new Error('this method is not allowed at ' + req.originalUrl);
            err.status = 405;
            next(err);
        }
    });

videos.route('/:id')
    .get(function(req, res,next) {
        VideoModel.findById(req.params.id, function(err, videoOut){
            if(!err && videoOut !== null){
                res.set('Content-Type', 'application/json');
                res.status(200);
                res.json(videoOut);
                return;
            } else {
                err = new Error();
                err.status = 404;
                err.message = ' Id not found! ';
                next(err);
                return;
            }
        });
    })
    .put(function(req, res,next) {
        var id = parseInt(req.params.id);
        
        if (id == req.body['_id']) {
            /*
            * Check if every required field is set.
            * set every optional field to default.
            */
            if(typeof req.body.title === 'undefined'){ 
                var err = new Error();
                err.status = 400;
                err.message = 'Title is undefined ! ';
                next(err);
                return;
            }
            
            if(typeof req.body.src === 'undefined'){
                var err = new Error();
                err.status = 400;
                err.message = 'Src is undefined ! ';
                next(err);
                return;
            }
            
            if(typeof req.body.length === 'undefined'){
                var err = new Error();
                err.status = 400;
                err.message = 'Src is undefined ! ';
                next(err);
                return;
            }
            
            if(typeof req.body.description === 'undefined'){
                req.body.description = "";
            }
            
            if(typeof req.body.playcount === 'undefined'){
                req.body.playcount = 0;
            }
            
            if(typeof req.body.length === 'undefined'){
                req.body.length = 0;
            }
            
            if(typeof req.body.ranking === 'undefined'){
                req.body.ranking = 0;
            }
            
            // ignore the __v overwrite
            delete req.body['__v'];
             
            VideoModel.findByIdAndUpdate(req.params.id, req.body, {new: true}, function(err, videoUp){
                if (!err) {
                res.status(200)
                res.json(videoUp);
                return;
                }else { 
                    err.status = 400;
                    /*
                    err.message += ' in fields: ' 
                                + Object.getOwnPropertyNames(err.errors); 
                    */
                    err.message += ' in fields: ' + ' unbekannter Fehler ';
                    next(err);
                    return;
                } 
            });
        }
        else {
            var err = new Error('id of PUT resource and send JSON body are not equal ' + req.params.id + " " + req.body._id);
            err.status = 400;
            next(err);
        }
    })
    .delete(function(req,res,next) {
        VideoModel.findByIdAndRemove(req.params.id, function(err, videoDel){
            if (!err) {
                if(videoDel !== null){
                    res.status(200)
                    res.json(videoDel);
                    return;
                }else{
                    err = new Error();
                    err.status = 404;
                    err.message = 'ID not found ! ';
                }
            }
            else { 
                err.status = 404;
                err.message += ' in fields: ' 
                            + Object.getOwnPropertyNames(err.errors); 
                next(err);
                return;
            }
        });
    })
    .patch(function(req,res,next) {  
        if(req.body.__v){
            delete req.body['__v'];
        }
    
        if(req.body._id){
            delete req.body['_id'];
        }
    
        VideoModel.findByIdAndUpdate(req.params.id, req.body, {new: true}, function(err, videoUp){
            if (!err) {
                res.status(200).json(videoUp);
                return;
            }else { 
                err.status = 400;
                err.message += ' in fields: ' 
                            + Object.getOwnPropertyNames(err.errors); 
                next(err);
                return;
            } 
        });
    })
    .all(function(req, res, next) {
        if (res.locals.processed) {
            next();
        } else {
            // reply with wrong method code 405
            var err = new Error('this method is not allowed at ' + req.originalUrl);
            err.status = 405;
            next(err);
        }
    });


// this middleware function can be used, if you like or remove it
// it looks for object(s) in res.locals.items and if they exist, they are send to the client as json
videos.use(function(req, res, next){
    // if anything to send has been added to res.locals.items
    if (res.locals.items) {
        // then we send it as json and remove it
        res.json(res.locals.items);
        delete res.locals.items;
    } else {
        // otherwise we set status to no-content
        res.set('Content-Type', 'application/json');
        res.status(204).end(); // no content;
    }
});

module.exports = videos;