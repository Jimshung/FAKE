var request = require('request');
var cheerio = require('cheerio');
var moment = require('moment');
var iconv = require('iconv-lite'); // 用來轉碼
moment.locale("zh-tw");
var async = require('async');
var mongodb = require('mongodb');
var Promise = require('es6-promise').Promise;
var Promise = require('promise');



var mongodbServer = new mongodb.Server('localhost', 27017, {
    auto_reconnect: true,
    poolSize: 10
});
var db = new mongodb.Db('FAKE', mongodbServer);

var page = 0;


function taskA() {
    page++;
    console.log("page_value：" + page);
    return page <= 2; //控制要抓mobile01_topiclist幾頁
}

function taskB() {
    var p_url = "http://www.mobile01.com/topiclist.php?f=566&p=" + page;
    var options = {
        url: p_url,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.112 Safari/537.36',
        }
    };
    console.log("now_url：" + p_url);

    request(options, function(error, response, body) {
        if (error) return callback(error)
        $ = cheerio.load(body);
        console.log('爬mobile01_topiclist的主題文');
        //第一頁31個貼文，後續一頁30個貼文
        db.open(function() {
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
        });


        setTimeout(function() {
            console.log('this is setTimeout');
            taskB(page);
        }, 2500);
    }); //request end
}

function onRejected(error) {
    if (error) {
        console.log("error:" + error);

    }
}

function finalTask() {
    console.log("Final Task");
}

var promise = Promise.resolve();
promise
    .then(taskA)
    .then(taskB)
    .catch(onRejected)
    .then(finalTask);

