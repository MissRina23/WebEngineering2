/*
*   Node Server MME2
*   Team: FullStack
*   Author: Stefan Streichan
*   
*
*/

"use strict";

/*=========================================================================
* Declaration And Initialization
=========================================================================*/

// Import of the express module
var express = require('express');
// Import of the path module
var path = require('path');
// Import of File System
var fileSystem = require('fs');

// Reference of the express server from the express module
var app = express();
// System Time Stamp One
var systemTimeStampOne;
// System Time Stamp Two
var systemTimeStampTwo;
// System Date
var date;
// System Time
var sysTime;
// Router (Middleware) to use /time
var sysTimeRouter = express.Router();
// Router (Middleware) to use /file
var sysFileRouter = express.Router();
// File buffer for Memorization
var fileBuffer;

/*=========================================================================
* Routing
=========================================================================*/

sysTimeRouter.route('/time')
    .get( (req, res) => {
        // Construct current date
        date = new Date();
        // Construct current time
        sysTime = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();

        res.setHeader('content-type', 'text/plain');
        res.send(sysTime);
    });

sysFileRouter.route('/file.txt')
    .get( (req, res) => {
        // Time to execute the reading
        var timeResult;
        // Construct first time stamp
        systemTimeStampOne = process.hrtime()[1];
    
        if (typeof fileBuffer === 'undefined') {
            fileSystem.readFile('file.txt', (err, data) => {
                if (err) {
                    return console.log(err);
                }
                
                fileBuffer = data;
                systemTimeStampTwo = process.hrtime()[1];;
                timeResult = systemTimeStampTwo - systemTimeStampOne;
            
                console.log("Nanoseconds:" + timeResult);
            
                res.setHeader('content-type', 'text/plain');
                res.send(fileBuffer + "\nNanoseconds: " + timeResult);
            });
        } else {
            systemTimeStampTwo = process.hrtime()[1];;
            timeResult = systemTimeStampTwo - systemTimeStampOne;
            
            console.log("Nanoseconds:" + timeResult);
            
            res.setHeader('content-type', 'text/plain');
            res.send(fileBuffer + "\nNanoseconds: " + timeResult);
        }
    });


// add route to static files
app.use('/public', express.static(path.join(__dirname, '../static')));
app.use(sysTimeRouter);
app.use(sysFileRouter);

// root anchor + wildcard at (GET,POST,PUT,DELETE)
app.get('/*', (req, res) => {
    res.send('Hello World!');
});

// start listening on port 3000
app.listen(3000, () => {
    console.log('app listening on port 3000!');
});
