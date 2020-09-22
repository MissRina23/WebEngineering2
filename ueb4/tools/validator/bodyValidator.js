"use strict;"

var bodyValidator = {
    
    /**
    * Function to check if object has all required keys
    * @param bodyObj - object that will be checked
    * @param requiredObj - object contain all required keys
    * @return true - if all required key are set. 
    */
    isRequiredValid: function(bodyObj, requiredObj){
        var numberOfKeys = Object.keys(requiredObj).length;
        var hitCounter = 0;
        
        for(requiredKey in requiredObj){
            if(typeof bodyObj[requiredKey] !== 'undefined'){
                hitCounter++;
            }
        }
        
        if(hitCounter == numberOfKeys){
            return true;
        }
        
        return false;
    },
    
    /**
    * Function to check if object has all optional keys
    * @param bodyObj - object that will be checked
    * @param optinalObj - object contain all optional keys
    * @return true - if all optinal key are set. 
    */
    isOptionalValid: function(bodyObj, optinalObj){
        var numberOfKeys = Object.keys(optinalObj).length;
        var hitCounter = 0;
        
        for(optinalKey in optinalObj){
            if(typeof bodyObj[requiredKey] !== 'undefined'){
                hitCounter++;
            }
        }
        
        if(hitCounter == numberOfKeys){
            return true;
        }
        
        return false;
    },
    
    /**
    * Function to check if object has all internal keys
    * @param bodyObj - object that will be checked
    * @param internalObj - object contain all internal keys
    * @return true - if all internal key are set. 
    */
    isInternalValid: function(bodyObj, internalObj){
        var numberOfKeys = Object.keys(internalObj).length;
        var hitCounter = 0;
        
        for(internalKey in internalObj){
            if(typeof bodyObj[internalKey] !== 'undefined'){
                hitCounter++;
            }
        }
        
        if(hitCounter == numberOfKeys){
            return true;
        }
        
        return false;
    },
    
    /**
    * Function to check if object has some unknown keys
    * @param bodyObj - object that will be checked
    * @param requiredObj - object contain all required keys
    * @param optinalObj - object contain all optional keys
    * @param internalObj - object contain all internal keys
    * @return true - if unknown keys were found. 
    */
    hasObjectUnknownKey: function(bodyObj, requiredObj, optionalObj, internalObj){
        for(bodyKey in bodyObj){
            if(this.isRequiredValid(bodyObj, requiredObj)){
                
            } else if(this.isOptionalValid(bodyObj, optionalObj)){
                
            } else if(this.isInternalValid(bodyObj, internalObj)){
                
            } else {
                return true;
            }
        }
        
        return false;
    },
    
    /**
    * Function to check if object has all required keys with the correct data type
    * @param bodyObj - object that will be checked
    * @param requiredObj - object contain all required keys
    * @return true - if all required key are set with the right data type. 
    */
    isRequiredDataTypeValid: function(bodyObj, requiredObj){
        for(requiredKey in requiredObj){
            if(typeof bodyObj[requiredKey] !== requiredObj[requiredKey]){
                return false;
            }
        }
        
        if(typeof bodyObj.length !== 'undefined' && bodyObj.length < 0){
            return false;
        }
        
        return true;
    },
    
    /**
    * Function to check if object has all optinal keys with the correct data type
    * @param bodyObj - object that will be checked
    * @param optinalObj - object contain all optinal keys
    * @return true - if all optinal key are set with the right data type. 
    */
    isOptionalDataTypeValid: function(bodyObj, optinalObj){
        for(optinalKey in optinalObj){
            if(typeof bodyObj[optinalKey] !== optinalObj[optinalKey]){
                return false;
            }
        }
        
         if(typeof bodyObj.playcount !== 'undefined' && bodyObj.playcount < 0){
            return false;
        }
        
        if(typeof bodyObj.ranking !== 'undefined' && bodyObj.ranking < 0){
            return false;
        }
        
        return true;
    },
    
    /**
    * Function to check if object has all internal keys with the correct data type
    * @param bodyObj - object that will be checked
    * @param internalObj - object contain all internal keys
    * @return true - if all internal key are set with the right data type. 
    */
    isInternalDataTypeValid: function(bodyObj, internalObj){
       for(internalKey in internalObj){
            if(typeof bodyObj[internalKey] !== internalObj[internalKey]){
                return false;
            }
        }
        
        return true; 
    },
    
    /**
    * Function to check if object keys have a valid data type
    * @param bodyObj - object that will be checked
    * @param requiredObj - object contain all required keys
    * @param optinalObj - object contain all optional keys
    * @param internalObj - object contain all internal keys
    * @return true - if keys have the correct data type. 
    */
    hasObjectFittingDataTypes: function(bodyObj, requiredObj, optionalObj, internalObj){
        for(bodyKey in bodyObj){
            if(typeof requiredObj[bodyKey] !== 'undefined' && requiredObj[bodyKey] !== typeof bodyObj[bodyKey]){
                return false;
            }
            if(typeof optionalObj[bodyKey] !== 'undefined' && optionalObj[bodyKey] !== typeof bodyObj[bodyKey]){
                return false;
            }
            if(typeof internalObj[bodyKey] !== 'undefined' && internalObj[bodyKey] !== typeof bodyObj[bodyKey]){
                return false;
            }
        }
        
        if(typeof bodyObj.length !== 'undefined' && bodyObj.length < 0){
            return false;
        }
        
        if(typeof bodyObj.playcount !== 'undefined' && bodyObj.playcount < 0){
            return false;
        }
        
        if(typeof bodyObj.ranking !== 'undefined' && bodyObj.ranking < 0){
            return false;
        }
        
        
        return true;
    }
};

module.exports = bodyValidator;