//特徵二
var question_dict = ["?","什麼","誰","哪一個"];

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
