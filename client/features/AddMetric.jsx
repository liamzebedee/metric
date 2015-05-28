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

	  getInitialProps: function() {
	  	return {
	  		name: this.props.name || "",
	  		categoryText: this.props.categoryText || "",
	  		computeFunctionString: this.props.computeFunctionString || "// Metrics('/Category/Metric name')\n// Records('/Category path/goes here/').get()\n\
// the return value is your output\n",
			
			newMetric: this.props.newMetric && true
	  	};
	  },

	getInitialState: function() {
		var state = {
			resetKey: (+new Date()), // oh I'm naughty

			newMetric: this.props.newMetric,
			runtimeError: null,

	    	name: this.props.name,
	    	categoryText: this.props.categoryText,
	    	computeFunctionString: this.props.computeFunctionString,
	    	computeFunctionValid: true
	    };
	    return state;
	},

	 clearForm: function() {
	 	this.replaceState(this.getInitialState());
	 },

	changeCategory: function(category) {
		this.setState({ categoryText: category });
	},

	componentWillReceiveProps: function(nextProps){
		var state = {
			name: nextProps.name,
	    	categoryText: nextProps.categoryText,
	    	computeFunctionString: nextProps.computeFunctionString
		};
		this.setState(state);
		console.log('ello');
	},

	 submitForm: function() {
	 	var self = this;
	 	self.setState({ runtimeError: null });
	 	Meteor.call('upsertMetric', this.state.name, this.state.categoryText, this.state.computeFunctionString, function (error, result) {
	 		if(error) {
	 			self.setState({ runtimeError: error });
	 		}
	 		else self.clearForm(); // don't clear until server is good
	 	});
	 },

	render: function() {
		var noValidationErrors = 
				this.state.computeFunctionValid
			&&	this.state.name != ""
			&&	this.state.categoryText != "";

		// if(this.state.metricError) {
		// 	var errorbox = (<div className="ui inline nag">
		// 		  <span className="title">
		// 		  	{this.state.metricError}
		// 		  </span>
		// 		</div>);
		// }

		var runtimeError;
		if(this.state.runtimeError != null) {
			runtimeError = <div className="ui negative message">
			  <Icon n="close icon"/>
			  <div className="header">
			    {this.state.runtimeError.reason}
			  </div>
			  <pre>{this.state.runtimeError.details}</pre>
			</div>;
		} 

		return (
			<div key={this.state.resetKey} className="niceish-padding">
				<div className="ui segment">
			      
			     <h1 style={{ display: 'inline-block' }}>{this.state.newMetric ? 'Add' : 'Edit'} Metric</h1>
			      
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
						      <UI.CategorySearchInput category={this.state.categoryText} onSelect={this.changeCategory}/>
								
						    </div>
						</div>

					</form>
					
	  			</div>

	  			<div className="ui segment">
		  			<h2 className="ui dividing header"><Icon n="code"/><div className="content">Compute function</div></h2>
		  			<a href="https://github.com/liamzebedee/metric/wiki/Writing-a-metric" target="_blank"><Icon n="info circle"/> Docs</a>

					{runtimeError}


					<UI.JSEditor code={this.state.computeFunctionString} 
						    	 onValidation={this.onEditorValidation}/>
				</div>
	  		</div>
		);
	}
});


});