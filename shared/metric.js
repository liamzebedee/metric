// Categories is basically how Wikipedia does Categories, except Metrics and Records can only belong to one
// TODO implement this
Categories = new Mongo.Collection("categories");
Categories.addCategory = function(fullCategoryPath) {
	category = {
		path: '' // unqiue key
	};
};
Categories.findOrCreateByCategoryPath = function(categoryPath) {
	// TODO
};


Metrics = new Mongo.Collection("metrics");
Metrics.addMetric = function(name, fullCategoryPathString, computeFunctionCodeString) {
	// locate/create category in JSON tree
	var metricData = {
		name: name,
		computeResult: null,
		compute: computeFunctionCodeString,
		categoryId: Categories.findOrCreateByCategoryPath(fullCategoryPathString)
	};

	// Metrics.insert(metricData, function(err, _id){

	// });

	// Add watch
};



Records = new Mongo.Collection("records");

Records.addRecord = function(category, timestamp, data) {
	var record = {
		timestamp: 12321
		category: Categories.findOrCreateByCategoryPath(fullCategoryPathString),
		data: data
	};
};









// http://estools.github.io/esquery/
// http://esprima.org/doc/index.html
// http://pegjs.org/

Meteor.startup(function () {
});