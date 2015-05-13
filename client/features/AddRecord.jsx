Meteor.startup(function(){

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
			<div className="niceish-padding">
				<div className="ui segment" key={this.state.resetKey}>
			      
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






});