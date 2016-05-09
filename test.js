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


for (var page = 1; page <= 1; page++) {

    var p_url = "http://www.mobile01.com/topicdetail.php?f=566&t=4771973&p=" + page;
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

        var re = /(\\r\\n|\\r|\\n|\s)/gm;
        var str = $('.single-post').find('.single-post-content').text();
        //console.log("str:" + str);


        var result = str.replace(/\\r\\n|\\r|\\n|\s/g, "");
        // console.log("result:" + result);


        // var m;
        // while ((m = re.exec(str)) !== null) {
        //     if (m.index === re.lastIndex) {
        //         re.lastIndex++;
        //     }
        // }

        //用來串m0,m1        
        // var s;
        // for (var i = 0; i<=m.length; i++) {
        //     s = s + m[i];
        // }
        // // View your result using the m-variable.
        // // eg m[0] etc.

        //爬主題下的回文

        $('.single-post').each(function(i, elem) {

            var singlepost = {
                    Reply_user: $(elem).find('.fn').text(),
                    Reply_time: $(elem).find('.date').text(),
                    Reply_content: $(elem).find('.single-post-content').text().replace(/\\r\\n|\\r|\\n|\s/gm, "")
                }
                //http://stackoverflow.com/questions/28790458/how-to-remove-div-and-br-using-cheerio-js
                //https://api.jquery.com/jQuery.trim/

            //console.log("===============");
            console.log(singlepost);

            //console.log(elem[1]);
            // console.log(singlepost[Reply_content]);

        });
        //Reply_content.replace(/[\\r\\n]/g, "");

    });
} //for