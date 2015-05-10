DefaultRoute = ReactRouter.DefaultRoute;
Route = ReactRouter.Route;

routes = (
  <Route name="app" handler={App} path="/">
  	<Route name="add-metric" path="/metrics/add" handler={AddMetric} />
  	<Route name="add-record" path="/records/add" handler={AddRecord} />

  	<Route name="metric-overview" path="/metrics/:id" handler={MetricOverview} />
  	<Route name="records-overview" path="/records-overview/*/" handler={RecordsOverview} />

  	<Route name="dashboard" path="/" handler={Dashboard} />
    <DefaultRoute handler={Dashboard} />
  </Route>
);

Meteor.startup(function() {
	ReactRouter.run(routes, function (Handler) {
	  React.render(<Handler />, document.getElementById('root'));
	});
});