var request = require('request');
var cheerio = require('cheerio');
var moment = require('moment');
var iconv = require('iconv-lite'); // 用來轉碼
moment.locale("zh-tw");
var async = require('async');
var mongodb = require('mongodb');
var Promise = require('es6-promise').Promise;
var ckip = require('ckip-client');


var ckip = require('ckip-client')('140.109.19.104', 1501, 'jim51114', 'abc6541');

ckip.request('台新金控12月3日將召開股東臨時會進行董監改選。')
  .then(function (response) {
    return Promise.all([ckip.getSentences(response), ckip.getTerms(response)]);
  })
  .then(function (results) {
    console.log(results[0]);  // [ '　台新(N)　金控(N)　12月(N)　3日(N)　將(ADV)　召開(Vt)　股東(N)　臨時會(N)　進行(Vt)　董監(N)　改選(Nv)　。(PERIODCATEGORY)' ]
    console.log(results[1]);  // [ { term: '台新', tag: 'N' },
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
  .catch(function (err) {
    console.log(err);
  });