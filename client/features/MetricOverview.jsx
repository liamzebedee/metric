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

	componentDidMount: function() {
		var self = this;

		// Meteor.subscribe('records');
		// Meteor.subscribe('categories');
		Meteor.subscribe('metrics', this.metricDataReady);
	},

	componentWillReceiveProps: function() {
		this.metricDataReady();
	},

	metricDataReady: function(){
		this.setState({ metric: Metrics.findOne(self.getMetricId()) });
	},

	getMetricId: function(){ return this.context.router.getCurrentParams().id; },

	recomputeMetric: function(){
		Meteor.call('recomputeMetric', this.getMetricId());
	},

	render: function() {
		return (
			<div>
				<h1>Metric Overview</h1>
				<div>{this.state.metric.name} = {this.state.metric.computeResult}</div>
				<button onClick={this.recomputeMetric}>Recompute</button>
			</div>
		);
	}
});



});