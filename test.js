
var request = require('request');
var cheerio = require('cheerio');
var moment = require('moment');
var iconv = require('iconv-lite'); // 用來轉碼
moment.locale("zh-tw");
var async = require('async');
var mongodb = require('mongodb');

var mongodbServer = new mongodb.Server('localhost', 27017, {
    auto_reconnect: true,
    poolSize: 10
});
var db = new mongodb.Db('FAKE', mongodbServer);

var p_url = "http://www.mobile01.com/topicdetail.php?f=566&t=4779462";
var options = {
    url: p_url,
    headers: {   
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.112 Safari/537.36',
    }
};
console.log(p_url);
request(options, function(error, response, body) {
    // console.log(error);
    if (error) return console.log(error)

        $ = cheerio.load(body);
        var news = [];


        $('.single-post').each(function(i, elem) {
            var author = $(elem).find('.fn').text()
            console.log("留言者：" +author)

            
        });

});
