{metric}
========

Not yet functional - [Progress through Tumblr screenshots](http://liamz.tumblr.com/tagged/metric)

!["Dashboard" Screenshot as of 26/05/2015](https://41.media.tumblr.com/3e2f50eaf28999fbe9b7e116e2ab4c89/tumblr_noy93v35L11trskuwo2_1280.png)
!["Add Record" Screenshot as of 17/05/2015](https://40.media.tumblr.com/a93b26f29eeac4e596c3b51775a1a61c/tumblr_nog6cpNW5H1trskuwo2_1280.png)
!["Add Metric" Screenshot as of 17/05/2015](https://40.media.tumblr.com/002a9dffaf2285b7a40668d85ae19af8/tumblr_nog6cpNW5H1trskuwo1_1280.png)

What is **{metric}** (or more correctly, what am I building it to become):
 - An app I'm using to keep track of different metrics for self-improvement in a relational manner (Health tracking is dependent on metrics relating to my Diabetes, exercise, eating habits, Happiness is related to my self-actualization, social belonging, etc.)
 - A modern take on what spreadsheets are supposed to do - take data and compute things. We use Web tech, JavaScript and libraries instead of MACROS and plugins. We use objects categorised and stored in databases rather than tables (2D arrays) to represent data.
 - An experiment, and my new life's work.

Key points:
 - unlike Excel, we don't do tables
 - we do smart dashboards!
 - we do metrics and records
 - metrics are dynamically computed functions written in JavaScript, a record is just a JSON object
 - it's all built with web tech, it's real-time using Meteor and React
 - as a result of its client-server architecture, it can be hosted and accessed from multiple clients, and the metric computation thread is separated from the UI
 - unlike Excel, we also can handle and do natural arithmetic on dates and hours/mins/seconds

## Install
 1. Install [Meteor](https://www.meteor.com/)
 2. Clone the project
 3. Run `meteor` and open [localhost:8000](http://localhost:8000)

Later when functional I'll bundle it up as an single-file app.

## License
Copyright Liam Edwards-Playne 2015. Licensed under [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License](http://creativecommons.org/licenses/by-nc-sa/4.0/), which means you **can't use it for commercial purposes** without my written permission.


## Development practices
I admit this project does not adhere to several development practices -- the reason for this is that I am trying to develop it as quickly as possible and since I don't envision anyone else maintaining this, there's no point going the extra 20% until later. Nonetheless, I've commented all areas where things could definitely be improved.

## Ideas
While developing any project, I always have too many ideas and never end up building it. So in the spirit of MVP, here's a dream list of features:
 - hotkey nav for menu
 - markdown rendering for text inputs in records, and a basic editor too
 - data visualisation using d3/graph.js
 - editable HTML React-based view for metrics
 - install NPM packages
 - natural language search interface
 - reactive visualisation of metric inputs à la LightTable
 - SQL query interface for record overview
 - integration/stealing design from [Jupyter](http://jupyter.org), [Personal API hacks](https://news.ycombinator.com/item?id=5799706)
 - metrics retrieving data from external services (Fitbit)
 - import/export data to CSV based on the category schema
 - replacing the text-based code-editor with a visual frontend, using sliders, controls, live visual update of react component view

## Thanks
This uses these projects:
 - [Meteor](http://meteor.com)
 - [React.js](http://facebook.github.io/react/), React-Router
 - [Semantic UI](http://semantic-ui.com)
 - [classNames](https://github.com/JedWatson/classnames) by @JedWatson
 - [javascript-editor](https://github.com/maxogden/javascript-editor) by @maxogden, and subsequently Esprima and CodeMirror
 - [sugar.js](http://sugarjs.com/) - date parsing and such
 - [ReactGridLayout](https://github.com/STRML/react-grid-layout) by @STRML - dashboard <3