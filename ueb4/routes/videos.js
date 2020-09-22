/** This module defines the routes for videos using the store.js as db memory
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
var logger = require('debug')('me2u4:videos');
var store = require('../blackbox/store');
var responseBuilder = require('../tools/builder/responseBuilder');
var bodyValidator = require('../tools/validator/bodyValidator');
var queryValidator = require('../tools/validator/queryValidator');
var crudValidator = require('../tools/validator/crudValidator');
var objectDefaultMatcher = require('../tools/matcher/objectDefaultMatcher');

var videos = express.Router();

// if you like, you can use this for task 1.b:
var requiredKeys = {title: 'string', src: 'string', length: 'number'};
var optionalKeys = {description: 'string', playcount: 'number', ranking: 'number'};
var internalKeys = {id: 'number', timestamp: 'number'};

// self defiened variables
var databaseIsEmpty = true;
var storedObjectType = 'videos';


// routes **********************
videos.route('/')
    .get(function(req, res, next){
        var tempValidatorObject = {};
    
        // 204 response if db is empty
        if(databaseIsEmpty){
            responseBuilder.buildNoContent(res);
        }
        
        // returns an validator object that could contain a result object 
        tempValidatorObject = crudValidator.validateGetAll(storedObjectType);
         
        // check if something was found and send a response
        if(tempValidatorObject.valid){
            // query and filter validation
            if(queryValidator.isQuerySet(req.query)){
                // query validation
                if(queryValidator.hasQueryBodyUnknownKeys(req.query, requiredKeys, optionalKeys, internalKeys)){
                    responseBuilder.buildError(res, 400, 'Your query contains unknown parameters!');
                }
                
                // filter vaidation
                if(queryValidator.isFilterSet(req.query.filter)){
                    if(!(queryValidator.isFilterValid(req.query.filter, requiredKeys, optionalKeys, internalKeys))){
                        responseBuilder.buildError(res, 400, 'Your filter contains wrong parameters!');
                    }
                }
                
                // limit validation
                if(queryValidator.isLimitSet(req.query.limit)){
                    if(!(queryValidator.isLimitValid(req.query.limit)) ){
                        responseBuilder.buildError(res, 400, 'Your limit is NaN or less then 0!');    
                    }
                }
                
                // offset validation
                if(queryValidator.isOffsetSet(req.query.offset)){
                    if(!(queryValidator.isOffsetValid(req.query.offset)) || !(queryValidator.isOffsetInBounds(req.query.offset, tempValidatorObject.result.length))){
                        responseBuilder.buildError(res, 400, 'Your Offset is NaN or negativ or out of bound!');    
                    }
                }
                
                tempValidatorObject.result = objectDefaultMatcher.setObjectArrayToOffset(tempValidatorObject.result, req.query.offset);
                tempValidatorObject.result = objectDefaultMatcher.setObjectArrayToLimit(tempValidatorObject.result, req.query.limit);
                tempValidatorObject.result = objectDefaultMatcher.setObjectArrayToFilterArguments(tempValidatorObject.result, req.query.filter);
                
                // change status to 200 for successful filtering
                tempValidatorObject.code = 200;
            }
            
            
            responseBuilder.buildSuccess(res, tempValidatorObject.code, tempValidatorObject.result);
        } else {
            responseBuilder.buildError(res, tempValidatorObject.code, tempValidatorObject.msg);
        }
    })
    .post(function(req, res, next){
        var tempValidatorObject = {};
        var matchedObject = {};
    
        // check if required keys are valid or send 400
        if(!(bodyValidator.isRequiredValid(req.body, requiredKeys) && bodyValidator.isRequiredDataTypeValid(req.body, requiredKeys))){
           responseBuilder.buildError(res, 400, 'Your request body does not fit the requirements! (wrong or undefined data types/values)'); 
        }
        
        // checks if there a unknown keys inside the request body, if true send 400 + message
        if(bodyValidator.hasObjectUnknownKey(req.body, requiredKeys, optionalKeys, internalKeys)){
            responseBuilder.buildError(res, 400, 'Your request body has unknown keys!');
        }
    
        // check if object keys have fitting data types and values else send 400
        if(!(bodyValidator.hasObjectFittingDataTypes(req.body, requiredKeys, optionalKeys, internalKeys))){
                responseBuilder.buildError(res, 400, 'Your request body has unfitting keys! (wrong data types/values)');
        }
        
        // force default all optional keys
        matchedObject = objectDefaultMatcher.setDefaultsForGivenObject(req.body, optionalKeys);
        // setting internal timestamp 
        matchedObject.timestamp = (new Date()).getTime();
        // set internal id undefined for insert
        matchedObject.id = undefined;
        // creating a object and construct a response
        tempValidatorObject = crudValidator.validatePost(storedObjectType, matchedObject);
                
        if(tempValidatorObject.valid){
            databaseIsEmpty = false;
            responseBuilder.buildSuccess(res, tempValidatorObject.code, tempValidatorObject.result);
        } else {
            responseBuilder.buildError(res, tempValidatorObject.code, tempValidatorObject.msg);
        }
                
    })
    .put(function(req, res, next){
        responseBuilder.buildError(res, 405, 'Methode not allowed! ( put at / ) ');
    })
    .delete(function(req, res, next) {
        responseBuilder.buildError(res, 405, 'Methode not allowed! ( delete at / ) ');
    });

videos.route('/:id')
    .get(function(req, res, next){
        var tempValidatorObject = {};
    
        // 204 response if db is empty
        if(databaseIsEmpty){
            responseBuilder.buildNoContent(res);
        }
        
        // returns an validator object that could contain a result object 
        tempValidatorObject = crudValidator.validateGet(storedObjectType, req.params.id);
        

    
        // check if something was found and send a response
        if(tempValidatorObject.valid){
            // query and filter validation
            if(queryValidator.isQuerySet(req.query)){
                // query validation
                if(queryValidator.hasQueryBodyUnknownKeys(req.query, requiredKeys, optionalKeys, internalKeys)){
                    responseBuilder.buildError(res, 400, 'Your query contains unknown parameters!');
                }
                
                // filter validation
                if(queryValidator.isFilterSet(req.query.filter)){
                    if(!(queryValidator.isFilterValid(req.query.filter, requiredKeys, optionalKeys, internalKeys))){
                        responseBuilder.buildError(res, 400, 'Your filter contains wrong parameters!');
                    }
                }
                
                // limit validation
                if(queryValidator.isLimitSet(req.query.limit)){
                    if(!(queryValidator.isLimitValid(req.query.limit)) || !(queryValidator.isLimitInBounds(req.query.limit, 0))){
                        responseBuilder.buildError(res, 400, 'You cannot use limit on a single object!');    
                    }
                }
                
                // offset validation
                if(queryValidator.isOffsetSet(req.query.offset)){
                    if(!(queryValidator.isOffsetValid(req.query.offset)) || !(queryValidator.isOffsetInBounds(req.query.offset, -1))){
                        responseBuilder.buildError(res, 400, 'You cannot use offset on a single object!');    
                    }
                }
                
                tempValidatorObject.result = objectDefaultMatcher.setObjectToFilterArguments(tempValidatorObject.result, req.query.filter);
                
                // change status to 200 for successful filtering
                tempValidatorObject.code = 200;
                
            }
            
            responseBuilder.buildSuccess(res, tempValidatorObject.code, tempValidatorObject.result);
        } else {
            responseBuilder.buildError(res, tempValidatorObject.code, tempValidatorObject.msg);
        }
        
    })
    .put(function(req, res, next){
        var tempValidatorObject = {};
    
        // PUT - needs the whole data set
        // check if required keys are valid or send 400
        if(!(bodyValidator.isRequiredValid(req.body, requiredKeys) && bodyValidator.isRequiredDataTypeValid(req.body, requiredKeys))){
           responseBuilder.buildError(res, 400, 'Your request body does not fit the requirements! (wrong or undefined data types/values)'); 
        }
    
        // check if optinal keys are valid or send 400
        if(!(bodyValidator.isOptionalValid(req.body, optionalKeys) && bodyValidator.isOptionalDataTypeValid(req.body, optionalKeys))){
           responseBuilder.buildError(res, 400, 'Your request body does not fit the optionals! (wrong or undefined data types/values)'); 
        }
        
        // check if inernal keys are valid or send 400
        if(!(bodyValidator.isInternalValid(req.body, internalKeys) && bodyValidator.isInternalDataTypeValid(req.body, internalKeys))){
           responseBuilder.buildError(res, 400, 'Your request body does not fit the internals! (wrong or undefined data types/values)'); 
        }
    
        // check of unknown keys
        if(bodyValidator.hasObjectUnknownKey(req.body, requiredKeys, optionalKeys, internalKeys)){
                responseBuilder.buildError(res, 400, 'Your request body has unknown keys!');
        }
    
        // update the given object on id
        tempValidatorObject = crudValidator.validatePut(storedObjectType, req.body, req.params.id);
    
        // construct response
        if(tempValidatorObject.valid){
            responseBuilder.buildSuccess(res, tempValidatorObject.code, tempValidatorObject.result);
        } else {
            responseBuilder.buildError(res, tempValidatorObject.code, tempValidatorObject.msg);
        }
    
    })
    .delete(function(req, res, next){
        var tempValidatorObject = {};
    
        // returns an validator object that could contain a result object 
        tempValidatorObject = crudValidator.validateDelete(storedObjectType, req.params.id);
        
        // check if database is empty after delete
        if((crudValidator.validateGetAll(storedObjectType)).code == 404){
            databaseIsEmpty = true;
        }
    
        // check if something was found and send a response
        if(tempValidatorObject.valid){
            responseBuilder.buildNoContent(res);
        } else {
            responseBuilder.buildError(res, tempValidatorObject.code, tempValidatorObject.msg);
        }
    })
    .post(function(req, res, next){
        responseBuilder.buildError(res, 405, 'Methode not allowed! ( post at /:id ) ');
    });

module.exports = videos;
