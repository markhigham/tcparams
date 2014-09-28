"use strict";
var request = require('request');

/*
    options 
    {
        teamCityHost: <string> 'http://host:port',
        parameterNames: [<string>] 'env.ParameterName',
        buildTypeIds: <array> ['bt12','bt22', 'etc']
    }

    */
exports.queryTeamCityParameters = function (options, callback) {

    if (typeof callback != 'function')
        throw "queryTeamCityParamters expects a callback parameter"

    if (!options.emptyParameterValue)
        options.emptyParameterValue = "<MISSING>";

    options.buildTypeIds.forEach(function (id) {

        var uri = options.teamCityHost + "/httpAuth/app/rest/buildTypes/id:";


        var requestOptions = {
            uri: uri + id,
            json: true,
            auth: {
                user: options.user,
                pass: options.password,
                sendImmediately: false
            }
        };

        request(requestOptions, function (error, response, body) {

            if (error != null) {
                callback(error, null);
                return;
            }

            if (typeof body != 'object') {
                console.log(body);
                callback("Oops! We didn't get a json result back from\n" + requestOptions.uri, null);
                return;
            }

            var parameters = body.parameters;

            options.parameterNames.forEach(function (parameterName) {
                var parameterValue = options.emptyParameterValue,
                found = false;

                parameters.property.forEach(function (parameter) {
                    if (parameter.name == parameterName) {
                        parameterValue = parameter.value;
                        found = true;
                    }
                });

                callback(null, {
                    parameterName: parameterName,
                    buildTypeId: id,
                    parameterValue: parameterValue
                });

            });



        });
    });

}
