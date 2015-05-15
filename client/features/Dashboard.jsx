Meteor.startup(function(){


Dashboard = ReactMeteor.createClass({
    mixins: [React.PureRenderMixin],

	contextTypes: {
  		router: React.PropTypes.func.isRequired
	},

	componentDidMount: function() {
        var ev = document.createEvent('Event');
        ev.initEvent('resize', true, true);
        window.dispatchEvent(ev);

		Meteor.subscribe('metrics', this.metricDataReady);
    },

    metricDataReady: function() {
    	var OPTIONS = { reactive: true };
    	var categories = Categories.find({}, OPTIONS);
    	categories.observe({
    		// added: alert(1),
    		// changed: alert(1),
    		// removed: alert(1),
    	});
    	var metrics = Metrics.find({});
    },

    getDefaultProps: function() {
        return {
	        items: 4,
	        cols: 4,
		    isResizable: true,
		    isDraggable: false,
		    rowHeight: 180,
		    autoSize: true,
			// margin: [0,0]
    	}
	},

	getInitialState: function() {
		var state = {
			// TODO dummy data
			// get reactive cursor from DB
			categories: [
				{
					path: ["Life"],
					metrics: [
						{ name: "Satisfaction", value: 80 }
					]
				},
				{
					path: ["Life", "Health"],
					metrics: [
						{ name: "Diabetes", value: 10.3 },
						{ name: "Sleep", value: 8 },
						{ name: "Exercise", value: 0.86 }
					]
				},
				{
					path: ["Life", "Social"],
					metrics: [
						{ name: "Communications", value: 0.509 },
						{ name: "Family", value: true },
						{ name: "Friends", value: true },
						{ name: "Romance", value: true }
					]
				},
				{
					path: ["Life", "Me"],
					metrics: [
						{ name: "Commitment", value: 0.85 },
						{ name: "Self-esteem/image", value: 0.79 },
						{ name: "Opportunities", value: 13 },
						{ name: "Risk-taking", value: "More!" }
					]
				}
			]
		};
		state.layout = this.generateLayout(state.categories);
		return state;
	},

	generateCards: function() {
		cards = [];

		this.state.categories.forEach(function(category, i){
			metricsView = [];
			category.metrics.forEach(function(metric, i){
				metricsView.push(
					<div key={i} className="column">
						<UI.Metric name={metric.name} categoryPath={category.path} computeResult={metric.value}/>
					</div>
				);
			});
			cards.push(
				<div key={i} className="ui card" style={{ display: 'inline-block' }}>
		            	<div className="content">
		            		<h3>{ category.path.join(' / ') }</h3>

		            		<div className="ui statistics three column centered grid">
		            			{metricsView}
		            		</div>
		            	</div>
		            </div>
			);
		});

		return cards;
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

	render: function() {
		var REACT_GRID_LAYOUT_MARGIN_LEFT = 10;

		return (
			<div className="niceish-padding ui">
				<div className="ui ">
					<div style={{ marginLeft: REACT_GRID_LAYOUT_MARGIN_LEFT }} className="ui card"><div className="content">
						<h2><Icon n="calendar"/>{Date.create().format('{Weekday}')} <small>{Date.create().format('{ord} {Month}')}</small></h2>
					</div></div>

					<ReactGridLayout layout={this.state.layout} onLayoutChange={this.onLayoutChange} {...this.props}>
		            	{this.generateCards()}
		            </ReactGridLayout>
				</div>

			</div>
		);
	}
});






});