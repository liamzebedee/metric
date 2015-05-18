// Main UI
Meteor.startup(function(){

Link = ReactRouter.Link;

Icon = ReactMeteor.createClass({
	render: function() {
		return <i className={"icon "+this.props.n}></i>;
	}
});

Breadcrumb = ReactMeteor.createClass({
	onItemClick: function(i){
		this.props.onItemClick(this.props.items, i);
	},
	render: function() {
		var stuff = [];
		var self = this;
		this.props.items.forEach(function(item, i){
			var lastItem = (i == self.props.items.length - 1);
			stuff.push(<div key={item} onClick={self.onItemClick.bind(self, i)} className={Util.classNames("section", { muted: !lastItem, active: lastItem })}>{item}</div>);				
			if(!lastItem) stuff.push(<i key={i} className="right chevron icon divider"></i>);
		});
		
		return (
			<div className="ui breadcrumb">
				{stuff}
			</div>
		);
	}
});

UI.Menu = ReactMeteor.createClass({
	mixins: [ReactRouter.Navigation],

	navigateToDash: function(){
		this.transitionTo('dashboard');
	},

	render: function() {
		return (
			 <nav className="ui primary inverted menu">
			  <div onClick={this.navigateToDash} className="title item">
			        <h1>{"{metric}"}</h1>
			   </div>

			  <Link to="dashboard" className="item">
				<i className="home icon"></i> Dashboard
			  </Link>
			  <Link to="add-metric" className="item">
				<i className="plus icon"></i> Add metric
			  </Link>
			  <Link to="add-record" className="item">
				<i className="plus icon"></i> Add record
			  </Link>


			   <div className="item">
			      <div className="ui icon input">
			        <input type="text" placeholder="Search..." style={{ width: '30em' }}/>
			        <i className="search link icon"></i>
			      </div>
			    </div>
			  
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

UI.Row = ReactMeteor.createClass({
	render: function() {
		var cn = "ui row " + Util.classNames({'hide': this.props.hidden});

		return (
			<div className={cn}>
				{this.props.children}
			</div>
		);
	}
});

UI.Columns = ReactMeteor.createClass({
	render: function() {
		var cn = "columns " + Util.classNames({'hide': this.props.hidden});

		return (
			<div className={cn}>
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

  // <tfoot className="full-width">
  //   <tr>
  //     <th></th>
  //     <th colSpan="4">
//      		<button className="ui positive button"><i className="add circle icon"></i>Add new</button>
  //     </th>
  //   </tr>
  // </tfoot>

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
		    <div className='code-editor-left'></div>
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


});

// A bit of inspiration for this project has come from Douglas Adams' "Dirk Gently's Holistic Detective Agency", from a particular section of the novel where Richard MacDuff is discussing a program he created back in the 80s, which is a sort of spreadsheeting application that turns numerical data into music. Aside from the obvious facetiousness which follows the rest of the novel, this particular idea (which hasn't been executed to my knowledge) posseses a certain childlike naivety to it - "why not? we can see data, we can touch it, why can't we hear it".
// And so, why not?