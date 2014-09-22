"use strict";

var argv = require('minimist')(process.argv.slice(2)),
    request = require('request');

function displayUsage() {
    console.log("Usage: [-n missingparatertext] url searchparameter buildtypeid [buildtypeid2] [buildtypeid3]" +
        "\nurl\t\t in format http://username:password@teamcity.host:port\nbuildTypeId\t from teamcity\n[-n missingparamtertext] : What value to display when the parameter is not defined");
}

function writeCsv() {
    var separator = ",",
        elements = [];

    for (var i = 0; i < arguments.length; i++) {
        var value = arguments[i].replace("\"", "'");
        elements.push("\"" + value + "\"");
    }

    console.log(elements.join(separator));

}

if (typeof argv._ == 'undefined' || argv._.length < 3) {
    displayUsage();
    return;
}

var emptyParameterValue="<NOT FOUND>";

if(typeof argv.n != 'undefined'){
    emptyParameterValue = argv.n;
}

var uri = argv._[0] + "/httpAuth/app/rest/buildTypes/id:",
    buildTypeIds = argv._.slice(2),
    targetParameter = argv._[1];

buildTypeIds.forEach(function (id) {

    var requestOptions = {
        uri: uri + id,
        json: true
    };

    request(requestOptions, function (error, response, body) {

        if (error != null) {
            throw "Oops! Something isn't right" + error;
        }

        if (typeof body != 'object') {
            throw "Oops! We didn't get a json result back from\n" + requestOptions.uri;
        }

        var parameters = body.parameters;
        var parameterValue = emptyParameterValue,
            found = false;

        parameters.property.forEach(function (parameter) {
            if (parameter.name == targetParameter) {
                parameterValue = parameter.value;
                found = true;
            }
        });

        writeCsv(targetParameter, id, parameterValue);

    });
})
;

