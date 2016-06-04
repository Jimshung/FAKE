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

var fs = require('fs');

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





//Feature1
// ADD "相片", "影片"
var terms = ["相片","影片","尺寸", "重量", "SIM卡", "防水", "防塵", "螢幕", "技術", "作業系統", "處理器", "記憶體", "儲存空間", "記憶卡", "通訊協定", "雙卡雙待", "相機功能", "多媒體", "連結與網路", "感應器", "指紋辨識", "電池", "顏色", "其它"];
//計算字詞出現次數
//http://goo.gl/Jfkx8g

var count_word = function(s) {
    var counts = {};
    for (var i = 0; i < s.length; i++)
        counts[s[i]] = (counts[s[i]] + 1) || 1;
    return counts;
}

//get collection of keys in javascript dictionary
//http://goo.gl/jgh2SE
var to_vector = function(s_count, t_count) {
    var all_words = Array.from(new Set(Object.keys(s_count).concat(Object.keys(t_count))));
    //concat() Method 取array交集

    var s_array = new Array(all_words.length).fill(0);
    var t_array = new Array(all_words.length).fill(0);
    for (var i = 0; i < all_words.length; i++) {
        word = all_words[i];
        if (s_count[word]) {
            s_array[i] = s_count[word];
        }
        if (t_count[word]) {
            t_array[i] = t_count[word];
        }
    }
    return [all_words, s_array, t_array];
}

var cosine_similarity = function(a, b) {
    if (a.length != b.length) {
        console.log("error");
        return -1;
    }
    var sum_up = 0;
    var sum_asq = 0;
    var sum_bsq = 0;
    for (var i = 0; i < a.length; i++) {
        sum_up += a[i] * b[i];
        sum_asq += Math.pow(a[i], 2);
        sum_bsq += Math.pow(b[i], 2);
    }
    return sum_up / (Math.sqrt(sum_asq) * Math.sqrt(sum_bsq));
}

// console.log(cosine_similarity([1,2,3],[3,4,5]) );//0.9827076298239908
// console.log(cosine_similarity([1,2,3],[-3,4,5])); //0.7559289460184545 

function clean_stopword(sentence, stopword){
    var result = [];
    for(var i=0; i<sentence.length; i++){
        if(stopword.indexOf(sentence[i]) == -1){
            result.push(sentence[i]);
        }
    }
    return result;
}

function article_cosine_similarity(article, terms, stop_word){
    var results = [];
    var t_count = count_word(terms);
    for(var i=0; i<article.length; i++){
        //console.log("original",article[i]);
        var article_clean = clean_stopword(article[i],stop_word);
        //console.log("clean",article_clean);
        var s_count = count_word(article_clean);
        var vector_result = to_vector(s_count, t_count);
        var s_array = vector_result[1];
        var t_array = vector_result[2];
        var result_sim = cosine_similarity(s_array, t_array);
        results.push(result_sim);
        //console.log(result_sim);
    }
    return results;
}



// Feature 2
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

// Feature 3
var url_expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;

//detect the URL
var has_url = function(article,urlPattern){
    result = [];
    for (var i=0; i<article.length; i++){
        //console.log("join",article[i].join(""))
        if( article[i].join("").match(urlPattern)){
            result.push(1);
        }
        else{
            result.push(0);
        }
    }
    return result;
}



// Feature4
var question_dict = ["?","什麼","誰","哪一個","嗎","呢","吧","啊","為何","如何","幾時","多少","多少錢","怎樣","怎麼","為何麼","難道","何嘗","何必","who","what","which","whose","when","where","how","why"];


var article = []


// write csv

function write_csv(filename, values){
    var file_content =""
    for(var i=0; i<values.length; i++){
        for(var j=0; j<values[i].length;j++){
                //console.log("val:",values[i][j]);
                file_content += values[i][j].toString();
                if(j<values[i].length -1){
                    file_content += ", ";
                }
        }
        file_content += "\n";
    }

    fs.writeFile(filename, file_content, function (err) {
        if (err) 
            return console.log(err);
        console.log('file_content >'+ filename);
    });
}



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
        fs.readFile('./dictionary/stopword_200.txt', function(err0, data0) {
            if (err0) throw err0;
            var stop_word = data0.toString().split("\n");
            //console.log("stop-word");
            //console.log(stop_word);
            fs.readFile('./dictionary/NTUSD/positive.txt', function(err, data) {
                if (err) throw err;
                var emotion_dict = data.toString().split("\n");

                var result1 = article_cosine_similarity(article, terms, stop_word);
                var result2 = count_emotion(article, emotion_dict);
                var result3 = has_url(article,url_expression);
                var result4 = count_emotion(article, question_dict);

                console.log("cosine similarity:");
                console.log(result1);
                console.log("emotion:");
                console.log(result2);
                console.log("url_result:");
                console.log(result3);
                console.log("question:");
                console.log(result4);
                var csv_values = [];
                var fix_val = 3;
                for(var i=0; i<result1.length;i++){
                    csv_values.push([result1[i].toFixed(fix_val),
                        result2[i].toFixed(fix_val),
                        result3[i].toFixed(fix_val),
                        result4[i].toFixed(fix_val),

                        ]);
                }
                console.log("csv_values:");
                console.log(csv_values);

                write_csv("test.csv",csv_values);
            });
        });

    }
);

// console.log(count_emotion(article,emotion_dict));