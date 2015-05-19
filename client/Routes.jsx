Meteor.startup(function(){

RouteHandler = ReactRouter.RouteHandler;
TransitionGroup = React.addons.CSSTransitionGroup;

App = ReactMeteor.createClass({
	contextTypes: {
	    router: React.PropTypes.func.isRequired
	},

	startMeteorSubscriptions: function(){
		Meteor.subscribe('categories');
	},

	render: function() {
		var name = this.context.router.getCurrentPath();
		return (
			<div>
				<div className="container">
					<UI.Menu/>
					
					<div className="ui page ">
					<main className="column">
				          <RouteHandler key={name}/>
					</main>
					</div>
				</div>
			</div>
		);
	}
});

DefaultRoute = ReactRouter.DefaultRoute;
Route = ReactRouter.Route;

routes = (
  <Route name="app" handler={App} path="/">
  	<Route name="add-metric" path="/metrics/add" handler={AddMetric} />
  	<Route name="add-record" path="/records/add" handler={AddRecord} />

  	<Route name="metric-overview" path="/metrics/:id" handler={MetricOverview} />
  	<Route name="records-overview" path="/records-overview/:id" handler={RecordsOverview} />

  	<Route name="dashboard" path="/" handler={Dashboard} />
    <DefaultRoute handler={Dashboard} />
  </Route>
);

ReactRouter.run(routes, function (Handler) {
  React.render(<Handler />, document.getElementById('root'));
});



});