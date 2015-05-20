Meteor.startup(function(){

MetricOverview = ReactMeteor.createClass({
	contextTypes: {
		router: React.PropTypes.func.isRequired
	},

	getInitialState: function() {
		return {
			metric: {
				name: "",
				computeResult: null
			}
		};
	},

	startMeteorSubscriptions: function() {
		Meteor.subscribe("metrics");
	},

	getMeteorState: function() {
		var self = this;
		return { metric: Metrics.findOne(self.getMetricId()) };
	},

	getMetricId: function(){ return this.context.router.getCurrentParams().id; },

	recomputeMetric: function(){
		Meteor.call('recomputeMetric', this.getMetricId());
	},

	render: function() {
		if(this.state.metric) {
			var loadedMetric = <div>
				<div>{this.state.metric.name} = {this.state.metric.computeResult}</div>
				<button onClick={this.recomputeMetric}>Recompute</button>
			</div>;
		}
		return (
			<div>
				<h1>Metric Overview</h1>
				edit metric source
				edit metric name
				{loadedMetric}
			</div>
		);
	}
});



});