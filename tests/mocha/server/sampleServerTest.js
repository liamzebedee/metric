if(typeof MochaWeb === 'undefined') return;

// note that .to.throw is using strings for the error names, as the custom Meteor.Error class doesn't reveal the error type
MochaWeb.testOnly(function(){
	describe("Metric", function(){
		this.timeout(15000);

		var basicMetricData = {
			name: 'Test metric 1',
			fullCategoryPathString: 'Tests/Subcategory/Place',
			computeFunction: "a = 1; a++; metric.value = a;"
		};

		it("should be created successfully", function(done){
			var fn = function(){ Meteor.call(
				"upsertMetric", 
				basicMetricData.name, 
				basicMetricData.fullCategoryPathString, 
				basicMetricData.computeFunction,
				function(error, result){
					try {
						chai.expect(error).to.not.exist;

						var metric = Metrics.find(metric_id);
						throw new Error(JSON.stringify(metric));
						chai.expect(metric).to.exist;
						var category = Categories.find(metric.categoryId);
						chai.expect(category).to.exist;
						chai.expect(category.path).to.be(basicMetricData.fullCategoryPathString.split('/'));
						chai.expect(metric.name).to.be(basicMetricData.name);
						chai.expect(metric.computeFunction).to.be(basicMetricData.computeFunction);
					} catch(ex) {throw ex} finally { done(); }
				}
			); }
			chai.expect(fn).to.not.throw(Error);
		});

		it("should throw a syntax error", function(){
			var fn = function() { Meteor.call(
				"upsertMetric", 
				basicMetricData.name, 
				basicMetricData.fullCategoryPathString, 
				"a = 1; /syntax error"
			); done(); }
			chai.expect(fn).to.throw('[parsing-error]');
		});

		it("should throw a runtime error and not be saved to the DB", function(){
			var fn = function() { Meteor.call(
				"upsertMetric", 
				basicMetricData.name, 
				basicMetricData.fullCategoryPathString, 
				"a = 1; undefinedFunction(); runtimeErrorsForMe();"
			); }
			chai.expect(fn).to.throw('[runtime-error]');
		});

		it("should trigger a recompute of its dependencies", function(){
			// Meteor.call(
			// 	"upsertMetric", 
			// 	basicMetricData.name, 
			// 	basicMetricData.fullCategoryPathString, 
			// 	"var dep = Metrics.find('/some/metric'); var dep2 = Records.find('/some/category');"
			// );

		});


	});
});