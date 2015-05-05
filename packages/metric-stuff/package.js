Package.describe({
  summary: "What this does",
  version: "0.0.1"
});

Npm.depends({
 "esprima": "2.2.0",
 "escodegen": "1.6.1",
 "esprima-walk": "0.1.0"
});

Package.on_use(function (api) {
  api.add_files("stuff.js", ["client", "server"]);
  api.export('ComputeFunctionAnalyser');
});