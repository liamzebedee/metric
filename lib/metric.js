 
// Category = {
// 	path: ["Top Level Cat", "Second Level Cat"],
// 	schema: [
// 		{ fieldName: "field name/label", value: "default value" },
// 		{ fieldName: "field name/label", value: "default value" },
// 		{ fieldName: "field name/label", value: "default value" },
// 	]
// }
Categories = new Mongo.Collection("categories");
Categories.addCategory = function(fullCategoryPath) {
	category = {
		path: '' // unqiue key
	};
};
Categories.parsePathIntoArray = function(path) {
	return path.split('/').filter(function(e){if(e !== "") return true});
};
Categories.setSchema = function(categoryPath, schema) {
	Categories.update({
		_id: Categories.findOrCreateByCategoryPath(categoryPath)
	}, {
		$set: {
			schema: schema
		}
	});
};
Categories.findCategoryByPath = function(categoryPath) {
	var category = Categories.findOne({
		path: Categories.parsePathIntoArray(categoryPath)
	});
	return category;
};
Categories.findOrCreateByCategoryPath = function(categoryPath, schema) {
	categoryPath = categoryPath.split('/').filter(function(e){if(e !== "") return true});
	schema = schema || [];

	var category = Categories.findOne({
		path: categoryPath
	});
	var categoryId;
	// stupid Meteor docs, it actually returns undefined, not null
	if(category == null) {
		categoryId = Categories.insert({
			path: categoryPath,
			schema: schema
		});
	} else {
		categoryId = category._id;
	}

	return categoryId;
};

// Metric = { name: "Foo", compute: "doSomething();var i = 2;andAnother(i);", computeResult: 1, categoryId: "..." }
Metrics = new Mongo.Collection("metrics");

Metrics.findMetricByPath = function(categoryAndMetricPath) {
	var path = categoryAndMetricPath.split('/').filter(function(e){if(e !== "") return true});
	var metricName = path.pop(); // kill two birds with one stone

	var metric = Metrics.findOne({
		categoryId: Categories.findOne({ path: categoryPath }),
		name: metricName
	});
	return metric;
};

// Record = { timestamp: 12312321, category: "...", fields: {} }
Records = new Mongo.Collection("records");

Records.addRecord = function(categoryPath, timestamp, fields) {
	var record = {
		timestamp: +new Date(),
		categoryId: Categories.findOrCreateByCategoryPath(categoryPath),
		fields: fields
	};

	Records.insert(record);
};



// This is what the compute function gets as parameters
var metricApi = {};

metricApi.Metrics = {
	get: function(path) {
		return Metrics.findMetricByPath(path);
	}
};

metricApi.Records = {
	query: {
		categoryId: null
		// timestamp
	},

	find: function(path) {
		this.categoryId = Categories.findCategoryByPath(path);
		return this;
	},

	since: function(sinceStr) {
		var date = Date.create(since);
		this.query.timestamp = { $gte : date };
		return this;
	},

	get: function() {
		return Records.find(this.query).fetch();
	}
};


Metrics.runComputeFunction = function(computeFunctionCodeString) {
	var func = Function(
		'Metrics', 
		'Records', 
		computeFunctionCodeString);
	var result = func(
		metricApi.Metrics,
		metricApi.Records);
	return result;
}


/*
In the end I want to write the HealthMetric like this:

return average(Metrics('/Health/DiabetesMetric').computeValue, Metrics.get('/Health/Body/ExerciseMetric'));

And DiabetesMetric

return average(Records('/Health/Body/Exercise/').since('two weeks ago').get())
*/