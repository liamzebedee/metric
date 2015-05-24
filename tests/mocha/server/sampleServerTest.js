if(typeof MochaWeb === 'undefined') return;
MochaWeb.testOnly(function(){
	describe("Metric", function(){
		it("should be added successfully", function(){});
		it("should throw a syntax error", function(){});
		it("should throw a runtime error and not be saved to the DB", function(){});
		it("should trigger a recompute of its dependencies", function(){});
	});
});
