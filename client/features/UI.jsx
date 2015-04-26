// Main UI
RouteHandler = ReactRouter.RouteHandler;

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

Link = ReactRouter.Link;

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

AddMetric = ReactMeteor.createClass({
	mixins: [React.addons.LinkedStateMixin],

	onEditorValidation: function(newVal, noErrors) {
		this.setState({
			computeFunctionString: newVal,
			computeFunctionValid: noErrors
		});
	},

	contextTypes: {
	    router: React.PropTypes.func.isRequired
	  },

	getInitialState: function() {
		var state = {
			resetKey: 0+new Date(), // oh I'm naughty

	    	name: "",
	    	category: "",
	    	computeFunctionString: "// use metric.Metrics and metric.Records as inputs\n\
// metric.computeResult is your output\n\
'use strict';\n",
	    	computeFunctionValid: true
	    };
	    state.jsEditor = (<UI.JSEditor 
					    	code={state.computeFunctionString} 
					    	onValidation={this.onEditorValidation}/>);
	    return state;
	  },

	 clearForm: function() {
	 	this.replaceState(this.getInitialState());
	 },

	 submitForm: function() {
	 	Metrics.addMetric(this.state.name, this.state.category, this.state.computeFunctionString);
	 	this.clearForm();
	 },

	render: function() {
		return (
			<div key={this.state.resetKey} style={{ padding: '1em 1em'}}>
				<div className="ui segment">
			      
			     <h1 style={{ display: 'inline-block' }}>Add Metric</h1>
			      
			      <span className="ui big buttons" style={{ display: 'inline-block', 'float': 'right' }}>
			        <button className="ui button" onClick={this.clearForm}><i className="remove icon"></i>Clear</button>
			        <div className="or"></div>
			        <button className={ Util.classNames("ui positive button", { 'disabled': !this.state.computeFunctionValid }) } onClick={this.submitForm}><i className="add circle icon"></i>Submit</button>
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
						        <input type="text" placeholder="/Health/Physical" valueLink={this.linkState('category')}/>
						        <i className="search link icon"></i>
						      </div>
						    </div>
						</div>

						<h4>Compute</h4>
					</form>
	  			</div>
				{this.state.jsEditor}
	  		</div>
		);
	}
});

AddRecord = ReactMeteor.createClass({
	contextTypes: {
		router: React.PropTypes.func.isRequired
	},

	mixins: [React.addons.LinkedStateMixin],

	getInitialState: function() {
		var state = {
			resetKey: 0+new Date(), // oh I'm naughty

			editingSchema: false,

			fields: {
				"String": {
					value: ""
				},
				"Number": {
					value: 6.5,
					step: 0.5,
					min: 2,
					max: 30
				},
				"DateTime": {
					value: new Date()
				},
				"Boolean": {
					value: true
				}
			}
	    };
	    return state;
	  },

	 clearForm: function() {
	 	this.replaceState(this.getInitialState());
	 },

	submitForm: function() {
		Metrics.addMetric(this.state.name, this.state.category, this.state.computeFunctionString);
		this.clearForm();
	},

	changeEditingSchemaStatus: function() {
		this.setState({ editingSchema: !this.state.editingSchema });
	},

	render: function() {
		fieldsView = [];
		for(fieldName in this.state.fields) {
			var field = this.state.fields[fieldName];
			var fieldView = null;
			switch(Util.getObjectType(field.value)) {
				case 'string':
					fieldView = (<UI.JSONString name={fieldName} value={field.value}/>);
					break;
				case 'number':
					fieldView = (<UI.JSONNumber name={fieldName} step={field.step} min={field.min} max={field.max} value={field.value}/>);
					break;
				case 'boolean':
					fieldView = (<UI.JSONBoolean name={fieldName} value={field.value}/>);
					break;
				case 'Date':
					fieldView = (<UI.JSONDateTime name={fieldName} value={field.value}/>);
					break;
				default:
					console.log("Error: field type isn't recognised "+(typeof field.value));
			}

			var typeCol, controlsCol;
			if(this.state.editingSchema) { 
				typeCol = <td><AddRecord.FieldTypeSelector /></td>;
				controlsCol = (
					<td>
						<button className="ui red icon button"><i className="minus square icon" onClick={this.deleteField}></i> Delete</button>
						<button className="ui icon button"><i className="ellipsis horizontal icon"></i></button>
					</td>
				);
			}
			fieldsView.push((
			    <tr className="" key={fieldName}>
			      <td>{fieldName}</td>
			      <td>{fieldView}</td>
			      {typeCol}
			      {controlsCol}
			    </tr>
			));
		};

		var editingTypeHeader, editingControlsHeader;
		if(this.state.editingSchema) {
			editingTypeHeader = <th>Type</th>;
			editingControlsHeader = <th>Controls</th>;
		}

		return (
			<div style={{ padding: '1em 1em'}}>
				<div className="ui segment" key={this.state.resetKey} >
			      
			     <h1 style={{ display: 'inline-block' }}>Add Record</h1>
			      
			      <span className="ui big buttons" style={{ display: 'inline-block', 'float': 'right' }}>
			        <button className="ui button" onClick={this.clearForm}><i className="remove icon"></i>Clear</button>
			        <div className="or"></div>
			        <button className={ Util.classNames("ui positive button", { 'disabled': !this.state.computeFunctionValid }) } onClick={this.submitForm}><i className="add circle icon"></i>Submit</button>
			      </span>

					<div className="ui form">
						<div className="one field">
						    <div className="required field">
						      <label>Category</label>
						      <div className="ui icon input">
						        <input type="text" placeholder="/Health/Physical/Diabetes/Blood Glucose Levels" valueLink={this.linkState('category')}/>
						        <i className="search link icon"></i>
						      </div>
						    </div>
						</div>

						<header>
							<h2 className="ui dividing header" style={{ display: 'inline-block' }}>Fields</h2>
			      
					      <span className="ui buttons" style={{ display: 'inline-block', 'float': 'right', 'margin-left': '1em' }}>
							<button className="ui blue icon button" onClick={this.changeEditingSchemaStatus}><i className="edit icon"></i>{ this.state.editingSchema ? "Finish editing" : "Edit schema"}</button>
							<button className="ui positive button"><i className="add circle icon"></i>Add new</button>
					      </span>
						</header>

						<table className="ui celled table">
						  <thead>
						    <tr>
						      <th>Name</th>
						      <th>Value</th>
						      {editingTypeHeader}
						      {editingControlsHeader}
						    </tr>
						  </thead>
						  <tbody>{fieldsView}</tbody>
						</table>

						<br/><br/>
						

						<button>Add field</button>
					</div>
	  			</div>
  			</div>
		);
	}
});

  // <tfoot className="full-width">
  //   <tr>
  //     <th></th>
  //     <th colSpan="4">
