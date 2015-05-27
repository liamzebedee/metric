Meteor.startup(function(){

MetricOverview = ReactMeteor.createClass({
	contextTypes: {
		router: React.PropTypes.func.isRequired
	},

	getInitialState: function() {
		return {
			metric: null,
			deps: null
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

	remove: function(){
		Metrics.remove(this.state.metric._id);
	},

	render: function() {
		if(this.state.metric) {
			var categoryPath = Categories.findOne(this.state.metric.categoryId).path;
			var loadedMetricView = <AddMetric name={this.state.metric.name} categoryText={categoryPath.join('/')} computeFunctionString={this.state.metric.compute} newMetric={false}/>;
			var deps = JSON.stringify({ metrics: this.state.metric.metricDependencies, records: this.state.metric.recordDependencies });
		}
		return (
			<div className="niceish-padding"><div className="ui segment">
				<h1>Metric Overview</h1>

				<button onClick={this.recomputeMetric}>Recompute</button>
				<button onClick={this.remove}>Remove</button>

				{this.state.metric ? 
					<div>
					<div className="ui card"><div className="content"><div className="ui statistics">
					<UI.Metric name={this.state.metric.name} categoryPath={categoryPath} computeResult={this.state.metric.computeResult} _id={this.state.metric._id} />
					</div></div></div>

					<pre>{deps}</pre>
					</div>
				: "" }
			</div>

			{loadedMetricView}</div>
			
		);
	}
});



});