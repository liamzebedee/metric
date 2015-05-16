Meteor.startup(function(){

RecordsOverview = ReactMeteor.createClass({
	MAX_RECORD_COUNT: 100,
	
	contextTypes: {
		router: React.PropTypes.func.isRequired
	},

	getInitialState: function() {
		return {
			
		};
	},

	componentDidMount: function() {
		var self = this;

		Meteor.subscribe('records', this.recordDataReady);
	},

	componentWillReceiveProps: function() {
		this.metricDataReady();
	},

	metricDataReady: function(){
		var self = this;
		var category = Categories.findOne(self.getCategoryId());
		if(category == null) return; // TODO error
		var recordsCursor = Records.find({ categoryId: category._id }, { limit: self.MAX_RECORD_COUNT });
		this.setState({ metric: Metrics.findOne(self.getCategoryId()) });
	},

	getCategoryId: function(){ return this.context.router.getCurrentParams().id; },

	render: function() {
		return (
			<div>
				<h1>Records Overview</h1>
				
			</div>
		);
	}
});



});