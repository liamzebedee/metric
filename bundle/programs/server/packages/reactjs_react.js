(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var Inject = Package['meteorhacks:inject-initial'].Inject;

/* Package-scope variables */
var React, ReactMeteor;

(function () {

///////////////////////////////////////////////////////////////////////////////
//                                                                           //
// packages/reactjs:react/src/inject-react.js                                //
//                                                                           //
///////////////////////////////////////////////////////////////////////////////
                                                                             //
var path = Npm.require("path");                                              // 1
var url = Npm.require("url");                                                // 2
                                                                             // 3
var src = path.join(                                                         // 4
  url.parse(process.env.ROOT_URL).path,                                      // 5
  "packages",                                                                // 6
  "reactjs_react",                                                           // 7
  "vendor",                                                                  // 8
  process.env.NODE_ENV === "production"                                      // 9
    ? "react-with-addons-0.13.0.min.js"                                      // 10
    : "react-with-addons-0.13.0.js"                                          // 11
);                                                                           // 12
                                                                             // 13
if (path.sep !== "/") {                                                      // 14
  // On Windows, path.sep === "\\", so we must convert to /.                 // 15
  src = src.split(path.sep).join("/");                                       // 16
}                                                                            // 17
                                                                             // 18
Inject.rawHead('react', '<script src="' + src + '"></script>');              // 19
                                                                             // 20
///////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////
//                                                                           //
// packages/reactjs:react/src/require-react.js                               //
//                                                                           //
///////////////////////////////////////////////////////////////////////////////
                                                                             //
React = Npm.require("react/addons");                                         // 1
                                                                             // 2
///////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////
//                                                                           //
// packages/reactjs:react/src/ReactMeteor.js                                 //
//                                                                           //
///////////////////////////////////////////////////////////////////////////////
                                                                             //
var ReactMeteorMixin = {                                                     // 1
  componentWillMount: function() {                                           // 2
    var self = this;                                                         // 3
                                                                             // 4
    self._meteorStateDep = new Tracker.Dependency();                         // 5
    self._meteorFirstRun = true;                                             // 6
                                                                             // 7
    if (Meteor.isClient) {                                                   // 8
      Tracker.autorun(function(computation) {                                // 9
        self._meteorComputation = computation;                               // 10
        self._meteorStateDep.depend();                                       // 11
                                                                             // 12
        if (self.startMeteorSubscriptions) {                                 // 13
          // Calling this method in a Tracker.autorun callback will ensure   // 14
          // that the subscriptions are canceled when the computation stops. // 15
          self.startMeteorSubscriptions();                                   // 16
        }                                                                    // 17
                                                                             // 18
        enqueueMeteorStateUpdate(self);                                      // 19
      });                                                                    // 20
                                                                             // 21
    } else {                                                                 // 22
      enqueueMeteorStateUpdate(self);                                        // 23
    }                                                                        // 24
  },                                                                         // 25
                                                                             // 26
  componentWillUpdate: function(nextProps, nextState) {                      // 27
    if (this._meteorCalledSetState) {                                        // 28
      // If this component update was triggered by the ReactMeteor.Mixin,    // 29
      // then we do not want to trigger the change event again, because      // 30
      // that would lead to an infinite update loop.                         // 31
      this._meteorCalledSetState = false;                                    // 32
      return;                                                                // 33
    }                                                                        // 34
                                                                             // 35
    if (this._meteorStateDep) {                                              // 36
      this._meteorStateDep.changed();                                        // 37
    }                                                                        // 38
  },                                                                         // 39
                                                                             // 40
  componentWillUnmount: function() {                                         // 41
    if (this._meteorComputation) {                                           // 42
      this._meteorComputation.stop();                                        // 43
      this._meteorComputation = null;                                        // 44
    }                                                                        // 45
  }                                                                          // 46
};                                                                           // 47
                                                                             // 48
function enqueueMeteorStateUpdate(component) {                               // 49
  var partialState =                                                         // 50
    component.getMeteorState &&                                              // 51
    component.getMeteorState();                                              // 52
                                                                             // 53
  if (! partialState) {                                                      // 54
    // The getMeteorState method can return a falsy value to avoid           // 55
    // triggering a state update.                                            // 56
    return;                                                                  // 57
  }                                                                          // 58
                                                                             // 59
  if (component._meteorFirstRun) {                                           // 60
    // If it's the first time we've called enqueueMeteorStateUpdate since    // 61
    // the component was mounted, set the state synchronously.               // 62
    component._meteorFirstRun = false;                                       // 63
    component._meteorCalledSetState = true;                                  // 64
    component.setState(partialState);                                        // 65
    return;                                                                  // 66
  }                                                                          // 67
                                                                             // 68
  Tracker.afterFlush(function() {                                            // 69
    component._meteorCalledSetState = true;                                  // 70
    component.setState(partialState);                                        // 71
  });                                                                        // 72
}                                                                            // 73
                                                                             // 74
// Like React.render, but it replaces targetNode, and works even if          // 75
// targetNode.parentNode has children other than targetNode.                 // 76
function renderInPlaceOfNode(reactElement, targetNode) {                     // 77
  var container = targetNode.parentNode;                                     // 78
  var prevSibs = [];                                                         // 79
  var nextSibs = [];                                                         // 80
  var sibs = prevSibs;                                                       // 81
  var child = container.firstChild;                                          // 82
                                                                             // 83
  while (child) {                                                            // 84
    if (child === targetNode) {                                              // 85
      sibs = nextSibs;                                                       // 86
    } else {                                                                 // 87
      sibs.push(child);                                                      // 88
    }                                                                        // 89
    var next = child.nextSibling;                                            // 90
    container.removeChild(child);                                            // 91
    child = next;                                                            // 92
  }                                                                          // 93
                                                                             // 94
  var result = React.render(reactElement, container);                        // 95
  var rendered = container.firstChild;                                       // 96
                                                                             // 97
  if (prevSibs.length > 0) {                                                 // 98
    prevSibs.forEach(function(sib) {                                         // 99
      container.insertBefore(sib, rendered);                                 // 100
    });                                                                      // 101
  }                                                                          // 102
                                                                             // 103
  if (nextSibs.length > 0) {                                                 // 104
    nextSibs.forEach(function(sib) {                                         // 105
      container.appendChild(sib);                                            // 106
    });                                                                      // 107
  }                                                                          // 108
                                                                             // 109
  return result;                                                             // 110
}                                                                            // 111
                                                                             // 112
ReactMeteor = {                                                              // 113
  Mixin: ReactMeteorMixin,                                                   // 114
                                                                             // 115
  // So you don't have to mix in ReactMeteor.Mixin explicitly.               // 116
  createClass: function createClass(spec) {                                  // 117
    spec.mixins = spec.mixins || [];                                         // 118
    spec.mixins.push(ReactMeteorMixin);                                      // 119
    var Cls = React.createClass(spec);                                       // 120
                                                                             // 121
    if (Meteor.isClient &&                                                   // 122
        typeof Template === "function" &&                                    // 123
        typeof spec.templateName === "string") {                             // 124
      var template = new Template(                                           // 125
        spec.templateName,                                                   // 126
        function() {                                                         // 127
          // A placeholder HTML element that will serve as the mounting      // 128
          // point for the React component. May have siblings!               // 129
          return new HTML.SPAN;                                              // 130
        }                                                                    // 131
      );                                                                     // 132
                                                                             // 133
      template.onRendered(function() {                                       // 134
        renderInPlaceOfNode(                                                 // 135
          // Equivalent to <Cls {...this.data} />:                           // 136
          React.createElement(Cls, this.data || {}),                         // 137
          this.find("span")                                                  // 138
        );                                                                   // 139
      });                                                                    // 140
                                                                             // 141
      Template[spec.templateName] = template;                                // 142
    }                                                                        // 143
                                                                             // 144
    return Cls;                                                              // 145
  }                                                                          // 146
};                                                                           // 147
                                                                             // 148
///////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['reactjs:react'] = {
  React: React,
  ReactMeteor: ReactMeteor
};

})();

//# sourceMappingURL=reactjs_react.js.map
