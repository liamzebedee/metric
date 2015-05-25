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

		it("should be created successfully", function(){
			var metric_id = Meteor.call(
				"upsertMetric", 
				basicMetricData.name, 
				basicMetricData.fullCategoryPathString, 
				basicMetricData.computeFunction
			);
		});

		it("should throw a syntax error", function(){
			var fn = function() { Meteor.call(
				"upsertMetric", 
				basicMetricData.name, 
				basicMetricData.fullCategoryPathString, 
				"a = 1; /syntax error"
			); }
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
