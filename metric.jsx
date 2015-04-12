/*
 * @jsx React.DOM
 */
'use strict';

var Metrics = new Mongo.Collection("metrics");
var Records = new Mongo.Collection("records");

var UI = ReactMeteor.createClass({
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
			  			</UI.Segment>

			  			<div className="ui statistics">
		  				<UI.Metric />
		  				<UI.Record />	
		  				</div>
					</main>
					</div>
				</div>

				<UI.JSEditor />
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
				<i className="mail icon"></i> Add metric
			  </a>
			  <a className="item">
				<i className="user icon"></i> Add record
			  </a>
			  
			</nav>
		);
	},

	getMeteorState: function() {}
});

UI.Segment = ReactMeteor.createClass({
	render: function() {
		var cn = "ui segment " + classNames({'hide': this.props.hidden});

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
		    	className={classNames('value', { 'text': !isNumber(this.state.computeResult) })} 
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

var Util = {
	timestamp: function() { return new Date().getTime(); }
};

function classNames() {
	var classes = '';
	var arg;

	for (var i = 0; i < arguments.length; i++) {
		arg = arguments[i];
		if (!arg) {
			continue;
		}

		if ('string' === typeof arg || 'number' === typeof arg) {
			classes += ' ' + arg;
		} else if (Object.prototype.toString.call(arg) === '[object Array]') {
			classes += ' ' + classNames.apply(null, arg);
		} else if ('object' === typeof arg) {
			for (var key in arg) {
				if (!arg.hasOwnProperty(key) || !arg[key]) {
					continue;
				}
				classes += ' ' + key;
			}
		}
	}
	return classes.substr(1);
}

// Why is this language so complex...
// http://stackoverflow.com/questions/1303646/check-whether-variable-is-number-or-string-in-javascript
function isNumber(obj) { return !isNaN(parseFloat(obj)) }

// Metrics.addNew = function(metricData) {
// 	// name - BGLs
// 	// category - /Health/Diabetes
// 	// compute(metrics, records)
	
// 	parse category
// 	jsobj = metrics
// 	foreach part of category.split('/')[1-end]
// 		jsobj = jsobj[part]
// 	jsonobj[name] = { metric_id: nextID(), metric_timestamp: currentTime(), compute: compute }
	
// };

// Records.addNew = function(newRecord) {
// 	// var record = {
// 	// 	metric_id: nextID(),
// 	// 	metric_timestamp: currentTime(),
// 	// 	...data
// 	// };
// 	// jsobj = metrics
// 	// foreach part of category.split('/')[1-end]
// 	// 	jsobj = jsobj[part]
// 	// jsonobj[name].push(record)
// };

// use JS AST to analyse Metric.compute, and analyse dependencies between variables to create a better update algorithm
// metric.compute(Metrics.copy, Records.copy) foreach metric
// memoization for caching computations
// TODO implement a view syntax

// http://estools.github.io/esquery/
// http://esprima.org/doc/index.html
// http://pegjs.org/

if (Meteor.isServer) {
	Meteor.startup(function () {
	});
}