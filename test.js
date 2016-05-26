var request = require('request');
var cheerio = require('cheerio');
var moment = require('moment');
var iconv = require('iconv-lite'); // 用來轉碼
moment.locale("zh-tw");
var async = require('async');
var mongodb = require('mongodb');
var Promise = require('es6-promise').Promise;
var Promise = require('promise');
var axios = require('axios');

var mongodbServer = new mongodb.Server('localhost', 27017, {
    auto_reconnect: true,
    poolSize: 10
});
var db = new mongodb.Db('FAKE', mongodbServer);

var open_db_function = function(table, func_in) {

    db.open(function() {
        db.collection(table, function(err, collection) {
            func_in(collection, err);
        });
    });
};


var getAPage = function(page) {
    return axios.post('http://www.mobile01.com/topicdetail.php?f=566&t=4781970&p=' + page, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.112 Safari/537.36',
            },
            timeout: 2000,
        })
        .then(function(response) {
        // .then(function() {

            $ = cheerio.load(response.data);

            // var last_page = $('.pagination').find('a').last().attr('href').replace(/.*p=/g, "");
            // var last_page = 3;

            //last_page為分頁最後值
            $('.single-post').each(function(i, elem) {
                var singlepost = {
                    Reply_user: $(elem).find('.fn').text(),
                    Reply_time: $(elem).find('.date').text(),
                    Reply_content: $(elem).find('.single-post-content').text().replace(/\\r\\n|\\r|\\n|\s/g, "").replace(/.*:+.+(恕刪)./g, "")
                }
                console.log("===============");
                console.log(singlepost);
                // save to db
            });
            // return Promise.resolve(last_page)
        })
}


getAPage().then(function() {
    for (var i = 2; i <= 3; i++) {
        var page = 1;
        setTimeout(function() {
            console.log('getAPage：' + page)
            page++;
            return getAPage(page)
        }, i * 2000)
    };
})