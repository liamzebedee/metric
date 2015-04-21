// Category = { path: ["Top Level Cat", "Second Level Cat"] }
Categories = new Mongo.Collection("categories");
Categories.addCategory = function(fullCategoryPath) {
	category = {
		path: '' // unqiue key
	};
};
Categories.findOrCreateByCategoryPath = function(categoryPath) {
	// categoryPath - "/Category1/Category2"
	categoryPath = categoryPath.split('/').filter(function(e){if(e !== "") return true});

	var category = Categories.findOne({
		path: categoryPath
	});
	var categoryId;
	// stupid Meteor docs, it actually returns undefined, not null
	if(category == null) {
		categoryId = Categories.insert({
			path: categoryPath
		});
	} else {
		categoryId = categoryId._id;
	}

	return categoryId;
};

Metrics = new Mongo.Collection("metrics");
Metrics.runComputeFunction = function(computeFunctionCodeString) {
	var func = Function('metric', computeFunctionCodeString);
	metric = {
		Metrics: {},
		Records: {},
		computeResult: {}
	};
	func(metric);
	return metric.computeResult;
};

// Use esprima.js to parse what the user gave us, taking simply the computeFunction JS
// 
Metrics.addMetric = function(name, fullCategoryPathString, computeFunctionCodeString) {
	// locate/create category in JSON tree
	var metricData = {
		name: name,
		computeResult: null,
		compute: computeFunctionCodeString,
		categoryId: Categories.findOrCreateByCategoryPath(fullCategoryPathString)
	};

	var metric_id;
	Metrics.insert(metricData, function(err, _id){
		mertric_id = _id;
	});

	// TODO how to get the method defined by the code
	

	// Add watch

	return _id;
};


/*
When to compute a metric:
 - 
*/

Records = new Mongo.Collection("records");

Records.addRecord = function(category, timestamp, data) {
	var record = {
		timestamp: 12321,
		category: Categories.findOrCreateByCategoryPath(fullCategoryPathString),
		data: data
	};
};









// http://estools.github.io/esquery/
// http://esprima.org/doc/index.html
// http://pegjs.org/

Meteor.startup(function () {
});