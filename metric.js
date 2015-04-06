if (Meteor.isClient) {
  Template.hello.events({
    'click #add': function () {
      
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
