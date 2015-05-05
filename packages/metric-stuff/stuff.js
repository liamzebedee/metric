var esprima = Npm.require('esprima');
var escodegen = Npm.require('escodegen');
var walk = Npm.require( 'esprima-walk' )

ComputeFunctionAnalyser = {};
ComputeFunctionAnalyser.getDependencies = function(computeFunctionCodeString) {
	var ast = esprima.parse(computeFunctionCodeString, { raw: true });

	var dependencies = {
		metrics: [],
		records: []
	};

	walk(ast, function(node) {
		if(node.type == 'CallExpression') {
			if(node.callee.name == 'Metrics') {
				var dependencyString = eval(escodegen.generate(node.arguments[0]));
				dependencies.metrics.push(dependencyString);

			} else if(node.callee.name == 'Records') {
				var dependencyString = eval(escodegen.generate(node.arguments[0]));
				dependencies.records.push(dependencyString);
			}
		}
	});

	return dependencies;
}

Meteor.startup(function () {
	// Add watches for Metric and 

});