//var route = require('../modules/test');

module.exports = function(app) {
	
	app.post("/do_sayhi", function(req, res) {
//		console.log(req.body);
		route.sayHi(req.body,function(err, doc){
			if(err)  throw err;
			console.log(doc);
			return res.json(200, {
				message : "ok",
				data : doc
			});
		});
	});
	
	
};