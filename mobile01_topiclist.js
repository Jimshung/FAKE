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


var GetTopicList = function(page) {
    return axios.post('http://www.mobile01.com/topiclist.php?f=566&p=' + page, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.112 Safari/537.36',
            },
            timeout: 3000,
        })
        .then(function(response) {
            $ = cheerio.load(response.data);
            db.open(function() {

                //第一頁31個貼文，後續一頁30個貼文
                db.collection('mobile01_post', function(err, collection) {
                    $('tbody>tr').each(function(i, elem) {
                        var subject = {
                            desc: $(elem).find('.subject-text>a').text(),
                            href: "http://www.mobile01.com/" + $(elem).find('.subject-text a').attr('href'),
                            dt: $(elem).find('p').first().text(),
                            authur: $(elem).find('.authur a p').last().text()
                        }
                        console.log(subject);
                        collection.insert(subject, function(err, data) {
                            if (data) {
                                console.log('Successfully Insert');
                            } else {
                                console.log('Failed to Insert');
                            }
                        });
                    });
                });
                return Promise.resolve()
            });
        })
}

GetTopicList().then(function() {
    for (var i = 2; i <= 10; i++) {
        var page = 1;
        setTimeout(function() {
                console.log('GetTopicList_page：' + page)
                page++;
                return GetTopicList(page)
            }, i * 2000)
            // console.log('i=' + i)
    };
})


