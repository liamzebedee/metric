Meteor.startup(function(){

RecordsOverview = ReactMeteor.createClass({
	MAX_RECORD_COUNT: 100,
	
	contextTypes: {
		router: React.PropTypes.func.isRequired
	},

	getInitialState: function() {
		return {
			meteorLoaded: false,
			category: { schema: [], path: [] },
			records: []
		};
	},

	getMeteorState: function() {
		var self = this;
		var category = Categories.findOne(this.getCategoryId());
		if(category == null) return; // TODO error
		var records = Records.find({ categoryId: category._id }, { limit: self.MAX_RECORD_COUNT }).fetch();
		return { records: records, category: category, meteorLoaded: true };
	},

	startMeteorSubscriptions: function() {
		Meteor.subscribe("categories");
		Meteor.subscribe("records");
	},

	getCategoryId: function(){ return this.context.router.getCurrentParams().id; },

	render: function() {
		header = [];
		this.state.category.schema.forEach(function(field, i){
			header.push(<th key={i}>{field.fieldName}</th>);
		});
		bodyRows = [];
		this.state.records.forEach(function(record, i){
			var fields = [];
			for(var field in record.fields) {
				var val = record.fields[field];
				fields.push(<td key={field}>{val}</td>);
			}
			bodyRows.push(<tr key={i}>{fields}</tr>);
		});

		return (
			<div className="niceish-padding ui segment">
				<h1>{this.state.meteorLoaded ? <CategoryBreadcrumb currentCategory={this.state.category}/> : ''}</h1>
				<table className="ui celled table">
					<thead><tr>
						{header}
					</tr></thead>
					<tbody>
						{bodyRows}
					</tbody>
				</table>
				
			</div>
		);
	}
});



});