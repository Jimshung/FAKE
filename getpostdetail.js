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

open_db_function(
    'TopicList',
    function(collection, err) {
        collection.find({}, { href: 1, otherpages: 1, _id: 0 }).toArray(function(err, data) {
            if (data) {
                element = data;
                var i = 0;
                var Href_Request = function() {
                    if (i < data.length) {
                        element = data[i];
                        otherpages = data[i].otherpages;

                        getAPageAllPost(element, 1, true).then(function(otherpages) {

                            console.log('otherpages:', otherpages);
                            if (otherpages) {
                                for (var i = 2; i <= otherpages; i++) {
                                    console.log('123');
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
                        console.log("href:" + element.href);
                        console.log("otherpages:" + otherpages);
                    } else {
                        clearInterval(Href_Request);
                    }
                }
                setInterval(Href_Request, 8000);
                if (i >= data.length) {
                    console.log("out, i >= data.length");
                    clearInterval(Href_Request);
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
        console.log("now_crawl_URL:" + this_href);
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
            db.collection('post_detail', function(err, collection) {
                $('.single-post').each(function(i, elem) {
                    var singlepost = {
                            Reply_user: $(elem).find('.fn').text(),
                            Reply_time: $(elem).find('.date').text(),
                            Reply_content: $(elem).find('.single-post-content').text().replace(/\\r\\n|\\r|\\n|\s/g, "").replace(/.*:+.+(恕刪)./g, "")
                        }
                        // console.log("===============");
                        // console.log(singlepost);
                    collection.insert(singlepost, function(err, data) {
                        if (data) {
                            // console.log('Successfully Insert');
                        } else {
                            console.log('Failed to Insert');
                        }
                    });
                });
            });
            // console.log('last_page_in', last_page);
            // console.log('to_continue', to_continue);
            if (to_continue && otherpages) {
                return Promise.resolve(otherpages);
            } else {
                console.log('no other pages');
                return Promise.resolve(false);
            }
        })
        .catch(function(err) { console.log("error:" + err); })
};