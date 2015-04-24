{metric}
========

Not yet functional - [Progress through Tumblr screenshots](http://liamz.tumblr.com/tagged/metric)

![Screenshot as of 17/04/2015](http://41.media.tumblr.com/79cefed2f19659c8aa0f96c52f6c600f/tumblr_nmwmey0Nft1trskuwo1_1280.png)

What is **{metric}** (or more correctly, what am I building it to become):
 - An app I'm using to keep track of different metrics for self-improvement in a relational manner (Health tracking is dependent on metrics relating to my Diabetes, exercise, eating habits, Happiness is related to my self-actualization, social belonging, etc.)
 - A modern take on what spreadsheets are supposed to do - take data and compute things. We use Web tech, JavaScript and libraries instead of MACROS and plugins. We use objects categorised and stored in databases rather than tables (2D arrays) to represent data.
 - An experiment, and my new life's work.

Key points:
 - unlike Excel, we don't do tables
 - we do metrics and records
 - metrics are dynamically computed functions written in JavaScript, a record is just a JSON object
 - it's all built with web tech, it's real-time using Meteor and React
 - as a result of its client-server architecture, it can be hosted and accessed from multiple clients, and the metric computation thread is separated from the UI

## Install
 1. Install [Meteor](https://www.meteor.com/)
 2. Clone the project
 3. Run `meteor` and open [localhost:8000](http://localhost:8000)

Later when functional I'll bundle it up as an single-file app.

## License
Copyright Liam Edwards-Playne 2015. Licensed under [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License](http://creativecommons.org/licenses/by-nc-sa/4.0/), which means you **can't use it for commercial purposes** without my written permission.

## Development practices
I admit this project does not adhere to several development practices -- the reason for this is that I am trying to develop it as quickly as possible and don't have time for dealing with the inadequacies of the Meteor packaging system, among (many) other things.

## Ideas
While developing any project, I always have too many ideas and never end up building it. So in the spirit of MVP, here's a dream list of features:
 - hotkey nav for menu
 - data visualisation using d3/graph.js
 - editable HTML React-based view for metrics
 - install NPM packages
 - natural language search interface
 - reactive visualisation of metric inputs à la LightTable
 - rewritten as a Node app so we can use NPM (fucking Meteor package management eugh)

## Thanks
This uses these projects:
 - Meteor
 - React.js
 - classNames
 - [javascript-editor](https://github.com/maxogden/javascript-editor), and subsequently Esprima and CodeMirror