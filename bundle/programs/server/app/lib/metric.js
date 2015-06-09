(function(){ 
// Category = {
// 	path: ["Top Level Cat", "Second Level Cat"],
// 	schema: [
// 		{ fieldName: "field name/label", value: "default value" },
// 		{ fieldName: "field name/label", value: "default value" },
// 		{ fieldName: "field name/label", value: "default value" },
// 	]
// }
Categories = new Mongo.Collection("categories");

Categories.parsePathIntoArray = function(path) {
	return path.split('/').filter(function(e){if(e !== "") return true});
};
Categories.setSchema = function(categoryPath, schema) {
	Categories.update({
		_id: Categories.findOrCreateByCategoryPath(categoryPath)
	}, {
		$set: {
			schema: schema
		}
	});
};
Categories.findCategoryByPath = function(categoryPath) {
	var category = Categories.findOne({
		path: Categories.parsePathIntoArray(categoryPath)
	});
	if(category == null) throw new Error("Category doesn't exist @ "+categoryPath);
	return category;
};
Categories.findOrCreateByCategoryPath = function(categoryPath, schema) {
	categoryPath = categoryPath.split('/').filter(function(e){if(e !== "") return true});
	schema = schema || [];

	var category = Categories.findOne({
		path: categoryPath
	});
	var categoryId;
	// stupid Meteor docs, it actually returns undefined, not null
	if(category == null) {
		categoryId = Categories.insert({
			path: categoryPath,
			schema: schema
		});
	} else {
		categoryId = category._id;
	}

	return categoryId;
};

// Metric = { name: "Foo", compute: "doSomething();var i = 2;andAnother(i);", computeResult: 1, categoryId: "..." }
Metrics = new Mongo.Collection("metrics");

Metrics.findMetricByPath = function(categoryAndMetricPath) {
	var categoryPath = categoryAndMetricPath.split('/').filter(function(e){if(e !== "") return true});
	var metricName = categoryPath.pop(); // kill two birds with one stone

	var metric = Metrics.findOne({
		categoryId: Categories.findOne({ path: categoryPath })._id,
		name: metricName
	});
	if(metric == null) throw new Error("Metric doesn't exist @ "+categoryAndMetricPath);
	return metric;
};

// Record = { timestamp: 12312321, category: "...", fields: {} }
Records = new Mongo.Collection("records");

Records.addRecord = function(categoryPath, timestamp, fields) {
	var record = {
		timestamp: timestamp || +new Date(),
		categoryId: Categories.findOrCreateByCategoryPath(categoryPath),
		fields: fields
	};
	Records.insert(record, function(err,id){ if(err) throw new Error("Error while inserting category: "+err.toString()); });
};

})();
