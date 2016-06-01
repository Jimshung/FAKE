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
var nodejieba = require("nodejieba");


nodejieba.load({
    userDict: '/Users/jim/Documents/workspace/FAKE/node_modules/nodejieba/dict/user.dict.utf8',
    stopWordDict: '/Users/jim/Documents/workspace/FAKE/node_modules/nodejieba/dict/stop_words.utf8',
});



var sentence = "確實也不能排除可能是玻璃保護貼裂開，但目前我摸保護貼的裂痕處完全平滑無裂痕的觸感過兩天拿去給神腦貼膜人員鑑定看看是保護貼還是螢幕裂開~有後續消息再跟大家說明嚕~PS.這支手機我是蠻喜歡的除了1.個人感覺相機介面不夠人性、2.螢幕截圖方式很麻煩(還不能錄螢幕)、3.輸入法不能直接在虛擬鍵盤上手寫(我之前用SONY)~其他如手機質感、手感、性能、續航力、充電都很滿意~尤其是MADEINTAIWAN看了就爽";

var result;
result = nodejieba.cutAll(sentence);
console.log('.cutAll:' + result);
console.log("============");

result = nodejieba.cut(sentence, true);
console.log('.cut:' + result);
console.log("============");

result = nodejieba.cutHMM(sentence);
console.log("cutHMM:" + result);
console.log("============");

result = nodejieba.cutForSearch(sentence);
console.log("cutForSearch:" + result);
console.log("============");

result = nodejieba.tag(sentence);
console.log("tag:" + result);
console.log("============");

var topN = 3;
result = nodejieba.extract(sentence, topN);
console.log('topN:' + result);
console.log("============");
