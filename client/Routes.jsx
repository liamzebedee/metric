// Various views
// - dashboard hierachy
// - record table
// - metric overview

Dashboard = ReactMeteor.createClass({
	render: function() {
		return (
			<div className="ui statistics">
				<UI.Metric />
			</div>
			);
	}
});

