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
			resetKey: (+new Date()), // oh I'm naughty

	    	name: "",
	    	categoryText: "",
	    	computeFunctionString: "// Metrics('/Category/Metric name')\n// Records('/Category path/goes here/').get()\n\
// the return value is your output\n",
	    	computeFunctionValid: true,

	    	metricError: ""
	    };
	    state.jsEditor = (<UI.JSEditor 
					    	code={state.computeFunctionString} 
					    	onValidation={this.onEditorValidation}/>);
	    return state;
	  },

	 clearForm: function() {
	 	this.replaceState(this.getInitialState());
	 },

	changeCategory: function(category) {
		this.setState({ categoryText: category });
	}, 

	 submitForm: function() {
	 	try {
	 		Meteor.call('upsertMetric', this.state.name, this.state.categoryText, this.state.computeFunctionString);
	 		this.clearForm();
	 	} catch(ex) {
	 		this.setState({metricError: ex.toString()});
	 	}
	 },

	render: function() {
		var noValidationErrors = 
				this.state.computeFunctionValid
			&&	this.state.name != ""
			&&	this.state.categoryText != "";

		if(this.state.metricError) {
			var errorbox = (<div className="ui inline nag">
				  <span className="title">
				  	{this.state.metricError}
				  </span>
				</div>);
		}

		return (
			<div key={this.state.resetKey} style={{ padding: '1em 1em'}}>
				<div className="ui segment">
			      
			     <h1 style={{ display: 'inline-block' }}>Add Metric</h1>

			     {errorbox}
			      
			      <span className="ui big buttons" style={{ display: 'inline-block', 'float': 'right' }}>
			        <button className="ui button" onClick={this.clearForm}><i className="remove icon"></i>Clear</button>
			        <div className="or"></div>
			        <button className={ Util.classNames("ui positive button", { 'disabled': !noValidationErrors }) } onClick={this.submitForm}><i className="add circle icon"></i>Submit</button>
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
						      <UI.CategorySearchInput onNewSearchOrCategory={this.changeCategory}/>
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
			resetKey: (+new Date()), // oh I'm naughty

			editingSchema: false,

			categoryText: "",

			defaultFields: {
				"string": {
					value: ""
				},
				"number": {
					value: 6.5,
					step: 0.5,
					min: 2,
					max: 30
				},
				"Date": {
					value: new Date()
				},
				"boolean": {
					value: false
				}
			},

			fields: [
				{ fieldName: "timestamp", value: new Date }
			]

	    };
	    return state;
	  },

	updateField: function(fieldIndex, value) {
		newState = this.state.fields;
		newState[fieldIndex].value = value; 
		this.setState({ fields: newState });
	},

	clearForm: function() {
		// don't reset category text
		var categoryText = Util.clone(this.state.categoryText);
		this.replaceState(this.getInitialState());
		this.changeCategory(categoryText);
	},

	getSchema: function() {
		var copyOfStateFields = Util.clone(this.state.fields);
		return copyOfStateFields;
	},

	submitForm: function() {
		var copyOfStateFields = Util.clone(this.state.fields);
		var fields = {};
		var schema = [];


		// // separate fields from schema data
		for (var i = 0, field; field = copyOfStateFields[i]; i++) {
			// fields
			var name = field.fieldName;
			fields[name] = field.value;

			// schema
			schema.push(field);
		}

		Categories.setSchema(this.state.categoryText, schema);
		Records.addRecord(this.state.categoryText, null, fields);

		this.clearForm();
	},

	changeEditingSchemaStatus: function() {
		if(!this.state.editingSchema && this.state.categoryText != '') {
			Categories.setSchema(this.state.categoryText, this.getSchema());
		}
		this.setState({ editingSchema: !this.state.editingSchema });
	},

	addField: function() {
		var fields = this.state.fields;
		var i = fields.length + 1;
		fields.push($.extend({ fieldName: "New field #"+i }, this.state.defaultFields["number"]));
		this.setState({fields: fields});
	},

	changeFieldType: function(fieldName, newType) {
		var fields = this.state.fields;
		for (var i = 0, field; field = this.state.fields[i]; i++) {
			if(field.fieldName == fieldName) {
				this.state.fields[i] = $.extend(this.state.defaultFields[newType], { fieldName: fieldName });
			}
		};
		this.setState({fields: fields});
	},

	changeCategory: function(category) {
		var newState = {};
		newState.categoryText = category;
		newState.fields = Categories.findCategoryByPath(category).schema;
		this.setState(newState);
	},

	renameField: function(fieldName, event) {
		var newFieldName = event.target.value;
		var fields = this.state.fields;
		fields.forEach(function(field){
			if(field.fieldName == fieldName) {
				field.fieldName = newFieldName;
			}
		});
		this.setState({fields: fields});
	},

	render: function() {
		fieldsView = [];

		for (var i = 0, field; field = this.state.fields[i]; i++) {
			var fieldName = field.fieldName;
			var fieldView = null;
			var fieldType = Util.getObjectType(field.value);
			switch(fieldType) {
				case 'string':
					fieldView = (<UI.JSONString name={fieldName} value={field.value} updateValue={this.updateField.bind(this, i)}/>);
					break;
				case 'number':
					fieldView = (<UI.JSONNumber name={fieldName} step={field.step} min={field.min} max={field.max} value={field.value} updateValue={this.updateField.bind(this, i)}/>);
					break;
				case 'boolean':
					fieldView = (<UI.JSONBoolean name={fieldName} value={field.value} updateValue={this.updateField.bind(this, i)}/>);
					break;
				case 'Date':
					fieldView = (<UI.JSONDateTime name={fieldName} value={field.value} updateValue={this.updateField.bind(this, i)}/>);
					break;
				default:
					console.log("Error: field "+"'"+fieldName+"'"+" type isn't recognised "+(typeof field.value));
			}

			var typeCol, controlsCol;
			if(this.state.editingSchema) {
				typeCol = <td><AddRecord.FieldTypeSelector fieldType={fieldType} onFieldTypeChange={this.changeFieldType.bind(this, fieldName)}/></td>;
				controlsCol = (
					<td>
						<button className="ui red icon button"><i className="minus square icon" onClick={this.deleteField}></i> Delete</button>
						<button className="ui icon button"><i className="ellipsis horizontal icon"></i></button>
					</td>
				);
			}

			var fieldNameView;

			if(this.state.editingSchema) {
				fieldNameView = (<input type="text" defaultValue={fieldName} onChange={this.renameField.bind(this, fieldName)}/>);
			} else {
				fieldNameView = (<span>{fieldName}</span>);
			}

			fieldsView.push((
			    <tr key={i}>
			      <td>{fieldNameView}</td>
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

		var noValidationErrors = 
				this.state.fields.length > 0
			&&	this.state.categoryText != "";

		return (
			<div style={{ padding: '1em 1em'}}>
				<div className="ui segment" key={this.state.resetKey} >
			      
			     <h1 style={{ display: 'inline-block' }}>Add Record</h1>
			      
			      <span className="ui big buttons" style={{ display: 'inline-block', 'float': 'right' }}>
			        <button className="ui button" onClick={this.clearForm}><i className="remove icon"></i>Clear</button>
			        <div className="or"></div>
			        <button className={ Util.classNames("ui positive button", { 'disabled': !noValidationErrors }) } onClick={this.submitForm}><i className="add circle icon"></i>Submit</button>
			      </span>

					<div className="ui form">
						<div className="one field">
						    <div className="required field">
						      <label>Category</label>
						      <UI.CategorySearchInput onNewSearchOrCategory={this.changeCategory}/>
						    </div>
						</div>

						<header>
							<h2 className="ui dividing header" style={{ display: 'inline-block' }}>Fields</h2>
			      
					      <span className="ui buttons" style={{ display: 'inline-block', 'float': 'right', marginLeft: '1em' }}>
							<button className="ui blue icon button" onClick={this.changeEditingSchemaStatus}><i className="edit icon"></i>{ this.state.editingSchema ? "Finish editing" : "Edit schema"}</button>
							<button className="ui positive button" onClick={this.addField}><i className="add circle icon"></i>Add new</button>
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
						

						<button className="ui big green icon button" onClick={this.submitForm}><i className="add icon"></i>Add record</button>
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
		var _this = this;
		$(React.findDOMNode(this.refs.dropdown)).dropdown({
			onChange: _this.onChange
		});
		$(React.findDOMNode(this.refs.text)).html(React.renderToString(this.getViewForType(this.state.selectedType)));
	},

	onChange: function(value, text, $choice) {
		this.setState({ selectedType: value });
		this.props.onFieldTypeChange(this.state.selectedType);
	},

	getHumanTypeForJSType: function(jsType) {
		// this data shouldn't be in state, but eh.
		// TODO
		var humanType = '';
		this.state.types.forEach(function(type){
			if(type.jsType === jsType) {
				humanType = type.name;
				return;
			}
		});
		return humanType;
	},

	getViewForType: function(jsType) {
		var view = '';
		this.state.types.forEach(function(type){
			if(type.jsType === jsType) {
				view = type.view;
				return;
			}
		});
		return view;
	},

	getInitialState: function() {
		var state = {
			selectedType: this.props.fieldType,
			types: [
				{
					name: 'Number',
					icon: 'calculator',
					jsType: 'number'
				},
				{
					name: 'Dates and times',
					icon: 'calendar',
					jsType: 'Date'
				},
				{
					name: 'Text',
					icon: 'font',
					jsType: 'string'
				},
				{
					name: 'Checkbox',
					icon: 'toggle off',
					jsType: 'boolean'
				}
			]
		};

		// add views
		state.types.forEach(function(type) {
			type.view = (<div className="item" key={type.jsType} data-value={type.jsType}><i className={"icon "+type.icon}></i>{type.name}</div>);
		});


		return state;
	},

	render: function() {
		// fieldType={fieldType} onFieldTypeChange={this.changeFieldType}
		var typesView = [];
		this.state.types.forEach(function(type){ typesView.push(type.view); })

		return (
		<div className="ui fluid search selection dropdown" ref="dropdown">
		  <i className="dropdown icon"></i>
		  <div className="text" ref="text"></div>
		  
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

	updateParentValue: function(event) {
		var val = event.target.value;
		this.props.updateValue(val);
	},

	render: function() {
		return (
			<div className={Util.classNames("inline field", {"required": this.state.isRequired}) }>
		      
		      <div className="ui input">
		        <input type="datetime" value={this.props.value} onChange={this.updateParentValue}/>
		      </div>
		    </div>
		);
	}
});

UI.JSONNumber = ReactMeteor.createClass({
	getInitialState: function() {
		return { fieldValue: this.props.value, name: this.props.name, isRequired: true };
	},

	updateParentValue: function(event) {
		var val = parseFloat(event.target.value, 10);
		this.props.updateValue(val);
	},

	render: function() {
		return (
		<div className={Util.classNames("inline field", {"required": this.state.isRequired}) }>
		      <div className="ui input">
		        <input type="number" min={this.props.min} max={this.props.max} step={this.props.step} value={this.props.value} onChange={this.updateParentValue} />
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

	updateParentValue: function(event) {
		var val = event.target.value;
		this.props.updateValue(val);
	},

	render: function() {
		return (
		<div className={Util.classNames("inline field", {"required": this.state.isRequired}) }>
		        <textarea className="expandable" style={{ height: '3em', minHeight: '3em'}} onChange={this.updateParentValue} rows="1"  value={this.props.value}/>
		    </div>
			);
	}
});

UI.JSONBoolean = ReactMeteor.createClass({
	mixins: [React.addons.LinkedStateMixin],

	getInitialState: function() {
		return { value: this.props.value, name: this.props.name, isRequired: true };
	},

	componentDidMount: function() {
		var self = this;
		$(React.findDOMNode(this.refs.checkbox)).checkbox({
			onChange: self.updateParentValue
		}); // I love React, it's so simple, refs make so much sense
	},

	updateParentValue: function() {
		var oldVal = this.state.value;
		this.setState({ value: !oldVal });
		this.props.updateValue(!oldVal);
		console.log(!oldVal);
	},

	render: function() {
		//  value={this.props.value}
		return (
			<div className={Util.classNames("inline field", {"required": this.state.isRequired}) }>
				<div className={Util.classNames("ui toggle checkbox", {"checked": this.state.value}) } ref="checkbox" >
					<input type="checkbox" />
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

	getInitialState: function() {
		return {
			metric: {
				name: "",
				computeResult: null
			}
		};
	},

	componentDidMount: function() {
		this.loadMetric();
	},

	componentWillReceiveProps: function() {
		this.loadMetric();		
	},

	loadMetric: function(){
		var self = this;
		Meteor.startup(function(){
			self.setState({ metric: Metrics.findOne(self.getMetricId()) });
		});
	},

	getMetricId: function(){ return this.context.router.getCurrentParams().id; },

	recomputeMetric: function(){
	},

	render: function() {
		return (
			<div>
				<h1>Metric Overview</h1>
				<div>{this.state.metric.name} = {this.state.metric.computeResult}</div>
				<button onClick={this.recomputeMetric}>Recompute</button>
			</div>
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
			/*if(noErrors != false)*/ noErrors = true; // disable temp until I can customise it
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


SearchInput = ReactMeteor.createClass({
	mixins: [React.addons.LinkedStateMixin],


	componentDidMount: function(){

		var _this = this;
		$(React.findDOMNode(this.refs.search)).search({
		    source: this.state.results,
		    searchFields: [
		      'title'
		    ],
		    searchFullText: true,
		    onSearchQuery: function(){
		    	_this.setState({ results: _this.props.onSearchQuery() });

		    }
		});
	},

	getInitialState: function(){
		return {
			searchText: '',
			results: []
		};
	},

	render: function() {
		return (
			<div ref="search" className="ui category search">
		    <div className="ui icon input">
		      <input className="prompt" type="text" placeholder={this.props.placeholder} valueLink={this.linkState('searchText')}/>
		      <i className="search icon"></i>
		    </div>
		    <div className="results"></div>
		  </div>
		);
	}
});


UI.CategorySearchInput = ReactMeteor.createClass({
	getInitialState: function() {
		return { options: [] };
	},

	onKeyDown: function(event) {
		var searchText = this.refs.typeahead.refs.entry.props.value;
		this.searchForCategory(searchText);
	},

	selectCategory: function(category) {
		this.props.onNewSearchOrCategory(category);
	},

	searchForCategory: function(searchText) {
		var modifiers = 'ig';
		var pattern = '[a-zA-Z\/ -]*';
		var searchBits = Categories.parsePathIntoArray(searchText);
		
		var categoriesCursor = Categories.find({
			// thanks https://regex101.com/
			// took a while, but I got it
			path: { $all: searchBits.map(function(v){ return new RegExp(v+pattern, modifiers) }) }
		}, {});
		var num = categoriesCursor.count();

		var results = categoriesCursor.fetch() || [];

		var resultsOnlyText = [];
		results.forEach(function(cat){
			resultsOnlyText.push(cat.path.join('/'));
		});

		// this.setState({ options: resultsOnlyText });
		this.refs.typeahead.props.options = resultsOnlyText;
	},

	addNewCategory: function() {
		var currentCategory = this.refs.typeahead.refs.entry.props.value;
		Categories.findOrCreateByCategoryPath(currentCategory);
		this.selectCategory(currentCategory);
	},

	render: function() {
		return (
			<div className="ui action input">
				<ReactTypeahead.Typeahead ref="typeahead" className="ui search focus" placeholder="/Health/Physical/Diabetes/Blood Glucose Levels" customClasses={{ results: "results transition visible", input: "prompt", listItem: "result" }} onKeyDown={this.onKeyDown} onOptionSelected={this.selectCategory} options={this.state.options}/>
				<button className={Util.classNames("ui button")} onClick={this.addNewCategory}><i className="add circle icon"></i>Create</button>
			</div>
		);
	}
});



// A bit of inspiration for this project has come from Douglas Adams' "Dirk Gently's Holistic Detective Agency", from a particular section of the novel where Richard MacDuff is discussing a program he created back in the 80s, which is a sort of spreadsheeting application that turns numerical data into music. Aside from the obvious facetiousness which follows the rest of the novel, this particular idea (which hasn't been executed to my knowledge) posseses a certain childlike naivety to it - "why not? we can see data, we can touch it, why can't we hear it".
// And so, why not?