
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path');
var fs      = require('fs');

var app = express();

var models_dir = __dirname + '/modules';

fs.readdirSync(models_dir).forEach(function (file) {
	if(file[0] === '.') return; 
	if(fs.statSync(models_dir+'/'+file).isDirectory()) {//如果是目錄		
	}else{
		require(models_dir+'/'+ file);
	}	
});


// all environments
app.set('node_ip', process.env.IP || "127.0.0.1");
app.set('port', process.env.PORT || 8080);
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//module.exports = function(app){	
	require('./routes/rtest.js')(app);
	require('./modules/et_parser.js')(app);
	//require('./modules/et_parser_news.js')(app);
//};



http.createServer(app).listen(app.get('port'),app.get('node_ip'), function () {
	  console.log("Express server listening on port " + app.get('node_ip') + ":" + app.get('port'));
});

