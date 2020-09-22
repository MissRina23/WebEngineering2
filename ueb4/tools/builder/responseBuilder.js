"use strict;"

var responseBuilder = {
    
    /**
    * Function to construct and send a successful response to a request.
    * @param response - given response object to a request
    * @param status - given http-status code
    * @param data - json object as given result of a request
    */
    buildSuccess: function(response, status, data) {
        response.set('Content-Type', 'application/json');
        response.status(status);
        response.json(data);
        response.end();
    },
    
    /**
    * Function to construct and send a 204 response to a request.
    * @param response - given response object to a request
    */
    buildNoContent: function(response){
        response.set('Content-Type', 'application/json');
        response.status(204).end();
    },
    
    /**
    * Function to construct and send a error response to a request.
    * @param response - given response object to a request
    * @param status - given http-status code
    * @param msg - an error message as string
    */
    buildError: function(response, status, msg) {
        response.set('Content-Type', 'application/json');
        response.status(status)
        response.send({ error: { message: msg, code: status} });
        response.end();
    }
    
};

module.exports = responseBuilder;