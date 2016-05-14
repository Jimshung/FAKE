//特徵二
var emotion_dict = ["放鬆","自在","平和","冷靜","安慰"]

var article = [["以","情緒","詞","為","基礎","之","情境","資訊","連結","與","觀察"],
["以","情緒","詞","為","自在","之","情境","資訊","連結","與","觀察"],
["以","情緒","詞","為","基礎","之","冷靜","資訊","連結","與","觀察"],
["以","情緒","詞","為","基礎","之","情境","資訊","連結","與","觀察"],
["以","情緒","詞","為","基礎","之","情境","資訊","連結","與","觀察"],]

function intersection(a,b){
   var rs = [], x = a.length;
   while (x--) b.indexOf(a[x])!=-1 && rs.push(a[x]);
   return rs.sort();
}


var count_emotion = function(article,emotion_dict){
	var emotion_count = 0
	for(var i=0; i < article.length; i++){
		var sentence = article[i]
		if (intersection( sentence, emotion_dict).length > 0){
			emotion_count+= 1
		}
	}
	return emotion_count / article.length
}

console.log(count_emotion(article,emotion_dict))
