{metric}
========

[Progress through Tumblr screenshots](http://liamz.tumblr.com/tagged/metric)

![Screenshot as of 12/04/2015](http://40.media.tumblr.com/2da3fff026cd7b570e1c3f463390a932/tumblr_nmp1s2upRV1trskuwo1_1280.png)

An **in-progress** alternative to Excel I'm building to keep track of different metrics for self-improvement. Could probably be used for other things too. 

Key points:
 - unlike Excel, we don't do tables
 - we do metrics and records
 - metrics are dynamically computed, a record is just a JSON object
 - it's all built with web tech, it's real-time using Meteor and React

## Install
 1. Install [Meteor](https://www.meteor.com/)
 2. Clone the project
 3. Run `meteor` and open [localhost:8000](http://localhost:8000)

## License
Let's call it GPLv3 for now...

## Development practices
I admit this project does not adhere to several development practices -- the reason for this is that I am trying to develop it as quickly as possible and don't have time for dealing with the inadequacies of the Meteor packaging system, among other things.

## Thanks
This uses these projects:
 - Meteor
 - React.js
 - classNames
 - [javascript-editor](https://github.com/maxogden/javascript-editor), and subsequently Esprima and CodeMirror