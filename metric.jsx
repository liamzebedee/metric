/*
 * @jsx React.DOM
 */

var MetricUI = ReactMeteor.createClass({
  templateName: "MetricUI",

	render: function() {
		return (
			<p>hey</p>
		);
	},

	getMeteorState: function() {}
});

Metrics = new Mongo.Collection("metrics");
Records = new Mongo.Collection("records");

Metrics.addNew = function(metricData) {
	// name - BGLs
	// category - /Health/Diabetes
	// compute(metrics, records)
	/*
	parse category
	jsobj = metrics
	foreach part of category.split('/')[1-end]
		jsobj = jsobj[part]
	jsonobj[name] = { metric_id: nextID(), metric_timestamp: currentTime(), compute: compute }
	*/
};

Records.addNew = function(newRecord) {
	// var record = {
	// 	metric_id: nextID(),
	// 	metric_timestamp: currentTime(),
	// 	...data
	// };
	// jsobj = metrics
	// foreach part of category.split('/')[1-end]
	// 	jsobj = jsobj[part]
	// jsonobj[name].push(record)
};



if (Meteor.isServer) {
	Meteor.startup(function () {
		// code to run on server at startup
		Metrics = new Mongo.Collection("metrics");
		Records = new Mongo.Collection("records");
	});
}
