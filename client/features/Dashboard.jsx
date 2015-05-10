Meteor.startup(function(){


Dashboard = ReactMeteor.createClass({
  contextTypes: {
    router: React.PropTypes.func.isRequired
  },

	render: function() {
		return (
			<div className="ui statistics">
				<h1>Dashboard</h1>
				<UI.Metric />
			</div>
			);
	}
});


});