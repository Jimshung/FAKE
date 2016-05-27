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
                var i = 0;
                var for_loop = function() {
                    if (i < data.length) {
                        console.log("i < data.length");
                        element = data[i];
                        console.log("Reply_content：", element.Reply_content);
                        ckip.request(element.Reply_content)
                            .then(function(response) {
                                return Promise.all([ckip.getSentences(response), ckip.getTerms(response)]);
                            })
                            .then(function(results) {
                                console.log("斷句(含標記)：" + results[0]);
                                db.collection('post_detail_ckip2', function(err, collection2) {
                                    var ckip_sen = JSON.stringify(results[0]).replace(/(\(\S*\))/g, "");
                                    console.log("ckip_sen：" + ckip_sen);

                                    // collection2.insert({ "ckip_getSentences": ckip_sen, "ckip_getTerms": results[1] }, function(err, data) {
                                    collection2.insert({ "ckip_getSentences": ckip_sen }, function(err, data) {

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
                if (i >= data.length) {
                    console.log("out, i >= data.length");
                    clearInterval(for_loop);
                }
            } else {
                throw new Error(err);
            }
        })
    }
);



/*
//setTimeout會同時間對post_detail裡所有回文做斷詞,sleep會跟ckip起衝突
open_db_function(
    'post_detail',
    function(collection, err) {
        collection.find({}, { 'Reply_content': 1, _id: 0 }).toArray(function(err, data) {
            if (data) {
              data.forEach(function(element) {

                //element = data[0];

                console.log("element content", element.Reply_content);
                //sleep.sleep(2);
                setTimeout(function() {
                  ckip.request(element.Reply_content)
                      .then(function(response) {
                          console.log("run ckip 1")
                          return Promise.all([ckip.getSentences(response), ckip.getTerms(response)]);
                      })
                      .then(function(results) {
                          console.log("run ckip 2")

                          console.log(results[0]); // [ ' 台新(N) 金控(N) 12月(N) 3日(N) 將(ADV) 召開(Vt) 股東(N) 臨時會(N) 進行(Vt) 董監(N) 改選(Nv) 。(PERIODCATEGORY)' ] 
                          //console.log(results[1]); // [ { term: '台新', tag: 'N' }, 
                          //   { term: '金控', tag: 'N' }, 
                          //   { term: '12月', tag: 'N' }, 
                          //   { term: '3日', tag: 'N' }, 
                          //   { term: '將', tag: 'ADV' }, 
                          //   { term: '召開', tag: 'Vt' }, 
                          //   { term: '股東', tag: 'N' }, 
                          //   { term: '臨時會', tag: 'N' }, 
                          //   { term: '進行', tag: 'Vt' }, 
                          //   { term: '董監', tag: 'N' }, 
                          //   { term: '改選', tag: 'Nv' }, 
                          //   { term: '。', tag: 'PERIODCATEGORY' } ] 
                          //console.log("ckip_result_1",JSON.stringify());
                          db.collection('post_detail_ckip', function(err, collection2) {
                              //console.log("collection2",collection2);
                              collection2.insert({"ckip_Result_0":results[0],"ckip_Result_1":results[1]}, function(err, data) {
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
                  },3000);  
                });
            } else {
                throw new Error(err);
            }

        })
    }
);*/