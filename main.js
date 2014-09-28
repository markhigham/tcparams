
function displayUsage() {
	console.log("Usage: [-n missingparatertext] url searchparameter buildtypeid [buildtypeid2] [buildtypeid3]" +
		"\nurl\t\t in format http://username:password@teamcity.host:port\nbuildTypeId\t from teamcity\n[-n missingparamtertext] : What value to display when the parameter is not defined");
}

var argv = require('minimist')(process.argv.slice(2)),
tcparams = require("./tcparams");


if (typeof argv._ == 'undefined' || argv._.length < 3) {
	displayUsage();
	return;
}

var user = process.env.TCUSER,
password = process.env.TCPASSWORD;

if(typeof user == 'undefined')
	throw "Missing TCUSER environment variables";

if(typeof password == 'undefined')
	throw "Missing TCPASSWORD environment variable";

var emptyParameterValue="<NOT FOUND>";

if(typeof argv.n != 'undefined'){
	emptyParameterValue = argv.n;
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

var options = {
	teamCityHost: argv._[0] ,
	buildTypeIds : argv._.slice(2),
	parameterNames : [ argv._[1]],
	user: user,
	password: password	
};


tcparams.queryTeamCityParameters(options, function(error, result){

	if(error)
		throw error;

	writeCsv(result.parameterName, result.buildTypeId, result.parameterValue);

});
