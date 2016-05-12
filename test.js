var request = require('request');
var cheerio = require('cheerio');
var moment = require('moment');
var iconv = require('iconv-lite'); // 用來轉碼
moment.locale("zh-tw");
var async = require('async');
var mongodb = require('mongodb');
var Promise = require('es6-promise').Promise;
var axios = require('axios');



// http://www.mobile01.com/topicdetail.php?f=566&t=4794459&p=1

// var getAPage = function(page) {
//     return axios.post('http://www.mobile01.com/topicdetail.php?f=566&t=4794459&p=' + page, {
//             headers: {
//                 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.112 Safari/537.36',
//             },
//         })
//         .then(function(response) {
//             $ = cheerio.load(response.data);
//             var last_page = $('.pagination').find('a').last().text();
//             console.log(last_page);
//             return Promise.resolve()
//         })
// }


var getAPage = function(page) {
    return axios.post('http://www.mobile01.com/topicdetail.php?f=566&t=4794459&p=' + page, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.112 Safari/537.36',
            },
            timeout: 1500,
        })
        .then(function(response) {
            $ = cheerio.load(response.data);
            var last_page = $('.pagination').find('a').last().text();

            $('.single-post').each(function(i, elem) {
                var singlepost = {
                    Reply_user: $(elem).find('.fn').text(),
                    Reply_time: $(elem).find('.date').text(),
                    Reply_content: $(elem).find('.single-post-content').text().replace(/\\r\\n|\\r|\\n|\s/g, "").replace(/.*:+.+(恕刪)./g, "")
                }
                console.log("===============");
                console.log(singlepost);
                // save to db
            });
            return Promise.resolve()
        })
}


// for (var i = 1; i <= last_page; i++) {
// getAPage(1)
// }

getAPage(1)
    .then(function() {
        return getAPage(2)
    })
    .then(function() {
        return getAPage(3)
    })





/*
axios.get('http://www.mobile01.com/topicdetail.php', {
        // baseURL: 'http://www.mobile01.com/topicdetail.php',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.112 Safari/537.36',

        },
        timeout: 2000,
        params: {
            f: 566,
            t: 4794459,
            p: 1
        },
    })
    .then(function(response) {
        // console.log(response.config.params.p);

        $ = cheerio.load(response.data);
        //抓分頁總頁數
        var last_page = $('.pagination').find('a').last().text();
        // console.log(last_page);

        // for (var i = 1; i <= last_page; i++) {
        //     console.log("現在頁數：" + response.config.params.p);

        $('.single-post').each(function(i, elem) {
            var singlepost = {
                Reply_user: $(elem).find('.fn').text(),
                Reply_time: $(elem).find('.date').text(),
                Reply_content: $(elem).find('.single-post-content').text().replace(/\\r\\n|\\r|\\n|\s/g, "").replace(/.*:+.+(恕刪)./g, "")
            }
            console.log("===============");
            console.log(singlepost);

        });
        // response.config.params.p++;
        // };
    })
    .catch(function(response) {
        console.log(response);
    });
*/

// for (var page = 1; page <= 1; page++) {

//     var p_url = "http://www.mobile01.com/topicdetail.php?f=566&t=4771973&p=" + page;
//     var options = {
//         url: p_url,
//         headers: {
//             'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.112 Safari/537.36',
//         }
//     };
//     console.log(p_url);
//     request(options, function(error, response, body) {
//         // console.log(error);
//         if (error) return console.log(error)

//         $ = cheerio.load(body);

//         //爬主題下的回文
//         $('.single-post').each(function(i, elem) {
//             var singlepost = {
//                     Reply_user: $(elem).find('.fn').text(),
//                     Reply_time: $(elem).find('.date').text(),
//                     Reply_content: $(elem).find('.single-post-content').text()
//                 }
//                 //http://stackoverflow.com/questions/28790458/how-to-remove-div-and-br-using-cheerio-js
//                 //https://api.jquery.com/jQuery.trim/

//             console.log("===============");
//             console.log(singlepost);

//         });

//     });
// } //for