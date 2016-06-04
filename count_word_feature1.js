//特徵一
var s = "昨晚 和 學弟們 有 一段 很 重要 的 話 沒 錄到 品牌 系統， 正好 尺寸 可以 說明 國內 這股 創業 風潮 最大 的 問題".split(" ");


var t = ["作業", "系統", "版本", "處理器", "品牌", "處理器", "型號", "主螢幕", "尺寸", "主相機", "畫素", "RAM", "記憶體", "ROM", "儲存", "空間", "電池", "容量"];


var t = ["尺寸", "重量", "SIM卡", "防水", "防塵", "螢幕", "技術", "作業系統", "處理器", "記憶體", "儲存空間", "記憶卡", "通訊協定", "雙卡雙待", "相機功能", "多媒體", "連結與網路", "感應器", "指紋辨識", "電池", "顏色", "其它"];
//計算字詞出現次數
//http://goo.gl/Jfkx8g



var count_word = function(s) {
    var counts = {};
    for (var i = 0; i < s.length; i++)
        counts[s[i]] = (counts[s[i]] + 1) || 1;
    return counts;
}

//get collection of keys in javascript dictionary
//http://goo.gl/jgh2SE
var to_vector = function(s_count, t_count) {
    var all_words = Array.from(new Set(Object.keys(s_count).concat(Object.keys(t_count))));
    //concat() Method 取array交集

    var s_array = new Array(all_words.length).fill(0);
    var t_array = new Array(all_words.length).fill(0);
    for (var i = 0; i < all_words.length; i++) {
        word = all_words[i];
        if (s_count[word]) {
            s_array[i] = s_count[word];
        }
        if (t_count[word]) {
            t_array[i] = t_count[word];
        }
    }
    return [all_words, s_array, t_array];
}

var cosine_similarity = function(a, b) {
    if (a.length != b.length) {
        console.log("error");
        return -1;
    }
    var sum_up = 0;
    var sum_asq = 0;
    var sum_bsq = 0;
    for (var i = 0; i < a.length; i++) {
        sum_up += a[i] * b[i];
        sum_asq += Math.pow(a[i], 2);
        sum_bsq += Math.pow(b[i], 2);
    }
    return sum_up / (Math.sqrt(sum_asq) * Math.sqrt(sum_bsq));
}

// console.log(cosine_similarity([1,2,3],[3,4,5]) );//0.9827076298239908
// console.log(cosine_similarity([1,2,3],[-3,4,5])); //0.7559289460184545 

function article_cosine_similarity(article, terms){
    var results = [];
    var t_count = count_word(terms);
    for(var i=0; i<article.length; i++){
        var s_count = count_word(article[i]);
        var vector_result = to_vector(s_count, t_count);
        var s_array = vector_result[1];
        var t_array = vector_result[2];
        var result_sim = cosine_similarity(s_array, t_array);
        results.push(result_sim);
    }
    return results;
}
console.log("cosine similarity");
console.log(article_cosine_similarity([s,s],t));

