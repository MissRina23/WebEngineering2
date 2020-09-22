"use strict;"

var objectDefaultMatcher = {
    
    /**
    * Function to set default values for undefined keys given by a matcher object.
    * @param bodyObj - object to set
    * @param matcherObj - object contais keys that should be set
    * @return {} - object with valid set keys 
    */
    setDefaultsForGivenObject: function(bodyObj, matcherObj){
        for(matcherKey in matcherObj){
            if(typeof bodyObj[matcherKey] === 'undefined'){
                switch (matcherObj[matcherKey]){
                    case 'string':
                        bodyObj[matcherKey] = '';
                        break;
                    case 'number':
                        bodyObj[matcherKey] = 0;
                        break;
                    default:
                        bodyObj[matcherKey] = 'err';
                        break;
                }
            }
        }
        
        return bodyObj;
    },
    
    /**
    * Function to construct a new array based on offset.
    * @param array - []
    * @param offset - number
    * @return [] - modefied array 
    */
    setObjectArrayToOffset: function(array, offset){
        if(typeof offset === 'undefined' || isNaN(parseInt(offset))){ return array; }
        return array.slice(parseInt(offset), array.length);
    },
    
    /**
    * Function to construct a new array based on limit.
    * @param array - []
    * @param limit - number
    * @return [] - modefied array
    */
    setObjectArrayToLimit: function(array, limit){
        if(typeof limit === 'undefined' || isNaN(parseInt(limit))){ return array; }
        if(parseInt(limit) > array.length){ return array; }
        return array.slice(0, parseInt(limit));
    },
    
    /**
    * Function to construct a new array based on filters.
    * @param array - []
    * @param filterString - string
    * @return [] - modefied array
    */
    setObjectArrayToFilterArguments: function(array, filterString){
        if(typeof filterString === 'undefined'){ return array; }
        var filterArray = filterString.split(',');
        var deletableKeys = [];
        
        // go though an object and look if the key is inside the filter then go to the next or push it into deletable
        var objectInArray = array[0];
            
        for(key in objectInArray){
            if(!(filterArray.indexOf(key) > -1)){
                deletableKeys.push(key);
            }
        }
        
        // check if there are keys you must delete
        if(deletableKeys == []){
            return array;
        }
        
        // remove keys from array objects
        for(var index = 0; index < array.length; index++){
            for(var j = 0; j < deletableKeys.length; j++){
                delete array[index][deletableKeys[j]];
            }
        }
        
        return array;
    },
    
    /**
    * Function to construct a new object based on filters.
    * @param obj - {}
    * @param filterString - string
    * @return {} - modefied opbject
    */
    setObjectToFilterArguments: function(obj, filterString){
        if(typeof filterString === 'undefined'){ return obj; }
        var filterArray = filterString.split(',');
        var deletableKeys = [];
        
        // go though an object and look if the key is inside the filter then go to the next or push it into deletable
            
        for(key in obj){
            if(!(filterArray.indexOf(key) > -1)){
                deletableKeys.push(key);
            }
        }
        
        // check if there are keys you must delete
        if(deletableKeys == []){
            return obj;
        }
        
        // remove keys from objects
        for(var j = 0; j < deletableKeys.length; j++){
                delete obj[deletableKeys[j]];
        }
        
        return obj;
    }
    
};

module.exports = objectDefaultMatcher;