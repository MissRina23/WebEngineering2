"use strict;"

var bodyValidator = require('./bodyValidator');

var queryValidator = {
    
    /**
    * Function to check if query is set
    * @param queryObj - {}
    * @return true - if queryObj is set. 
    */
    isQuerySet: function(queryObj){
        // checks if query is set
        if(Object.keys(queryObj).length === 0){
            return false;
        }
        
        return true;
    },
    
    /**
    * Function to check if filter is set
    * @param filterString - filter string
    * @return true - if filter is set. 
    */
    isFilterSet: function(filterString){
        // checks if filter is undefined
        if(typeof filterString === 'undefined'){
            return false;
        }
        
        return true;
    },
    
    /**
    * Function to check if filter has unknown values
    * @param filterString - filter string
    * @param requiredObj - object contain all required keys
    * @param optinalObj - object contain all optional keys
    * @param internalObj - object contain all internal key
    * @return true - if filter has unknown keys. 
    */
    isFilterValid: function(filterString, requiredObj, optionalObj, internalObj){
        var filterArray = filterString.trim().split(',');
        
        // checks if filter is empty
        if(filterArray.length == 0){
            return false;
        }
        
        // checks if filter has unknown keys
        for(var index = 0; index < filterArray.length; index++){
            var hit = 0;
            
            if(typeof requiredObj[filterArray[index]] !== 'undefined'){ hit++; }
            if(typeof optionalObj[filterArray[index]] !== 'undefined'){ hit++; }
            if(typeof internalObj[filterArray[index]] !== 'undefined'){ hit++; }
            
            if(hit == 0){
                return false;
            }
        }
        
        return true;
    },
    
    /**
    * Function to check if limit is set
    * @param limit - number
    * @return true - if limit is set. 
    */
    isLimitSet: function(limit){
        // checks if limit is undefined
        if(typeof limit === 'undefined'){
            return false;
        }
        
        return true;
    },
    
    /**
    * Function to check if limit is valid
    * @param limit - number
    * @return true - if limit is greater then 0. 
    */
    isLimitValid: function(limit){
        // checks if limit is valid
        if(isNaN(parseInt(limit))){
            return false;
        }
        
        if(parseInt(limit) <=0){
           return false; 
        }
        
        return true;
    },
        
    /**
    * Function to check if offset is set
    * @param limit - number
    * @return true - if offset is set. 
    */
    isOffsetSet: function(offset){
        // checks if offset is undefined
        if(typeof offset === 'undefined'){
            return false;
        }
        
        return true;
    },
    
    /**
    * Function to check if offset is valid
    * @param offset - number
    * @return true - if offset is not negative. 
    */
    isOffsetValid: function(offset){
        // checks if offset is valid
        if(isNaN(parseInt(offset))){
            return false;
        }
        
        if(parseInt(offset) <0){
           return false; 
        }
        
        return true;
    },
    
    /**
    * Function to check if offset is not out of bound
    * @param offset - number
    * @param objLength - number
    * @return true - if offset is not negative. 
    */
    isOffsetInBounds: function(offset, objLength){
        // checks if offset is inside the bounds
        if(parseInt(offset) >= objLength){
            return false;
        }
        
        return true;
    },
    
    /**
    * Function to check if query has unknown values
    * @param queryObj - {}
    * @param requiredObj - object contain all required keys
    * @param optinalObj - object contain all optional keys
    * @param internalObj - object contain all internal key
    * @return true - if filter has unknown keys. 
    */
    hasQueryBodyUnknownKeys: function(queryObj, requiredObj, optionalObj, internalObj){
        // checks if keys are unknown
        for(queryKey in queryObj){
            var hit = 0
            
            if(typeof requiredObj[queryKey] !== 'undefined'){ hit++; }
            if(typeof optionalObj[queryKey] !== 'undefined'){ hit++; }
            if(typeof internalObj[queryKey] !== 'undefined'){ hit++; }
            if(queryKey === 'filter'){ hit++; }
            if(queryKey === 'limit'){ hit++; }
            if(queryKey === 'offset'){ hit++; }
            
            if(hit == 0){
                return true;
            } 
        }
        
        return false;
    }
};

module.exports = queryValidator;