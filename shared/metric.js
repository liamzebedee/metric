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

// Metric = { name: "Foo", compute: "doSomething();var i = 2;andAnother(i);", computeResult: 1, categoryId: "..." }
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

	return metric_id;
};


/*
When to (re)compute a metric:
 - when metric compute definition changes
 - when a metric/recordcategory changes that this metric depends on 
*/

// Record = { timestamp: 12312321, category: "...", fields: {} }
Records = new Mongo.Collection("records");

Records.addRecord = function(category, timestamp, data) {
	var record = {
		timestamp: 12321,
		category: Categories.findOrCreateByCategoryPath(fullCategoryPathString),
		data: data
	};
};

/*
	RecordSchema = {
		categoryId: "...",
		fields: {
			"field name/label": { value: "default value" },
			"another field": { value: 12, inc: 1, max: 20, min: 10 },
			"a date field": { value: new Date(), optional: true }
		}
	}
*/
RecordSchemas = new Mongo.Collection("record-schemas");


/*

In the end I want to write the HealthMetric like this:

return average(Metrics.get('/Health/DiabetesMetric'), Metrics.get('/Health/Body/ExerciseMetric'));

And DiabetesMetric

return average(Records.get('/Health/Body/Exercise/').since('two weeks ago'))
*/





// http://estools.github.io/esquery/
// http://esprima.org/doc/index.html
// http://pegjs.org/

Meteor.startup(function () {
});