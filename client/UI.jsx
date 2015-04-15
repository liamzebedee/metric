RouteHandler = ReactRouter.RouteHandler;
DefaultRoute = ReactRouter.DefaultRoute;
Link = ReactRouter.Link;
Route = ReactRouter.Route;


App = ReactMeteor.createClass({
	contextTypes: {
	    router: React.PropTypes.func.isRequired
	},

	render: function() {
		return (
			<div>
				<div className="container">
					<UI.Menu/>
					
					<div className="ui page ">
					<main className="column">
			  			<RouteHandler/>
					</main>
					</div>
				</div>
			</div>
		);
	}
});

UI = ReactMeteor.createClass({
	render: function() {
		return (<div> </div>);
	}
});

UI.Menu = ReactMeteor.createClass({
	render: function() {
		return (
			 <nav className="ui inverted main menu">
			  <div className="title item">
			        <h1>{"{metric}"}</h1>
			   </div>

			   <div className="item">
			      <div className="ui icon input">
			        <input type="text" placeholder="Search..." style={{ width: '30em' }}/>
			        <i className="search link icon"></i>
			      </div>
			    </div>


			  <Link to="dashboard" className="item">
				<i className="home icon"></i> Overview
			  </Link>
			  <Link to="add-metric" className="item">
				<i className="plus icon"></i> Add metric
			  </Link>
			  <Link to="add-record" className="item">
				<i className="plus icon"></i> Add record
			  </Link>
			  
			</nav>
		);
	}
});

UI.Segment = ReactMeteor.createClass({
	render: function() {
		var cn = "ui segment " + Util.classNames({'hide': this.props.hidden});

		return (
			<div className={cn}>
	  			<h1 className="ui header">{this.props.title}</h1>
				{this.props.children}
			</div>
		);
	}
});

UI.Record = ReactMeteor.createClass({
	render: function() {
		return (
		<div className="ui card">
		  <div className="content">
		    <div className="header">Cute Dog</div>
		    <div className="meta">
		      <span>2 days ago</span>
		      <a>Animals</a>
		    </div>
		    <p></p>
		  </div>
		</div>
		);
	}
});

UI.Metric = ReactMeteor.createClass({
	openEditorForComputeFunction: function() {

	},

	getInitialState: function() {
		return {
			computeResult: 321,
			label: "Number of dogs"
		};
	},

	render: function() {
		return (
		  <div className="metric">
		  <div className="statistic">
		    <div 
		    	className={Util.classNames('value', { 'text': !Util.isNumber(this.state.computeResult) })}>
		      {this.state.computeResult}
		    </div>
		    <div className="label">
		      {this.state.label}
		    </div>
		  </div>
		  </div>
		);
	}
});

// TODO For a later version where we abstract away the view/interface

// UI.MetricInterface = ReactMeteor.createClass({

// 	getInitialState: function() {
// 		return {
// 			renderFunc: function() {
// 				return (
// 				);
// 			}
// 		};
// 	},

// 	render: function() {
// 		return this.state.renderFunc();
// 	}

// });

UI.JSEditor = ReactMeteor.createClass({
	componentDidMount:  function() {
		var state = {};
		state.editor = jsEditor({
		    value: "'use strict';\nfunction computeMetric(Metrics, Records) {\n\t// write code that will compute the metric here\n\treturn 0;\n}",
		    mode: "javascript",
		    lineNumbers: true,
		    matchBrackets: true,
		    indentWithTabs: true,
		    tabSize: 2,
		    indentUnit: 2,
		    updateInterval: 500,
		    dragAndDrop: false,
			container: document.querySelector('#code-editor')
		});
		return state;
	},

	render: function() {
		return (
			<div id='code-editor' className="ui container">
		    <div className='left'></div>
		    <div className='right'></div>
		  </div>
	  );
	}
});

AddMetric = ReactMeteor.createClass({
	mixins: [React.addons.LinkedStateMixin],

	contextTypes: {
	    router: React.PropTypes.func.isRequired
	  },

	getInitialState: function() {
	    return {
	    	name: "",
	    	category: ""
	    	// state also includes state of UI.JSEditor
	    };
	  },

	 clearForm: function() {
	 	//  TODO
	 },

	 submitForm: function() {
	 	// TODO
	 },

	render: function() {
		return (
			<div>
				<div className="ui segment">
			      
			     <h1 style={{ display: 'inline-block' }}>Add Metric</h1>
			      
			      <span className="ui big buttons" style={{ display: 'inline-block', 'float': 'right' }}>
			        <button className="ui button" onClick={this.clearForm}><i className="remove icon"></i>Clear</button>
			        <div className="or"></div>
			        <button className="ui positive button" onClick={this.submitForm}><i className="add circle icon"></i>Submit</button>
			      </span>

					<form className="ui form">
						<div className="two fields">
							<div className="required field">
						      <label>Name</label>
						      <div className="ui icon input">
						        <input type="text" placeholder="Daily exercise" valueLink={this.linkState('name')}/>
						      </div>
						    </div>
						    <div className="required field">
						      <label>Category</label>
						      <div className="ui icon input">
						        <input type="text" placeholder="Health" valueLink={this.linkState('category')}/>
						        <i className="search link icon"></i>
						      </div>
						    </div>
						</div>

						<h4>Compute</h4>
					</form>
	  			</div>
				<UI.JSEditor />
	  		</div>
		);
	}
});

AddRecord = ReactMeteor.createClass({
	contextTypes: {
    router: React.PropTypes.func.isRequired
  },

	render: function() {
		return (
			<UI.Segment title="Add Record">
				
  			</UI.Segment>
		);
	}
});

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

MetricOverview = ReactMeteor.createClass({
	contextTypes: {
    router: React.PropTypes.func.isRequired
  },

	render: function() {
		return (
			<h1>Metric Overview</h1>
		);
	}
});

RecordsOverview = ReactMeteor.createClass({
	contextTypes: {
    router: React.PropTypes.func.isRequired
  },

	render: function() {
		return (
			<h1>Metric Overview</h1>
		);
	}
});

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


// A bit of inspiration for this project has come from Douglas Adams' "Dirk Gently's Holistic Detective Agency", from a particular section of the novel where Richard MacDuff is discussing a program he created back in the 80s, which is a sort of spreadsheeting application that turns numerical data into music. Aside from the obvious facetiousness which follows the rest of the novel, this particular idea (which hasn't been executed to my knowledge) posseses a certain childlike naivety to it - "why not? we can see data, we can touch it, why can't we hear it".
// And so, why not?