var request = require('request');
var cheerio = require('cheerio');
var moment = require('moment');
var iconv = require('iconv-lite'); // 用來轉碼
moment.locale("zh-tw");
var async = require('async');
var mongodb = require('mongodb');

var mongodbServer = new mongodb.Server('localhost', 27017, {
    auto_reconnect: true,
    poolSize: 10
});
var db = new mongodb.Db('FAKE', mongodbServer);

module.exports = function(app) {

        app.post("/do_parser_mobile01", function(req, res) {

            for (var page = 1; page <= 3; page++) {
                //20160421：分頁一起抓
                var p_url = "http://www.mobile01.com/topiclist.php?f=566&p=" + page;
                var options = {
                    url: p_url,
                    headers: {
                        //          Accept:'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                        //          'Accept-Encoding':'gzip, deflate, sdch',
                        //          'Accept-Language':'zh-TW,zh;q=0.8,en-US;q=0.6,en;q=0.4,zh-CN;q=0.2zh-TW,zh;q=0.8,en-US;q=0.6,en;q=0.4,zh-CN;q=0.',
                        //          Connection:'keep-alive',
                        //          Cookie :'_chartbeat2=CCfA5dDlPrViUv-re.1422534975214.1422534975214.1; __gads=ID=00e67387061704fe:T=1452998898:S=ALNI_MYAfm4S2JhukjJ7_Ung0qepJ49vsg; PHPSESSID=11cb6d2bc98eca932488df96b888d3fb; userinfo[id]=2988691; userinfo[username]=jimspam; userinfo[pass]=poAlxGAo4PdWO8owCR3oesQ7TtoxaZtWvnozIt1Pl1A%3D; userinfo[timezone]=8.0; loginstat=1; tagmode=1; userinfo[lastlogin]=1461046198; userinfo[currentlogin]=1461046198; forumnavi=1; __asc=a0c9c30b1542d40b96cb87707e8; __auc=ee80e98a149ac4c3ebe05c93147; __utmt=1; __utma=174945982.1941011679.1415934918.1461046201.1461048097.210; __utmb=174945982.4.9.1461049032705; __utmc=174945982; __utmz=174945982.1460862980.203.168.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not%20provided)',
                        //          Host: 'www.mobile01.com',
                        //          'Upgrade-Insecure-Requests':1,
                        //20160419：header不用全部       
                        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.112 Safari/537.36',
                    }
                };
                console.log(p_url);
                request(options, function(error, response, body) {
                    // console.log(error);
                    if (!error && response.statusCode == 200) {
                        // body=iconv.decode(body,'UTF-8'); //轉碼
                        //console.log(body);
                        $ = cheerio.load(body);
                        //var abc = $('tr>td>span').text();
                        //console.log($('a[class = "topic_top"]').html());
                        var news = [];
                        $('tbody>tr').each(function(i, elem) {
                            news[i] = {
                                //主題
                                desc: $(this).children('td[class = "subject"]').children('span[class = "subject-text"]').children('a').text(),
                                //主題url
                                href: "http://www.mobile01.com/" + $(this).children('td[class = "subject"]').children('span[class = "subject-text"]').children('a').attr('href'),
                                //發文時間
                                dt: $(this).children('td[class = "authur"]').children('a').children('p').first().text(),
                                //dt :  moment().format("YYYY")+"/" + $(this).children('td[class = "authur"]').children('a').children('p').first().text().replace(/^\[|\]$/g, ""),
                                //發文作者
                                authur: $(this).children('td[class = "authur"]').children('a').children('p').last().text(),
                                //20160421 
                            }
                            console.log("===============");
                            console.log("主題：" + news[i].desc);
                            console.log("主題url：" + news[i].href);
                            console.log("發文時間：" + news[i].dt);
                            console.log("發文作者：" + news[i].authur);
                        });
                        //console.log(news) ;

                        /* open db 20160425 */
                        db.open(function() {
                            /* Select 'contact' collection */
                            db.collection('mobile01_post', function(err, collection) {
                                /* Insert a data */
                                for (var i = 0; i < news.length; i++) {
                                    collection.insert({
                                        desc: news[i].desc,
                                        href: news[i].href,
                                        dt: news[i].dt,
                                        authur: news[i].authur
                                            // type : "",
                                    }, function(err, data) {
                                        if (data) {
                                            console.log('Successfully Insert');
                                        } else {
                                            console.log('Failed to Insert');
                                        }
                                    });

                                }

                            });
                        });

                        // 以下都是網頁端 不顯示沒差
                        res.json(200, {
                            message: "ok",
                            dt: moment().format("llll"),
                            p_html: news
                        });
                    } else {
                        return res.json(400, {
                            error: 'error ' + error
                        });
                    }
                });
            } //for
        });


        //爬主題下的回文
        app.post("/do_parser_topicdetail", function(req, res) {

            var p_url = "http://www.mobile01.com/topicdetail.php?f=566&t=4779462";
            var options = {
                url: p_url,
                headers: {
                    //          Accept:'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    //          'Accept-Encoding':'gzip, deflate, sdch',
                    //          'Accept-Language':'zh-TW,zh;q=0.8,en-US;q=0.6,en;q=0.4,zh-CN;q=0.2zh-TW,zh;q=0.8,en-US;q=0.6,en;q=0.4,zh-CN;q=0.',
                    //          Connection:'keep-alive',
                    //          Cookie :'_chartbeat2=CCfA5dDlPrViUv-re.1422534975214.1422534975214.1; __gads=ID=00e67387061704fe:T=1452998898:S=ALNI_MYAfm4S2JhukjJ7_Ung0qepJ49vsg; PHPSESSID=11cb6d2bc98eca932488df96b888d3fb; userinfo[id]=2988691; userinfo[username]=jimspam; userinfo[pass]=poAlxGAo4PdWO8owCR3oesQ7TtoxaZtWvnozIt1Pl1A%3D; userinfo[timezone]=8.0; loginstat=1; tagmode=1; userinfo[lastlogin]=1461046198; userinfo[currentlogin]=1461046198; forumnavi=1; __asc=a0c9c30b1542d40b96cb87707e8; __auc=ee80e98a149ac4c3ebe05c93147; __utmt=1; __utma=174945982.1941011679.1415934918.1461046201.1461048097.210; __utmb=174945982.4.9.1461049032705; __utmc=174945982; __utmz=174945982.1460862980.203.168.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not%20provided)',
                    //          Host: 'www.mobile01.com',
                    //          'Upgrade-Insecure-Requests':1,
                    //20160419：header不用全部       
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.112 Safari/537.36',
                }
            };
            console.log(p_url);
            request(options, function(error, response, body) {
                // console.log(error);
                if (!error && response.statusCode == 200) {
                    $ = cheerio.load(body);
                    var news = [];
                    $('div[class = "forum-content"]').each(function(i, elem) {
                        news[i] = {
                            //主題
                            // desc: $(this).children('main').children('h1').text(),
                            //留言時間
                            // Reply_time: $(this).children('main').children('article').children('div').children('div[class = "single-post-author group"]').children('div').children('div[class = "fn"]').children('a').text(),
                            //留言者
                            Reply_user: $(this).children('.single-post').children('div[class = "single-post-author group"]').children('div').children('div[class = "fn"]').children('a').text(),
                            //留言內容
                            Reply_content: $(this).children('main').children('article').children('.single-post').children('div[class = "single-post-content"]').children('div').text(),
                        }


                        console.log("===============");
                        console.log("留言者：" + news[i].Reply_user);
                        console.log("留言內容：" + news[i].Reply_content);

                    });
                    //console.log(news);


                    // /* open db 20160425 */
                    // db.open(function() {
                    //     /* Select 'contact' collection */
                    //     db.collection('mobile01_post', function(err, collection) {
                    //         /* Insert a data */
                    //         for (var i = 0; i < news.length; i++) {
                    //             collection.insert({
                    //                 desc: news[i].desc,
                    //                 href: news[i].href,
                    //                 dt: news[i].dt,
                    //                 authur: news[i].authur
                    //                     // type : "",
                    //             }, function(err, data) {
                    //                 if (data) {
                    //                     console.log('Successfully Insert');
                    //                 } else {
                    //                     console.log('Failed to Insert');
                    //                 }
                    //             });

                    //         }

                    //     });
                    // }); //db_end

                    // 以下都是網頁端 不顯示沒差
                    res.json(200, {
                        message: "ok",
                        dt: moment().format("llll"),
                        p_html: news
                    });
                } else {
                    return res.json(400, {
                        error: 'error ' + error
                    });
                }
            });
            // } //for
        });






        // app.post("/do_parser_et_news", function(req, res) {
        //     var page = 1;
        //     var tot = 0;
        //     var etdt = moment().format("YYYY-MM-DD");
        //     var pages;
        //     async.whilst(
        //         function() {
        //             if (page > 0) {
        //                 return true;
        //             } else {
        //                 res.json(200, {
        //                     message: "ok",
        //                     dt: moment().format("llll"),
        //                     tot: tot
        //                 });
        //                 return false;
        //             }
        //         },
        //         function(next) {

        //             var p_url = "http://www.mobile01.com/topiclist.php?f=566&p=" + page;
        //             var options = {
        //                 url: p_url,
        //                 headers: {
        //                     'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.112 Safari/537.36',
        //                 }
        //             };

        //             request(options, { encoding: null }, function(error, response, body) {
        //                 if (!error && response.statusCode == 200) {
        //                     $ = cheerio.load(body);
        //                     if (page == 1) {
        //                         var pt = $('div[class="pagination"] >a').last().attr("href");
        //                         console.log(p_url);
        //                         pt = pt.lastIndexOf("-") + 1;
        //                         console.log(pt);
        //                         pages = parseInt(pt);
        //                     }
        //                     if ((pages + 1) == page) {
        //                         page = 0;
        //                     } else {
        //                         var news = [];
        //                         $('tbody>tr').each(function(i, elem) {
        //                             news[i] = {
        //                                 desc: $(this).children('td[class = "subject"]').children('span[class = "subject-text"]').children('a').text(),
        //                                 href: "http://www.mobile01.com/" + $(this).children('td[class = "subject"]').children('span[class = "subject-text"]').children('a').attr('href'),
        //                                 dt: $(this).children('td[class = "authur"]').children('a').children('p').first().text(),
        //                                 //dt :  moment().format("YYYY")+"/" + $(this).children('td[class = "authur"]').children('a').children('p').first().text().replace(/^\[|\]$/g, ""),
        //                                 authur: $(this).children('td[class = "authur"]').children('a').children('p').last().text(),
        //                                 //20160421 
        //                             }
        //                         });

        //                         console.log(page + ":" + news);
        //                         /*
        //                          * News.updbatch(news,function(err, obj){ if(err) {
        //                          * console.log("err2:"+err); page = 0; return
        //                          * res.json(200, { message : "ok", dt :
        //                          * moment().format("llll"), error : 'error ' + err,
        //                          * tot :tot }); }else{ tot = tot + obj.length;
        //                          * console.log("tot:"+tot); page++; } });
        //                          */
        //                     }
        //                 } else {
        //                     console.log(error);
        //                     page = 0;
        //                 }
        //                 next();
        //             });
        //         },
        //         function(err) {
        //             if (err) {
        //                 console.log("err:" + err);
        //                 res.json(400, {
        //                     error: 'error ' + err,
        //                     tot: tot
        //                 });
        //             }
        //         }
        //     );
        // });

    } //module.exports結尾