TODO before v1.0.0
==================

**Get this sorted** so I can start using it in daily life for goals and tracking.

## Add record
 - successfully add record into DB
 - show records in table

## Add metric
 - successfully add metric into DB
 - have metric automatically computed when added
 - show result on show metric page
 - have the metric result reactively update (make the cursor a reactive data source) - e.g. https://scotch.io/tutorials/build-a-real-time-twitter-stream-with-node-and-react-js with componentDidMount

## Add Metric
 - add a pubsub events system
 - parse the compute function code to determine dependencies on different metrics and records (categories)
 - metric.subscriptions. e.g. `sub.metrics#123123213, sub.records#/category/goes/here`. 
 - then a metric subscribes to changes and recomputes when they happen. 
 - implement basic "hello world" average test case using DSL as so: `return average(Metrics.get('/Health/DiabetesMetric'), Metrics.get('/Health/Body/ExerciseMetric'));`

## Home
 - show a nice pretty dashboard with metrics and records shown (http://liamz.tumblr.com/image/116297049576)
 - implement natural language search menu on header


"Beta"
======

 - import/export data
 - graphing and visualisation
 - move to nodejs w/ socket.io
