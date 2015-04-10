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



if (Meteor.isClient) {
	Metrics = new Mongo.Collection("metrics");
	Records = new Mongo.Collection("records");
}




if (Meteor.isServer) {
	Meteor.startup(function () {
		// code to run on server at startup
		Metrics = new Mongo.Collection("metrics");
		Records = new Mongo.Collection("records");
	});
}
