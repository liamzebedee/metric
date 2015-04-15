// Categories is basically how Wikipedia does Categories, except Metrics and Records can only belong to one
// TODO implement this
Categories = new Mongo.Collection("categories");



/*

	Metrics = {
		Hierachy: {
			Category1: {
				Category2: {
					"@metrics": [{
						_id: 123213,
						_timestamp: 21321321312,
						name: "",
						computeResult: {
							timestamp: 1231232131,
							value: X
						},
						compute: function(){}
					}]
				}
			}
		}
	}

*/
Metrics = new Mongo.Collection("metrics");
Metrics.addMetric = function(name, category, computeFunctionCode) {
	// locate/create category in JSON tree
	var metricData = {
		name: "",
		computeResult: null,
		compute: computeFunctionCode,
	};
	Metrics.insert(metricData, function(err, _id){

	});
};

/*

	Records = {
		Hierachy: {
			Category1: {
				Category2: {
					@records: [{
						@id: 1231231,
						@timestamp: 12321321412,
						...data...
					}]
				}
			}
		}
	}

*/
Records = new Mongo.Collection("records");

Records.addRecord = function(category, timestamp) {
	var record = {
		$timestamp: 
	};
}




// use JS AST to analyse Metric.compute, and analyse dependencies between variables to create a better update algorithm
// metric.compute(Metrics.copy, Records.copy) foreach metric
// memoization for caching computations
// TODO implement a view syntax

// http://estools.github.io/esquery/
// http://esprima.org/doc/index.html
// http://pegjs.org/

Meteor.startup(function () {
});