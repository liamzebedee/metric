// RouteHandler = ReactRouter.RouteHandler;
// DefaultRoute = ReactRouter.DefaultRoute;
// Link = ReactRouter.Link;
// Route = ReactRouter.Route;

// routes = (
//   <Route name="ui" path="/" handler={UI}>
//     <DefaultRoute handler={Dashboard}/>
//   </Route>
// );

// ReactRouter.run(routes, function (Handler) {
//   React.render(<RouteHandler />, document.getElementById('root'));
// });

// http://enome.github.io/javascript/2014/05/09/lets-create-our-own-router-component-with-react-js.html


UI = ReactMeteor.createClass({
	templateName: "UI",


	toggle_add_metric_form: function() {
		this.setState({ add_metric_shown: !this.state.add_metric_shown });
	},
	toggle_add_record_form: function() {
		this.setState({ add_record_shown: !this.state.add_record_shown });
	},

	render: function() {
		return (
			<div>
				<div className="container">
					<UI.Menu on_add_metric_click={this.toggle_add_metric_form} />
					
					<div className="ui page grid">
					<main className="column">
						<UI.Segment title="Add Metric" hidden={!this.state.add_metric_shown}>
		  					<UI.AddMetric />
			  			</UI.Segment>


					</main>
					</div>
				</div>
			</div>
		);
	},

	getInitialState: function() {
		return {
			add_metric_shown: false,
			add_record_shown: false
		};
	},

	getMeteorState: function() {}
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

			  <a className="item">
				<i className="home icon"></i> Overview
			  </a>
			  <a className="item" onClick={this.props.on_add_metric_click}>
				<i className="plus icon"></i> Add metric
			  </a>
			  <a className="item">
				<i className="plus icon"></i> Add record
			  </a>
			  
			</nav>
		);
	},

	getMeteorState: function() {}
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
		  <div className="statistic">
		    <div 
		    	className={Util.classNames('value', { 'text': !Util.isNumber(this.state.computeResult) })} 
		    	onClick={this.openEditorForComputeFunction}>
		      {this.state.computeResult}
		    </div>
		    <div className="label">
		      {this.state.label}
		    </div>
		  </div>
		);
	}
});

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
		    <div className="ui menu">
		      <div className="ui big buttons" style={{ float: 'right' }}>
		        <div className="ui button">Cancel</div>
		        <div className="or"></div>
		        <div className="ui positive button">Save</div>
		      </div>
		    </div>
		    
		    <div className='left'></div>
		    <div className='right'></div>
		  </div>
	  );
	}
});

UI.AddMetric = ReactMeteor.createClass({
	render: function() {
		return (
			<p>asdsa</p>
			);
	}
});

// UI.AddRecord = ReactMeteor.createClass({
// 	render: function() {
// 		return ();
// 	}
// });