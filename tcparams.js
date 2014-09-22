"use strict";

var argv = require('minimist')(process.argv.slice(2)),
    request = require('request');

function displayUsage() {
    console.log("Usage: [-u username] [-p password] url");
}

if (typeof argv._ == 'undefined' || argv._.length == 0) {
    displayUsage();
    return;
}

var uri = argv._[0];

var requestOptions = {
    uri: argv._[0],
    json: true
};

request(requestOptions, function (error, response, body) {


    console.log(body);

});