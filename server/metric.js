// Client needs this so that we can detect when the DDP (Meteor minimongo) connection has been established
// autopackage is still included
Meteor.publish("metrics", function () { return Metrics.find(); });
Meteor.publish("categories", function() { return Categories.find(); });
Meteor.publish("records", function () { return Records.find(); });

function updateMetric(metricData) {
	// name, categoryId, data
	Metrics.update({
		name: metricData.name,
		categoryId: metricData.categoryId
	}, {
		$set: metricData.data
	}, { upsert: true }, function(err, _id){
		mertric_id = _id;
	});
}

function metricExists(name, categoryId) {
	return (Metrics.findOne({
		name: name,
		categoryId: categoryId
	}) == null);
}

Meteor.methods({
	upsertMetric: function(name, fullCategoryPathString, computeFunctionCodeString) {
		// TODO check if computeFunction hasn't changed, and skip all this expensive stuff

		var dependenciesText = ComputeFunctionAnalyser.getDependencies(computeFunctionCodeString);
		var dependencies = {
			metrics: [],
			records: []
		};
		dependenciesText.metrics.forEach(function(metric){
			dependencies.metrics.push(Metrics.findMetricByPath(metric)._id);
		});
		dependenciesText.records.forEach(function(categoryPath){
			dependencies.records.push(Categories.findCategoryByPath(categoryPath)._id);
		});

		var metricData = {
			name: name,
			computeResult: null,
			compute: computeFunctionCodeString,
			categoryId: Categories.findOrCreateByCategoryPath(fullCategoryPathString),
			dependencies: dependencies,
			recomputing: false
		};

		recomputeMetric(metricData);

		return metric_id;
	},

	recomputeMetric: function(id) {
		var metric = Metrics.findOne(id);
		recomputeMetric(metric);
	},

});

// Expects a metric object from the DB
function recomputeMetric(metric) {
	// Show feedback on client-side that we are recomputing
	if(metricExists(metric.name, metric.categoryId)) {
		updateMetric({
			name: metric.name,
			categoryId: metric.categoryId,
			data: { recomputing: true }
		});	
	}

	metric.computeResult = Metrics.runComputeFunction(metric.compute);
	console.log('recompute '+id+' with val: '+metric.computeResult);
	
	updateMetric({
		name: metricData.name,
		categoryId: metricData.categoryId,
		data: metric
	});
}



/*
When to (re)compute a metric:
 - when metric compute definition changes
 - when a metric.computeResult changes that this metric depends on 
 - when a record is added to a category that this metric depends on
*/
Metrics.after.update(function(userId, doc, fieldNames, modifier, options){
	// sub in new compute value
	var announceChangesToDependentMetrics = false;
	if(modifier.$set.computeResult || modifier.$set.computeFunction) {
		announceChangesToDependentMetrics = true;
	}


	if(announceChangesToDependentMetrics) {
		
		// find metrics who depend on this metric
		// recompute each of them
		// metrics.forEach(recomputeMetric);
	}
});
Records.after.update(function(userId, doc, fieldNames, modifier, options){
	var announceChangesToDependentMetrics = false;
	// find metrics who depend on this record category
	// recompute each one of them
	// metrics.forEach(recomputeMetric);

	if(announceChangesToDependentMetrics) {

	}

});




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

metricApi.Vector = ComputeFunctionHelpers.gauss.Vector;
metricApi.Collection = ComputeFunctionHelpers.gauss.Collection;

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