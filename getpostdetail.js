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



/*
data [ { href: 'http://www.mobile01.com/topicdetail.php?f=566&t=4781970' },
  { href: 'http://www.mobile01.com/topicdetail.php?f=566&t=4804214' },......]

data[0]  { href: 'http://www.mobile01.com/topicdetail.php?f=566&t=4781970' }
*/

open_db_function(
    'TopicList',
    function(collection, err) {
        collection.find({}, { href: 1, _id: 0 }).toArray(function(err, data) {
            if (data) {
                //element = data[0]可執行;element = data有error
                // element = data;
                var i = 0;
                var forpostdetail = function() {
                    if (i < data.length) {
                        element = data[i];
                        getAPageAllPost(element, 1, true).then(function(last_page) {
                            console.log('last_page', last_page);
                            if (last_page) {
                                for (var i = 2; i <= last_page; i++) {
                                    var page = 1;
                                    setTimeout(function() {
                                            page++;
                                            console.log('now_page:' + page);
                                            return getAPageAllPost(element, page, false);
                                        },
                                        i * 2000);
                                }
                            } else {
                                console.log('stop');
                                return false;
                            }
                        });
                        i = i + 1;
                        console.log("第" + i + "個href");
                    } else {
                        clearInterval(forpostdetail);
                    }
                }
                setInterval(forpostdetail, 10000);
                if (i >= data.length) {
                    console.log("out, i >= data.length");
                    clearInterval(forpostdetail);
                }
            } else {
                throw new Error(err);
            }
        })
    }
);

var getAPageAllPost = function(element, page, to_continue) {
    if (page) {
        var this_href = element.href + '&p=' + page;
        // console.log("log1:" + element.href + '&p=' + page);
        console.log("現在URL為:" + this_href);
    } else {
        var this_href = element.href;
        console.log("log2:" + element.href);
    }
    return axios.post(this_href, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.112 Safari/537.36',
            },
            timeout: 3000,
        })
        .then(function(response) {
            $ = cheerio.load(response.data);
            var last_page = $('.pagination').find('a').last().attr('href').replace(/.*p=/g, "");
            //last_page為分頁最後值
            db.collection('post_detail', function(err, collection) {
                $('.single-post').each(function(i, elem) {
                    var singlepost = {
                        Reply_user: $(elem).find('.fn').text(),
                        Reply_time: $(elem).find('.date').text(),
                        Reply_content: $(elem).find('.single-post-content').text().replace(/\\r\\n|\\r|\\n|\s/g, "").replace(/.*:+.+(恕刪)./g, "")
                    }
                    console.log("===============");
                    console.log(singlepost);
                    collection.insert(singlepost, function(err, data) {
                        if (data) {
                            // console.log('Successfully Insert');
                        } else {
                            console.log('Failed to Insert');
                        }
                    }); // save to db
                });
            });
            // console.log('last_page_in', last_page);
            // console.log('to_continue', to_continue);
            if (to_continue && last_page) {
                return Promise.resolve(last_page);
            } else {
                console.log('no other pages');
                return Promise.resolve(false);
            }
        })
        .catch(function(err) { console.log("error:" + err); })
};