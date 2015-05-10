Util = {
	timestamp: function() { return new Date().getTime(); }
};

Util.classNames = function() {
	var classes = '';
	var arg;

	for (var i = 0; i < arguments.length; i++) {
		arg = arguments[i];
		if (!arg) {
			continue;
		}

		if ('string' === typeof arg || 'number' === typeof arg) {
			classes += ' ' + arg;
		} else if (Object.prototype.toString.call(arg) === '[object Array]') {
			classes += ' ' + classNames.apply(null, arg);
		} else if ('object' === typeof arg) {
			for (var key in arg) {
				if (!arg.hasOwnProperty(key) || !arg[key]) {
					continue;
				}
				classes += ' ' + key;
			}
		}
	}
	return classes.substr(1);
};

// Why is this language so complex...
// http://stackoverflow.com/questions/1303646/check-whether-variable-is-number-or-string-in-javascript
Util.isNumber = function(obj) { return !isNaN(parseFloat(obj)) };

Util.getObjectType = function(obj) {
	var type = "";
	if(typeof obj === "object") {
		type = obj.constructor.name;
	} else {
		type = typeof obj;
	}
	return type;
};

Util.escapeRegExp = function(str) {
	return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
};

Util.clone = function(obj) {
	return JSON.parse( JSON.stringify(obj) );
};