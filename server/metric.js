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
		if(err) throw new Error(err.toString());
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
		var metricData;

		try {
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

			metricData = {
				name: name,
				computeResult: null,
				compute: computeFunctionCodeString,
				categoryId: Categories.findOrCreateByCategoryPath(fullCategoryPathString),
				metricDependencies: dependencies.metrics,
				recordDependencies: dependencies.records,
				recomputing: false
			};

		} catch(ex) {
			throw new Meteor.Error("parsing-error", "Your code is wrong", ex.toString());
		}

		recomputeMetric(metricData);
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
	try {
		// Show feedback on client-side that we are recomputing
		if(metricExists(metric.name, metric.categoryId)) {
			updateMetric({
				name: metric.name,
				categoryId: metric.categoryId,
				fullReplace: false,
				data: { recomputing: true }
			});	
		}

		metric.computeResult = Metrics.runComputeFunction(metric.compute).result;
		metric.recomputing = false;

		console.log('recompute '+metric._id+' with val: '+metric.computeResult);
		
		return updateMetric({
			name: metric.name,
			categoryId: metric.categoryId,
			fullReplace: true,
			data: metric
		});
	} catch(ex) {
		throw new Meteor.Error("runtime-error", "Your metric failed to run", ex.stack);
	}
}



/*
When to (re)compute a metric:
 - when metric compute definition changes
 - when a metric.computeResult changes that this metric depends on 
 - when a record is added to a category that this metric depends on
*/

Metrics.after.insert(onMetricsInsertOrUpdate);
Metrics.after.update(onMetricsInsertOrUpdate);
function onMetricsInsertOrUpdate(userId, doc, fieldNames, modifier, options){
	// sub in new compute value
	var announceChangesToDependentMetrics = false;
	if(modifier.computeResult || modifier.compute) {
		announceChangesToDependentMetrics = true;
	}

	if(announceChangesToDependentMetrics) {
		var dependentMetrics = Metrics.find({
			metricDependencies: { $in: [doc._id] }
		});
		dependentMetrics.forEach(function(metric){
			if(metric._id == doc._id) {
				// Basic check. No, this is not the solution to the halting problem.
				// Then again... https://xkcd.com/1266/
				console.log("Metric "+JSON.stringify(metric)+" depends on itself and will compute in an infinite loop. Stopping to avoid harm.");
				return;
			}
			recomputeMetric(metric);
		});
	}
}

Records.after.insert(onRecordsChange)
Records.after.remove(onRecordsChange)
Records.after.update(onRecordsChange);
function onRecordsChange(userId, doc, fieldNames, modifier, options) {
	var dependentMetrics = Metrics.find({
		recordDependencies: { $in: [doc.categoryId || modifier.categoryId] }
	});
	dependentMetrics.forEach(recomputeMetric);
}





// This is what the compute function gets as parameters
var metricApi = {};
Vector = ComputeFunctionHelpers.gauss.Vector;
Collection = ComputeFunctionHelpers.gauss.Collection;

/*
 * Why separate types of Record/RecordImpl and Metrics/MetricsImpl?
 * Simply because, people, and by people I mean me, will forget to insert the "new" keyword
 * And because JavaScript just keeps chugging along at all costs, the error won't announce itself like a dinner guest, rather quietly lurk in the background and strike at sometime when the path is not set in a Metric.
 */
metricApi.Records = function(path) {
	return new metricApi.RecordsImpl(path);
}
metricApi.Metrics = function(path) {
	return new metricApi.MetricsImpl(path);
}

metricApi.MetricsImpl = function(path) {
	this.query = {};
	this.query.path = path;
}
metricApi.MetricsImpl.prototype.find = function() {
	var metric = MetricPrettyWrapper(Metrics.findMetricByPath(this.query.path));
	return metric;
}

function MetricPrettyWrapper(metric) {
	if(metric.computeResult === undefined) var self = {};
	else var self = metric.computeResult;
	self.result = metric.computeValue;
	self.metric = metric;
	return self;
}


metricApi.RecordsImpl = function(path) {
	this.path = path;
	this.query = {
		categoryId: null,
		// timestamp
	};
}
metricApi.RecordsImpl.prototype.since = function(sinceStr, field) {
	var date = Date.create(sinceStr).getTime();
	if(field && field.length > 0) this.query["fields." + field] = { $gte : date };
	else this.query.timestamp = { $gte : date };
	return this;
}
metricApi.RecordsImpl.prototype.find = function() {
	var category = Categories.findCategoryByPath(this.path);
	
	this.query.categoryId = category._id;
	console.log(JSON.stringify(this.query));
	return MetricRecords(Records.find(this.query).fetch());
}


function MetricRecords(values) {
	var metricRecords = new Vector(values);

	metricRecords.select = function(fieldName) {
		// var type = Util.getObjectType(fields);
		// if(type == 'Array') {
		// 	for (var i = 0, field; field = fields[i]; i++) {

		// 	}
		// }
		return metricRecords.map(function(record){
			var f = record.fields[fieldName];
			if(f === undefined) throw new Error("Field doesn't exist: '"+fieldName+"'");
			return f;
		});
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
			metricApi.Metrics,
			metricApi.Records,
			metric);
	} catch(ex) {
		throw new Meteor.Error("runtime-error", "Your code failed to run when we tested it: " + ex.toString(), ex.stack);
	}
	return metric;
}