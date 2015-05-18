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

	getMeteorState: function() {
		var self = this;
		var category = Categories.findOne(this.getCategoryId());
		if(category == null) return; // TODO error
		var records = Records.find({ categoryId: category._id }, { limit: self.MAX_RECORD_COUNT }).fetch();
		return { records: records };
	},

	startMeteorSubscriptions: function() {
		Meteor.subscribe("metrics");
	},

	getCategoryId: function(){ return this.context.router.getCurrentParams().id; },

	render: function() {
		return (
			<div>
				<h1>Records Overview</h1>
				{this.state.records}
			</div>
		);
	}
});



});