//      		<button className="ui positive button"><i className="add circle icon"></i>Add new</button>
  //     </th>
  //   </tr>
  // </tfoot>

AddRecord.FieldTypeSelector = ReactMeteor.createClass({
	componentDidMount: function() {
		$(React.findDOMNode(this.refs.dropdown)).dropdown();
	},

	getInitialState: function() {
		var state = {
			selectedType: '',
			types: [
				{
					name: 'Number',
					icon: 'calculator'
				},
				{
					name: 'Dates and times',
					icon: 'calendar'
				},
				{
					name: 'Text',
					icon: 'font'
				},
				{
					name: 'Checkbox',
					icon: 'toggle off'
				}
			]
		};
		return state;
	},

	render: function() {
		var typesView = [];
		this.state.types.forEach(function(type) {
			typesView.push(<div className="item" key={type.name}><i className={"icon "+type.icon}></i>{type.name}</div>);
		});

		return (
		<div className="ui fluid search selection dropdown" ref="dropdown">
		  <i className="dropdown icon"></i>
		  <div className="default text">Select Country</div>
		  <div className="menu">
		  	{typesView}
		  </div>
		</div>
		);
	}
});

UI.JSONDateTime = ReactMeteor.createClass({
	getInitialState: function() {
		return { value: this.props.value, name: this.props.name, isRequired: true };
	},

	render: function() {
		return (
			<div className={Util.classNames("inline field", {"required": this.state.isRequired}) }>
		      
		      <div className="ui input">
		        <input type="datetime"/>
		      </div>
		    </div>
		);
	}
});

UI.JSONNumber = ReactMeteor.createClass({
	getInitialState: function() {
		return { value: this.props.value, name: this.props.name, isRequired: true };
	},

	render: function() {
		return (
		<div className={Util.classNames("inline field", {"required": this.state.isRequired}) }>
		      
		      <div className="ui input">
		        <input type="number" min={this.props.min} max={this.props.max} step={this.props.step}/>
		      </div>
		    </div>
			);
	}
});
UI.JSONString = ReactMeteor.createClass({
	mixins: [React.addons.LinkedStateMixin],

	getInitialState: function() {
		return { value: this.props.value, name: this.props.name, isRequired: true };
	},

	render: function() {
		return (
		<div className={Util.classNames("inline field", {"required": this.state.isRequired}) }>
		        <textarea className="expandable" style={{ height: '3em', 'min-height': '3em'}} valueLink={this.linkState('value')} rows="1"></textarea>
		    </div>
			);
	}
});
UI.JSONBoolean = ReactMeteor.createClass({
	getInitialState: function() {
		return { value: this.props.value, name: this.props.name, isRequired: true };
	},

	componentDidMount: function() {
		$(React.findDOMNode(this.refs.checkbox)).checkbox(); // I love React, it's so simple, refs make so much sense
	},

	render: function() {
		return (
			<div className={Util.classNames("inline field", {"required": this.state.isRequired}) }>
					    <div className="ui toggle checkbox" ref="checkbox">
					      <input type="radio" />
					      
					    </div>
					  	</div>
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


UI.JSEditor = ReactMeteor.createClass({
	componentDidMount:  function() {
		var editor = jsEditor({
		    value: this.props.code,
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
		var _this = this;
		editor.on('valid', function(noErrors) {
			// BUG in jsEditor meaning that when there are no errors it returns undefined
			// We set it to true here so it makes sense
			if(noErrors != false) noErrors = true;
			_this.props.onValidation(editor.getValue(), noErrors);
		});
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

// A bit of inspiration for this project has come from Douglas Adams' "Dirk Gently's Holistic Detective Agency", from a particular section of the novel where Richard MacDuff is discussing a program he created back in the 80s, which is a sort of spreadsheeting application that turns numerical data into music. Aside from the obvious facetiousness which follows the rest of the novel, this particular idea (which hasn't been executed to my knowledge) posseses a certain childlike naivety to it - "why not? we can see data, we can touch it, why can't we hear it".
// And so, why not?