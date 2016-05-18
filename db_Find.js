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
var pmongo = require('promised-mongo').compatible();



var mongodbServer = new mongodb.Server('localhost', 27017, {
    auto_reconnect: true,
    poolSize: 10
});
var db = new mongodb.Db('FAKE', mongodbServer);


db.open(function() {
    db.collection('mobile01_post', function(err, collection) {
        // db.getCollection('mobile01_post').find({}, { "href": 1, _id: 0 });
        collection.find({}, { href: 1, _id: 0 }).toArray(function(err, data) {
            // console.dir(data[0].href); 
            if (data) {
                // console.log(data);

                // console.dir(Href);
                // var myArray = [];
                // data.href = myArray;

                data.forEach(function(element) {
                    var url=element.href;
                    console.log(url);
                });

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

// var regex = /((t=.+[0-9]+))/g;
// var myArray = myRe.exec(data[i].href);
// console.dir(myRe.lastIndex.replace("t=", ""));