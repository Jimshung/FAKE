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


db.open(function() {
    db.collection('TopicList', function(err, collection) {
        // db.getCollection('mobile01_post').find({}, { "href": 1, _id: 0 });
        collection.find({}, { href: 1, lastpage: 1, _id: 0 }).toArray(function(err, data) {
             if (data) {
                // console.log(data);

                // console.log(Array.isArray(data));   
                // console.log(data.length);
                console.log(data[0].href);
                // console.log(typeof data[0].href);

                // console.log(data[0].lastpage);
                // console.log(typeof data[0].lastpage);
                // console.log((data[0]) instanceof Object);   


                // data.forEach(function(element) {
                //     var url=element.href;
                //     console.log(url);
                // });

                // for (var i = 0; i < data.length; i++) {
                //     console.dir("i:" + i);

                //     console.dir("URL:" + data[i].href);
                // };
            } else {
                throw new Error(err);
            }
        })
    });
});
