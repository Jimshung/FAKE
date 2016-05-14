var request = require('request');
var cheerio = require('cheerio');
var moment = require('moment');
var iconv = require('iconv-lite'); // 用來轉碼
moment.locale("zh-tw");
var async = require('async');
var mongodb = require('mongodb');
var Promise = require('es6-promise').Promise;
var axios = require('axios');


var getAPage = function(page) {
    return axios.post('http://www.mobile01.com/topicdetail.php?f=566&t=4781970&p=' + page, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.112 Safari/537.36',
            },
            timeout: 2000,
        })
        .then(function(response) {
            $ = cheerio.load(response.data);

            var last_page = $('.pagination').find('a').last().attr('href').replace(/.*p=/g, "");
            //last_page為分頁最後值
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
            return Promise.resolve(last_page)
        })
}

getAPage().then(function(last_page) {
    for (var i = 2; i <= last_page; i++) {
        var page = 1;
        setTimeout(function() {
            console.log('getAPage：' + page)
            page++;
            return getAPage(page)
        }, i * 2000)
        console.log('i=' + i)
    };

})