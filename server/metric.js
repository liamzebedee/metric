/*
 * @jsx React.DOM
 */
'use strict';

/*

	Metrics = {
		Hierachy: {
			Category1: {
				Category2: {
					"@metrics": [{
						_id: 123213,
						_timestamp: 21321321312,
						name: "",
						computeResult: {
							timestamp: 1231232131,
							value: X
						},
						compute: function(){}
					}]
				}
			}
		}
	}

*/
var Metrics = new Mongo.Collection("metrics");

/*

	Records = {
		Hierachy: {
			Category1: {
				Category2: {
					@records: [{
						@id: 1231231,
						@timestamp: 12321321412,
						...data...
					}]
				}
			}
		}
	}

*/
var Records = new Mongo.Collection("records");

// use JS AST to analyse Metric.compute, and analyse dependencies between variables to create a better update algorithm
// metric.compute(Metrics.copy, Records.copy) foreach metric
// memoization for caching computations
// TODO implement a view syntax

// http://estools.github.io/esquery/
// http://esprima.org/doc/index.html
// http://pegjs.org/

Meteor.startup(function () {
});