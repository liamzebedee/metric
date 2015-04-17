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
	var category_id;
	// stupid Meteor docs, it actually returns undefined, not null
	if(category == null) {
		category_id = Categories.insert({
			path: categoryPath
		});
	} else {
		category_id = category_id._id;
	}

	return category_id;
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