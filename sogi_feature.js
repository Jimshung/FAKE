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

axios.post('http://www.sogi.com.tw/products/htc_10/12204#intro', {
        // headers: {
        //     'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.112 Safari/537.36',
        // },
        // timeout: 3000,
    })
    .then(function(response) {
        $ = cheerio.load(response.data);
        console.log(response);
        //第一頁31個貼文，後續一頁30個貼文

        // $('tbody>tr').each(function(i, elem) {
        //     var subject = {
        //         desc: $(elem).find('.subject-text>a').text(),
        //         href: "http://www.mobile01.com/" + $(elem).find('.subject-text a').attr('href'),
        //         dt: $(elem).find('p').first().text(),
        //         authur: $(elem).find('.authur a p').last().text()
        //     }

        //     console.log(subject);

        // });


        // return Promise.resolve()
    })