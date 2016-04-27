
module.exports = {
	fbdb:{
		db_uri: "mongodb://127.0.0.1:27017/fb",
		db_options: {
			db: { native_parser: true },
			server: { poolSize: 5 }
		},
	},
	etdb:{
		db_uri: "mongodb://192.168.48.111:27017/et",
		db_options: {
			db: { native_parser: true },
			server: { poolSize: 5 }
		},
	},
	facebook: {
		clientID: "{{PLACEHOLDER}}", 
		clientSecret: "{{PLACEHOLDER}}",
		callbackURL: "{{PLACEHOLDER}}"
	},
	google: {
		clientID: "{{PLACEHOLDER}}",
		clientSecret: "{{PLACEHOLDER}}",
		callbackURL: "{{PLACEHOLDER}}"
	},
	
};
