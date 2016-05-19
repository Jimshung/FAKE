var request = require('request');
var cheerio = require('cheerio');
var moment = require('moment');
var iconv = require('iconv-lite'); // 用來轉碼
moment.locale("zh-tw");
var async = require('async');
var mongodb = require('mongodb');
var Promise = require('es6-promise').Promise;
var ckip = require('ckip-client');
var sleep = require('sleep');


var mongodbServer = new mongodb.Server('localhost', 27017, {
    auto_reconnect: true,
    poolSize: 10
});
var db = new mongodb.Db('FAKE', mongodbServer);

var open_db_function = function(table, func_in) {
                            //console.log('db1',db);

    db.open(function() {
        db.collection(table, function(err, collection) {
            func_in(collection, err);

        });
    });

};

var ckip = require('ckip-client')('140.109.19.104', 1501, 'jim51114', 'abc6541');

open_db_function(
    'post_detail',
    function(collection, err) {
        collection.find({}, { 'Reply_content': 1, _id: 0 }).toArray(function(err, data) {
            if (data) {
              var i=0;
              var for_loop = function(){
                if(i < 3){
                  console.log("i < 3");
                  element = data[i];
                  //i+1;
                  console.log("element content", element.Reply_content);
                  //sleep.sleep(2);
                    ckip.request(element.Reply_content)
                        .then(function(response) {
                            console.log("run ckip 1")
                            return Promise.all([ckip.getSentences(response), ckip.getTerms(response)]);
                        })
                        .then(function(results) {
                            console.log("run ckip 2")

                            console.log(results[0]); // [ ' 台新(N) 金控(N) 12月(N) 3日(N) 將(ADV) 召開(Vt) 股東(N) 臨時會(N) 進行(Vt) 董監(N) 改選(Nv) 。(PERIODCATEGORY)' ] 
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
                      i = i+1;
                      console.log("i",i);
                    }
                    else{
                      console.log("i >= 3");
                      clearInterval(for_loop);
                    }
                  }
               setInterval(  for_loop , 2000);
               if(i>=3){
                  console.log("out, i >= 3");
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


/*
open_db_function(
    'post_detail',
    function(collection, err) {
        collection.find({}, { 'Reply_content': 1, _id: 0 }).toArray(function(err, data) {
            if (data) {
                data.forEach(function(element) {

                //element = data[0];

                console.log("element content", element.Reply_content);

                sleep.sleep(2)
                });
            } else {
                throw new Error(err);
            }

        })
    }
);

*/
/*
var ckip = require('ckip-client')('140.109.19.104', 1501, 'jim51114', 'abc6541');

ckip.request('台新金控12月3日將召開股東臨時會進行董監改選。')
    .then(function(response) {
        return Promise.all([ckip.getSentences(response), ckip.getTerms(response)]);
    })
    .then(function(results) {
        console.log(results[0]); // [ ' 台新(N) 金控(N) 12月(N) 3日(N) 將(ADV) 召開(Vt) 股東(N) 臨時會(N) 進行(Vt) 董監(N) 改選(Nv) 。(PERIODCATEGORY)' ] 
        console.log(results[1]); // [ { term: '台新', tag: 'N' }, 
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
    })
    .catch(function(err) {
        console.log(err);
    });

*/
//斷詞服務採用TCP Socket連線傳輸資料，伺服器IP位址為 140.109.19.104 ，連接埠為 1501， 建議設定等候伺服器回應時間約一至三分鐘。資料詳細格式與使用注意事項敬請參閱斷詞服務網頁上的說明。