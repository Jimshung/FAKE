var request = require('request');
var cheerio = require('cheerio');
var moment = require('moment');
var iconv = require('iconv-lite'); // 用來轉碼
moment.locale("zh-tw");
var async = require('async');
var mongodb = require('mongodb');
var Promise = require('es6-promise').Promise;
var ckip = require('ckip-client');


var ckip = require('ckip-client')(140.109.19.104, 1501, jim51114, abc6541);

ckip.request('台新金控12月3日將召開股東臨時會進行董監改選。', function (err, response) {
  if (err) throw err;

  ckip.getSentences(response, function (err, setences) {
    if (err) throw err;
    console.log(setences);  // [ '　台新(N)　金控(N)　12月(N)　3日(N)　將(ADV)　召開(Vt)　股東(N)　臨時會(N)　進行(Vt)　董監(N)　改選(Nv)　。(PERIODCATEGORY)' ]
  });

  ckip.getTerms(response, function (err, terms) {
    if (err) throw err;
    console.log(terms);  // [ { term: '台新', tag: 'N' },
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
  });
});

  //斷詞服務採用TCP Socket連線傳輸資料，伺服器IP位址為 140.109.19.104 ，連接埠為 1501， 建議設定等候伺服器回應時間約一至三分鐘。資料詳細格式與使用注意事項敬請參閱斷詞服務網頁上的說明。