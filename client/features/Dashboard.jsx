Meteor.startup(function(){


Dashboard = ReactMeteor.createClass({
	REACT_GRID_LAYOUT_MARGIN_LEFT: 10,

    mixins: [React.PureRenderMixin, ReactRouter.Navigation],

	contextTypes: {
  		router: React.PropTypes.func.isRequired
	},

	componentDidMount: function() {
        var ev = document.createEvent('Event');
        ev.initEvent('resize', true, true);
        window.dispatchEvent(ev);
    },

    startMeteorSubscriptions: function() {
		Meteor.subscribe("metrics");
		Meteor.subscribe("categories");
	},

	getMeteorState: function() {
		var meteorState = {
			categories: []
		};
		var categories = Categories.find().fetch();
		categories.forEach(function(category){
			cat = {
				path: category.path,
				_id: category._id,
				metrics: []
			};
			cat.metrics = Metrics.find({ categoryId: category._id }).fetch();
			if(cat.metrics.length == 0) { return; }
			meteorState.categories.push(cat);
		});
		meteorState.categories.push({
					path: ["Life", "Social"],
					_id: 42,
					metrics: [
						{ name: "Communications", computeValue: 0.509, _id: "ex" },
						{ name: "Family", computeValue: true, _id: "ex" },
						{ name: "Friends", computeValue: false, _id: "ex" },
						{ name: "Romance", computeValue: true, _id: "ex" }
					]
				});
		meteorState.layout = this.generateLayout(meteorState.categories);
		return meteorState;
	},

	getInitialState: function() {
		var state = {
			categories: [],
			layout: []
		};
		return state;
	},

    generateLayout: function(categoriesArray) {
      	var layout = [];

		categoriesArray.forEach(function(category, i){
			var MAX_METRICS_PER_ROW = 3;
			var MIN_ROWS = 1;
			var catViewWidth = Math.min(category.metrics.length, MAX_METRICS_PER_ROW); // max 3 wide
			var catViewHeight = Math.ceil(category.metrics.length / 3)

			layout[i] = {
				x: i * 2 % 12,
				y: i * 2 % 12,
				w: catViewWidth,
				h: catViewHeight,
				i: i
			};
		});

        return layout;
    },

	onLayoutChange: function(layout) {
    	this.setState({layout: layout});
	},

	navigateToCategory: function(categoryPath, indexClicked) {
		var categoryId = Categories.findOrCreateByCategoryPath(categoryPath.splice(0, indexClicked+1).join('/'), null);
		this.transitionTo('records-overview', {id: categoryId});
	},

	render: function() {
		reactGridLayoutOptions = {
	        items: this.state.categories.length,
	        cols: 4,
		    isResizable: false,
		    isDraggable: false,
		    rowHeight: 180,
		    autoSize: true
    	};

    	if(this.state.layout.length != 0) {
    		var cards = [];

			var self = this;
    		this.state.categories.forEach(function(category, i){
				metricsView = [];
				category.metrics.forEach(function(metric, i){
					metricsView.push(
						<div key={i} className="column">
							<UI.Metric name={metric.name} categoryPath={category.path} computeResult={metric.computeResult} _id={metric._id}/>
						</div>
					);
				});

				cards.push(
					<div key={i} className="ui card" style={{ display: 'inline-block' }}>
		            	<div className="content">
		            		<h3><Breadcrumb items={category.path} onItemClick={self.navigateToCategory}/></h3>

		            		<div className="ui statistics three column centered grid">
		            			{metricsView}
		            		</div>
		            	</div>
		            </div>
				);
			});

    		var reactGridLayout = (
    			<ReactGridLayout layout={this.state.layout} onLayoutChange={this.onLayoutChange} {...reactGridLayoutOptions}>
		         	{cards}
		        </ReactGridLayout>);
    	}

		return (
			<div className="niceish-padding ui">
				<div className="ui">
					<div style={{ marginLeft: this.REACT_GRID_LAYOUT_MARGIN_LEFT }} className="ui card"><div className="content">
						<h2><Icon n="calendar"/>{Date.create().format('{Weekday}')} <small>{Date.create().format('{ord} {Month}')}</small></h2>
					</div></div>

					{reactGridLayout}
				</div>

			</div>
		);
	}
});



// [
// 				{
// 					path: ["Life"],
// 					metrics: [
// 						{ name: "Satisfaction", computeValue: 80 }
// 					]
// 				},
// 				{
// 					path: ["Life", "Health"],
// 					metrics: [
// 						{ name: "Diabetes", computeValue: 10.3 },
// 						{ name: "Sleep", computeValue: 8 },
// 						{ name: "Exercise", computeValue: 0.86 }
// 					]
// 				},
// 				{
// 					path: ["Life", "Social"],
// 					metrics: [
// 						{ name: "Communications", computeValue: 0.509 },
// 						{ name: "Family", computeValue: true },
// 						{ name: "Friends", computeValue: true },
// 						{ name: "Romance", computeValue: true }
// 					]
// 				},
// 				{
// 					path: ["Life", "Me"],
// 					metrics: [
// 						{ name: "Commitment", computeValue: 0.85 },
// 						{ name: "Self-esteem/image", computeValue: 0.79 },
// 						{ name: "Opportunities", computeValue: 13 },
// 						{ name: "Risk-taking", computeValue: "More!" }
// 					]
// 				}
// 			]


});