Meteor.startup(function(){

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
	 	} catch(ex) { // TODO doesn't work
	 		this.setState({metricError: ex.toString()});
	 	}
	 },

	 searchForCategory: function(input, callback) {
	 	return callback(null, ['dog','cat']);
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
			<div key={this.state.resetKey} className="niceish-padding">
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
						      <UI.CategorySearchInput onSelect={this.changeCategory}/>
								
						    </div>
						</div>

					</form>
					
	  			</div>

	  			<h2 className="ui dividing header"><Icon n="code"/><div className="content">Compute function</div></h2>
	  			<a href="https://github.com/liamzebedee/metric/wiki/Writing-a-metric" target="_blank"><Icon n="info circle"/> Docs</a>

				{this.state.jsEditor}
	  		</div>
		);
	}
});


});