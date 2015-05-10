Meteor.methods({
	upsertMetric: function(name, fullCategoryPathString, computeFunctionCodeString) {
		// todo check if computeFunction hasn't changed, and skip all this expensive stuff

		// locate/create category in JSON tree
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
			dependencies: dependencies
		};

		var metric_id;
		
		metricData.computeResult = Metrics.runComputeFunction(metricData.compute);

		Metrics.update({
			name: metricData.name,
			categoryId: metricData.categoryId
		}, {
			$set: metricData
		}, { upsert: true }, function(err, _id){
			mertric_id = _id;
		});

		return metric_id;
	}
});


/*
When to (re)compute a metric:
 - when metric compute definition changes
 - when a metric.computeResult changes that this metric depends on 
 - when a record is added to a category that this metric depends on
*/
Metrics.after.update(function(userId, doc, fieldNames, modifier, options){
	// sub in new compute value
});
Categories.after.update(function(userId, doc, fieldNames, modifier, options){
	
});
