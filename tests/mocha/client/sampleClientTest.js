if(typeof MochaWeb === 'undefined') return;
MochaWeb.testOnly(function(){
	describe("Client initialization", function(){
		it("should have a Meteor version defined", function(){
			chai.assert(Meteor.release);
		});
	});
});