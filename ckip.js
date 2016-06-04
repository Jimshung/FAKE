var request = require('request');
var cheerio = require('cheerio');
var moment = require('moment');
var iconv = require('iconv-lite'); // 用來轉碼
moment.locale("zh-tw");
var async = require('async');
var mongodb = require('mongodb');
var Promise = require('es6-promise').Promise;
var ckip = require('ckip-client');

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

var ckip = require('ckip-client')('140.109.19.104', 1501, 'jim51114', 'abc6541');
/*  待處理
1.文章篇幅太常,不會進行ckip
2.有些Reply_content是空值 (貼圖)，要在post_detail就先處理
*/


open_db_function(
    'post_detail',
    function(collection, err) {
        collection.find({}, { 'Reply_content': 1, _id: 0 }).toArray(function(err, data) {
            if (data) {
                var i = 500;
                var for_loop = function() {
                    if (i < 1000) {
                        console.log("i < data.length");
                        element = data[i];
                        console.log("Reply_content：", element.Reply_content);
                        ckip.request(element.Reply_content)
                            .then(function(response) {
                                return Promise.all([ckip.getSentences(response), ckip.getTerms(response)]);
                            })
                            .then(function(results) {
                                console.log("斷句(含標記)：" + results[0]);
                                db.collection('post_detail_ckip3', function(err, collection2) {
                                    var ckip_sen = JSON.stringify(results[0]).replace(/(\(\S*\))/g, "");
                                    console.log("ckip_sen：" + ckip_sen);

                                    // collection2.insert({ "ckip_getSentences": ckip_sen, "ckip_getTerms": results[1] }, function(err, data) {
                                    collection2.insert({ ckip_sen }, function(err, data) {

                                        if (data) {
                                            console.log('Successfully Insert');
                                        } else {
                                            console.log('Failed to Insert');
                                        }
                                    });
                                });
                            })
                            .catch(function(err) {
                                console.log(err);
                            });
                        i = i + 1;
                        console.log("第" + i + "篇評論");
                    } else {
                        console.log("i >= data.length");
                        clearInterval(for_loop);
                    }
                }
                setInterval(for_loop, 4000);
                if (i >= 1000) {
                    console.log("out, i >= data.length");
                    clearInterval(for_loop);
                }
            } else {
                throw new Error(err);
            }
        })
    }
);
