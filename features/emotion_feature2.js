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

//特徵二

var fs = require('fs');

// fs.readFile('positive.txt', function(err, data) {
//     if (err) throw err;
//     var array = data.toString().split("\n");
//     console.log(array); 
// });



//var emotion_dict = ["放鬆", "自在", "平和", "冷靜", "安慰","感謝"];
// console.log(ty peof emotion_dict);


/*var article = [
    ["一帆風順", "情緒", "一流", "為", "基礎", "之", "情境", "資訊", "連結", "與", "觀察"],
    ["以", "情緒", "詞", "為", "自在", "之", "情境", "資訊", "連結", "與", "觀察"],
    ["以", "情緒", "詞", "為", "平和", "之", "冷靜", "資訊", "連結", "與", "觀察"],
    ["以", "情緒", "詞", "為", "基礎", "之", "情境", "資訊", "連結", "與", "觀察"],
    ["以", "情緒", "詞", "為", "基礎", "之", "情境", "資訊", "連結", "與", "觀察"],
];*/


var mongodbServer = new mongodb.Server('localhost', 27017, {
    auto_reconnect: true,
    poolSize: 10
});
var db = new mongodb.Db('FAKE', mongodbServer);

var open_db_function = function(table, func_in, callback) {
    db.open(function(err) {
        if (err) return console.log(err);
        console.log('db now open')
        db.collection(table, function(err, collection) {
            if (err) return console.log(err);
            func_in(err, collection, callback);
        });
    });
};


var article = []

open_db_function(
    'post_detail_ckip3',
    function(err, collection, callback) {
        if (err) return console.log(err);
        collection.find({}, { ckip_sen: 1, _id: 0 }).toArray(function(err, data) {
            for (var i = 0; i < data.length; i++) {
                var data2 = data[i]['ckip_sen'].replace(/[\[\],"]/g, '').trim().split('　');
                article.push(data2)
            } //var data2 = data['ckip_sen'].replace(/[\[\],"]/g,'')
            callback(article);
        })
    },
    function(article) {
	    fs.readFile('../dictionary/NTUSD/positive.txt', function(err, data) {
	        if (err) throw err;
	        var emotion_dict = data.toString().split("\n");
	        //emotion_dict = array; 
	        //console.log(article);
	        console.log("results:");
	        console.log(count_emotion(article, emotion_dict));
	    });
    }
);


function intersection(a, b) {
    var rs = [],
        x = a.length;
    while (x--) b.indexOf(a[x]) != -1 && rs.push(a[x]);
    return rs.sort();
}


var count_emotion = function(article, emotion_dict) {
    var result = [];
    for (var i = 0; i < article.length; i++) {
        var emotion_count = 0
        var sentence = article[i];
        var emotion_count = intersection(sentence, emotion_dict).length
        result.push(emotion_count / sentence.length);

    }
    return result;
}

// console.log(count_emotion(article,emotion_dict));