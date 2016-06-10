var request = require('request');
var cheerio = require('cheerio');
var moment = require('moment');
var iconv = require('iconv-lite');
moment.locale("zh-tw");
var async = require('async');
var mongodb = require('mongodb');
var Promise = require('es6-promise').Promise;
var ckipClient = require('./ckip-client');

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

var ckip = ckipClient('140.109.19.104', 1501, 'jim51114', 'abc6541');


open_db_function(
    'post_detail_HTC10',
    function(err, collection) {
        if (err) return console.log(err);
        collection.find({}, { 'Reply_user': 1, 'Reply_content': 1, _id: 0 }).toArray(function(err, data) {
            if (err) return  console.log(err);

            if (!data || data.length === 0) {
                return console.log('no data')
            }

            var i = 0;

            var sid = setInterval(CKIP_LOOP, 4000);

            function CKIP_LOOP() {
                console.log('start')

                if (i >= data.length) {
                    clearInterval(sid);
                    return
                }
                var element = data[i];
                i = i + 1;

                ckip.request(element.Reply_content)
                    .then(function(response) {
                        return Promise.all([ckip.getSentences(response), ckip.getTerms(response)]);
                    })
                    .then(function(results) {
                        // console.log("斷句(含標記)：" + results[0]);
                        db.collection('ckip_sen', function(err, collection) {
                            var ckip_sen = JSON.stringify(results[0]).replace(/(\(\S*\))/g, "");
                            console.log("content_ckip：" + ckip_sen);
                            collection.insert({ "Reply_content": element.Reply_content, "Reply_user": element.Reply_user, ckip_sen }, function(err, data) {

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
            }


        })
    });