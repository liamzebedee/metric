(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;

/* Package-scope variables */
var ComputeFunctionAnalyser, ComputeFunctionHelpers;

(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/metric-stuff/computeFunctionAnalyser.js                                                        //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
var esprima = Npm.require('esprima');                                                                      // 1
var escodegen = Npm.require('escodegen');                                                                  // 2
var walk = Npm.require('esprima-walk');                                                                    // 3
                                                                                                           // 4
ComputeFunctionAnalyser = {};                                                                              // 5
ComputeFunctionAnalyser.getDependencies = function(computeFunctionCodeString) {                            // 6
	try {                                                                                                     // 7
		var ast = esprima.parse(computeFunctionCodeString, { raw: true });                                       // 8
	} catch(ex) {                                                                                             // 9
		throw new Meteor.Error("parsing-error", "Your code has syntax errors: " + ex.toString(), ex.toString()); // 10
	}                                                                                                         // 11
                                                                                                           // 12
	var dependencies = {                                                                                      // 13
		metrics: [],                                                                                             // 14
		records: []                                                                                              // 15
	};                                                                                                        // 16
                                                                                                           // 17
	walk(ast, function(node) {                                                                                // 18
		if(node.type == 'CallExpression' && node.callee.type == "Identifier") {                                  // 19
			var name = node.callee.name;                                                                            // 20
			// 0th argument is always the path                                                                      // 21
                                                                                                           // 22
			if(name == 'Metrics') {                                                                                 // 23
				// Metrics(path)                                                                                       // 24
				var dependencyString = eval(escodegen.generate(node.arguments[0]));                                    // 25
				dependencies.metrics.push(dependencyString);                                                           // 26
                                                                                                           // 27
			} else if(name == 'Records') {                                                                          // 28
				// Records(category)                                                                                   // 29
				var dependencyString = eval(escodegen.generate(node.arguments[0]));                                    // 30
				dependencies.records.push(dependencyString);                                                           // 31
			}                                                                                                       // 32
		}                                                                                                        // 33
	});                                                                                                       // 34
                                                                                                           // 35
	return dependencies;                                                                                      // 36
}                                                                                                          // 37
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/metric-stuff/computeFunctionHelpers.js                                                         //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
ComputeFunctionHelpers = {};                                                                               // 1
ComputeFunctionHelpers.gauss = Npm.require('gauss');                                                       // 2
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['metric-stuff'] = {
  ComputeFunctionAnalyser: ComputeFunctionAnalyser,
  ComputeFunctionHelpers: ComputeFunctionHelpers
};

})();

//# sourceMappingURL=metric-stuff.js.map
