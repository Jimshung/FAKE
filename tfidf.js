//特徵二
// 一篇文章 一個sentence
var articles = [["以","以","以","情緒","詞","為","基礎","基礎","之","安慰","資訊","連結","與","觀察"],
["以","以","以","以","情緒","詞","為","自在","之","情境","資訊","連結","與","觀察"],
["以","情緒","詞","為","基礎","之","冷靜","資訊","連結","與","觀察"],
["以","情緒","詞","為","基礎","之","情境","資訊","連結","與","觀察","資訊","資訊"],
["你","情緒","詞","為","基礎","之","情境","情境","情境","情境","資訊","連結","我","觀察","a","b"],];

var df_dict = {};
var get_df = function(articles, idf_dict){
	for(var i=0; i<articles.length; i++){
		var sentence = articles[i];
		var temp_store = [];
		for(var j=0; j<sentence.length; j++){
			word = sentence[j];
			if( temp_store.indexOf(word) == -1){
				if (df_dict[word]){
					df_dict[word] +=1;
				} 
				else{
					df_dict[word] = 1;
				}
				//console.log("word",word)
				//console.log("tempstore",temp_store)
				temp_store.push(word);
			}
		}
	}
}
get_df(articles);
console.log(df_dict);
// i = word
// j = id
var tf_idf = function(id, word, articles, df_dict){
	var sentence = articles[id];
	var tf_n = 0;
	for(var i=0; i<sentence.length;i++){
		current_word = sentence[i];
		if(current_word == word){
			tf_n += 1;
		}
	}
console.log("sentence.length",sentence.length);
	console.log("word",word);
	console.log("tf",tf_n);
	if(df_dict[word]){
		return (tf_n/sentence.length) * Math.log((articles.length/df_dict[word])+1);
	}
	else{
		return (tf_n/sentence.length) * Math.log((articles.length/0.5)+1);
	}
}
console.log(tf_idf(4,"基礎",articles,df_dict));
// console.log(tf_idf(0,"基礎",articles,df_dict));
// console.log(tf_idf(0,"以",articles,df_dict));
