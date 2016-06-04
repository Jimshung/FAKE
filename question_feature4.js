//特徵四
var question_dict = ["?","什麼","誰","哪一個","嗎","呢","吧","啊","為何","如何","幾時","多少","多少錢","怎樣","怎麼","為何麼","難道","何嘗","何必","who","what","which","whose","when","where","how","why"];
/*
http://baike.baidu.com/view/720086.htm
汉语疑问编辑
现代汉语疑问词，由疑问代词、疑问语气词和疑问副词组成，主要有30个，与英语的分类不尽相同。
疑问代词主要有16个：
1、问事物、时间、处所和数量的主要有8个：谁、何、什么，哪儿、哪里，几时、几、多少
2、问方式、性状和原因的主要有8个：怎、怎么、怎的、怎样、怎么样、怎么着、如何、为什么
语气词主要有4个：吗、呢、吧、啊
疑问副词主要有10个：难道、岂、居然、竟然、究竟、简直、难怪、反倒、何尝、何必
*/

var article = [["以","情緒","詞","為","基礎","之","情境","資訊","連結","與","誰"],
["以","情緒","詞","為","自在","之","情境","資訊","連結","與","觀察"],
["以","情緒","詞","為","基礎","之","冷靜","資訊","連結","與","觀察"],
["以","情緒","詞","為","基礎","之","情境","資訊","連結","與","觀察"],
["以","情緒","詞","為","基礎","之","情境","資訊","連結","與","?"],];

function intersection(a,b){
   var rs = [], x = a.length;
   while (x--) b.indexOf(a[x])!=-1 && rs.push(a[x]);
   return rs.sort();
}

var count_question = function(article,question_dict){
	var question_count = 0
	for(var i=0; i < article.length; i++){
		var sentence = article[i];
		if (intersection( sentence, question_dict).length > 0){
			question_count+= 1;
		}
	}
	return question_count / article.length;
}

console.log(count_question(article,question_dict));
