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
		if(node.type == 'CallExpression' && node.callee.type == "MemberExpression") {
			var name = node.callee.object.name;
			var prop = node.callee.property.name;

			if(name == 'Metrics') {
				// Metrics.find(category, name)
				var dependencyString = eval(escodegen.generate(node.arguments[0]));
				dependencies.metrics.push(dependencyString);

			} else if(name == 'Records' && prop == 'find') {
				// Records.find(category)
				var dependencyString = eval(escodegen.generate(node.arguments[0]));
				dependencies.records.push(dependencyString);
			}
		}
	});

	return dependencies;
}