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


var mongodbServer = new mongodb.Server('localhost', 27017, {
    auto_reconnect: true,
    poolSize: 10
});
var db = new mongodb.Db('FAKE', mongodbServer);


var getAPage = function(page) {
    return axios.post('http://www.mobile01.com/topiclist.php?f=566&p=' + page, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.112 Safari/537.36',
            },
            timeout: 3000,
        })
        .then(function(response) {
            $ = cheerio.load(response.data);
            var last_page = $('.pagination').find('a').last().text();

            $('tbody>tr').each(function(i, elem) {
                var subject = {
                    desc: $(elem).find('.subject-text>a').text(),
                    href: "http://www.mobile01.com/" + $(elem).find('.subject-text a').attr('href'),
                    dt: $(elem).find('p').first().text(),
                    authur: $(elem).find('.authur a p').last().text()
                }
                console.log("=========================");
                console.log(subject);

                // db.collection('mobile01_post', function(err, collection) {
                //     collection.insert(subject, function(err, data) {
                //         if (data) {
                //             console.log('Successfully Insert');
                //         } else {
                //             console.log('Failed to Insert');
                //         }
                //     });
                // });
            });

            return Promise.resolve()
        })
}

getAPage(1)
    .then(function() {
        setTimeout(function() {
            return getAPage(2)
        }, 5000);
    })
    // .then(function() {
    //     return getAPage(3)
    // })


// setTimeout(function() {
//     console.log('this is setTimeout');
//     crawler(page);
// }, 2500);