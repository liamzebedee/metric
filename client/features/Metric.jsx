Meteor.startup(function(){

UI = ReactMeteor.createClass({
	render: function() {
		return (<div> </div>);
	}
});

UI.Metric = ReactMeteor.createClass({
	getDefaultProps: function() {
		return {
			computeResult: 42,
			categoryPath: ['Path', 'to', 'Category'],
			name: "Metric name",
			_id: 42
		};
	},

	getInitialState: function(){
		return { showControls: false };
	},

	onMouseOver: function(){
		this.setState({showControls: true});
	},

	onMouseOut: function(){		
		this.setState({showControls: false});
	},

	render: function() {
		var pathAsString = this.props.categoryPath.join('/');

		var resultView;
		var resultIsText = false;
		var result = this.props.computeResult;
		switch(Util.getObjectType(result)) {
			case 'string':
				resultIsText = true;
				resultView = result;
				break;
			
			case 'number':
				var isPercentage = result.between(0, 1, true);
				resultView = isPercentage ?
							(result*100).toFixed(1)+'%' :
							result;
				break;
			
			case 'boolean':
				if(result) {
					resultView = <Icon n="green checkmark"/>;
				} else {
					resultView = <Icon n="red remove"/>;
				}
				break;
			
			case 'Date':
				resultView = result.long(); // e.g. July 22, 2012 1:55pm
				break;
			
			case null:
				resultView = <Icon n="ellipsis horizontal"/>;
				break;

			default:
				resultView = result.toString();
		}

		// if(this.state.showControls) {
		// 	var controls = <div className="controls ui basic icon buttons">
		//   			<div className="ui icon button"><Icon n="edit"/></div>
		//   		</div>;
		// }

		var self = this;

		return (
		  <div className="metric statistic" onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut}>
			    <h3 className="center">
			    	<Link to="metric-overview" params={{ id: self.props._id }}><strong>{this.props.name}</strong></Link>
			    </h3>
			    <div className={Util.classNames('value')}>
			    	{resultView}
			    </div>
		  </div>
		);
	}
});




});