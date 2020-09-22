"use strict;"

var store = require('../../blackbox/store');

var crudValidator = {
    
    /**
    * Function to insert a object into a store.
    * @param objectType - type to set for the object that will be created
    * @param bodyObj - object to fill into a store
    * @return {} - object with valid, result, msg and code key 
    */
    validatePost: function(objectType, bodyObj){
        var tempId;
        var createdObj;
        bodyObj.id = undefined;
        tempId = store.insert(objectType, bodyObj);
        createdObj = store.select(objectType, tempId);
        return { valid: true, result: createdObj, msg: 'successful created!', code: 201 };
    },
    
    /**
    * Function to update a object into a store.
    * @param objectType - type to set for the object that will be created
    * @param bodyObj - object to fill into a store
    * @param id - object id
    * @return {} - object with valid, result, msg and code key 
    */
    validatePut: function(objectType, bodyObj, id){
        if(typeof id === 'undefined' || isNaN(parseInt(id))){
            return { valid: false, result: {}, msg: 'given id is incorrect!', code: 400 };
        }
        
        if( id != bodyObj.id){
            return { valid: false, result: {}, msg: 'id conflict on request! ' + 'idUrl: ' + id + ' idBody: ' + bodyObj.id, code: 400 };
        }
        
        var tempStore = store.select(objectType, id);
        
        if(typeof tempStore === 'undefined'){
            return { valid: false, result: tempStore, msg: 'object could not be found!', code: 404 };
        } else {
            store.replace(objectType, id, bodyObj);
            tempStore = store.select(objectType, id);
            return { valid: true, result: tempStore, msg: 'successful updated!', code: 200 };
        } 
    },
    
     /**
    * Function to select all objects of a given type in a store.
    * @param objectType - type to set for the object that will be created
    * @return {} - object with valid, result, msg and code key 
    */
    validateGetAll: function(objectType){
        var tempStore = store.select(objectType);
        
        if(typeof tempStore === 'undefined'){
            return { valid: false, result: tempStore, msg: 'object could not be found!', code: 404 };
        } else {
            return { valid: true, result: tempStore, msg: 'results found!', code: 200 };
        }
    },
    
    /**
    * Function to select a object with given id in a store.
    * @param objectType - type to set for the object that will be created
    * @param id - object id
    * @return {} - object with valid, result, msg and code key 
    */
    validateGet: function(objectType, id){
        if(typeof id === 'undefined' || isNaN(parseInt(id))){
            return { valid: false, result: {}, msg: 'given id is incorrect!', code: 400 };
        }
        
        var tempStore = store.select(objectType, id);
        
        if(typeof tempStore === 'undefined'){
            return { valid: false, result: tempStore, msg: 'object could not be found!', code: 404 };
        } else {
            return { valid: true, result: tempStore, msg: 'results found!', code: 200 };
        }
    },
    
    /**
    * Function to delete a object with given id in a store.
    * @param objectType - type to set for the object that will be created
    * @param id - object id
    * @return {} - object with valid, result, msg and code key 
    */
    validateDelete: function(objectType, id){
        if(typeof id === 'undefined' || isNaN(parseInt(id))){
            return { valid: false, result: {}, msg: 'given id is incorrect!', code: 400 };
        }
        
        var tempStore = store.select(objectType, id);
        
        if(typeof tempStore === 'undefined'){
            return { valid: false, result: tempStore , msg: 'object could not be found!', code: 404 };
        } else {
            store.remove(objectType, id);
            return { valid: true, result: tempStore, msg: 'object removed!', code: 204 };
        }
    } 
};

module.exports = crudValidator;