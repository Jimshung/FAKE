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
    db.open(function(err) {
        if (err) return console.log(err);
        console.log('db now open')
        db.collection(table, function(err, collection) {
            if (err) return console.log(err);
            func_in(err, collection);
        });
    });
};

open_db_function(
    'TopicList_Htc10',
    function(err, collection) {
         if (err) return console.log(err);
        collection.find({}, { href: 1, otherpages: 1, _id: 0 }).toArray(function(err, data) {
            if (err) throw err;

            if (!data || data.length === 0) {
                return console.log('no data')
            }

            var i = 0;
            var sid = setInterval(Href_Request, 8000);

            function Href_Request() {
                if (i >= data.length) {
                    clearInterval(sid);
                    return
                }

                var element = data[i];
                i = i + 1;
                var otherpages = element.otherpages;

                console.log("第" + (i - 1) + "個href");
                console.log("href:" + element.href);
                console.log("otherpages:" + otherpages);

                getAPageAllPost(element, 1, otherpages).then(function(shouldContinue) {
                    if (!shouldContinue) return

                    for (var j = 2; j <= otherpages; j++) {
                        console.log('123');

                        var page = 1;
                        setTimeout(function() {
                            page++;
                            console.log('now_page:' + page);
                            return getAPageAllPost(element, page, false);
                        }, j * 2000);
                    }
                });
            }


        })
    }
);

var getAPageAllPost = function(element, page, to_continue) {
    var this_href = element.href;

    if (page) {
        this_href = this_href + '&p=' + page;
    }

    console.log("now_crawl_URL:" + this_href);

    return axios.post(this_href, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.112 Safari/537.36',
            },
            timeout: 3000,
        })
        .then(function(response) {
            $ = cheerio.load(response.data);

            db.collection('post_detail_HTC10', function(err, collection) {
                if (err) throw err;

                $('.single-post').each(function(i, elem) {
                    var singlepost = {
                        Reply_user: $(elem).find('.fn').text(),
                        Reply_time: $(elem).find('.date').text(),
                        Reply_content: $(elem).find('.single-post-content').text().replace(/\\r\\n|\\r|\\n|\s/g, "").replace(/.*:+.+(恕刪)./g, "")
                    }

                    // console.log("===============");
                    // console.log(singlepost);
                    
                    collection.insert(singlepost, function(err, data) {
                        if (err) throw err;
                        console.log('insert Successfully')
                    });
                });
            });

            if (to_continue) {
                return Promise.resolve(true);
            } else {
                console.log('no other pages');
                return Promise.resolve(false);
            }
        })
        .catch(function(err) { console.log("error:" + err); })
};