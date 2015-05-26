// Client needs this so that we can detect when the DDP (Meteor minimongo) connection has been established
// autopackage is still included
Meteor.publish("metrics", function () { return Metrics.find(); });
Meteor.publish("categories", function() { return Categories.find(); });
Meteor.publish("records", function () { return Records.find(); });

function updateMetric(metricData) {
	// name, categoryId, data
	var modifier = metricData.fullReplace ? metricData.data : { $set: metricData.data };
	Metrics.update({
		name: metricData.name,
		categoryId: metricData.categoryId
	}, modifier, { upsert: true }, function(err, _id){
		metric_id = _id;
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
			metricDependencies: dependencies.metrics,
			recordDependencies: dependencies.records,
			recomputing: false
		};

		return recomputeMetric(metricData);
	},

	recomputeMetric: function(id) {
		var metric = Metrics.findOne(id);
		recomputeMetric(metric);
	},

	testNewMetricCode: function(newCodeString) {
		var dependencies = this.getDependencies(newCodeString);
		var computeResult = Metrics.runComputeFunction(newCodeString);
		return {
			computeResult: computeResult,
			metricDependencies: dependencies.metrics,
			recordDependencies: dependencies.records
		};
	},

	getDependencies: function(codeString) {
		return ComputeFunctionAnalyser.getDependencies(codeString);
	}

});

// Expects a metric object from the DB
function recomputeMetric(metric) {
	// Show feedback on client-side that we are recomputing
	if(metricExists(metric.name, metric.categoryId)) {
		updateMetric({
			name: metric.name,
			categoryId: metric.categoryId,
			fullReplace: false,
			data: { recomputing: true }
		});	
	}

	metric.computeResult = Metrics.runComputeFunction(metric.compute);

	console.log('recompute '+metric._id+' with val: '+metric.computeResult);
	
	return updateMetric({
		name: metric.name,
		categoryId: metric.categoryId,
		fullReplace: true,
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
	if(modifier.$set.computeResult || modifier.$set.compute) {
		announceChangesToDependentMetrics = true;
	}

	if(announceChangesToDependentMetrics) {
		// http://docs.mongodb.org/manual/reference/operator/query/in/
		// http://stackoverflow.com/questions/8219409/mongodb-in-operator-vs-lot-of-single-queries
		// http://stackoverflow.com/questions/12629692/querying-an-array-of-arrays-in-mongodb
		
		// Metrics.find({ metricDependencies: { $in: [] } })
		// find metrics who depend on this metric
		// recompute each of them
		// metrics.forEach(recomputeMetric);
	}
});
// Records.after.insert
// Records.after.remove
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
Vector = ComputeFunctionHelpers.gauss.Vector;
Collection = ComputeFunctionHelpers.gauss.Collection;

metricApi.Metrics = function() {
	return {
		find: function(path) {
			return Metrics.findMetricByPath(path);
		}
	};
};

metricApi.Records = function() {
	return {
		query: {
			categoryId: null
			// timestamp
		},

		since: function(sinceStr, field) {
			var date = Date.create(sinceStr).getTime();
			if(field && field.length > 0) this.query["fields." + field] = { $gte : date };
			else this.query.timestamp = { $gte : date };
			return this;
		},

		find: function(path) {
			var category = Categories.findCategoryByPath(path);
			this.query.categoryId = category._id;
			console.log(JSON.stringify(this.query));
			return MetricRecords(Records.find(this.query).fetch());
		}
	};
};

function MetricRecords(values) {
	var metricRecords = new Vector(values);

	metricRecords.select = function(fieldName) {
		// var type = Util.getObjectType(fields);
		// if(type == 'Array') {
		// 	for (var i = 0, field; field = fields[i]; i++) {

		// 	}
		// }
		return metricRecords.map(function(record){ return record.fields[fieldName]; });
	};
	metricRecords.average = metricRecords.mean;
	return metricRecords;
}

metricApi.metric = function(){
	this.result = null;
};


Metrics.runComputeFunction = function(computeFunctionCodeString) {
	var metric = null;
	try {
		var func = Function(
			'Metrics', 
			'Records',
			'metric',
			computeFunctionCodeString);
		metric = new func(
			metricApi.Metrics(),
			metricApi.Records(),
			metric);
	} catch(ex) {
		throw new Meteor.Error("runtime-error", "Your code failed to run when we tested it: " + ex.toString(), ex.stack);
	}
	return metric.result;
}