//特徵一
var s = "昨晚 和 學弟們 有 一段 很 重要 的 話 沒 錄到 品牌 系統， 正好 尺寸 可以 說明 國內 這股 創業 風潮 最大 的 問題".split(" ");


var t = ["作業", "系統", "版本", "處理器", "品牌", "處理器", "型號", "主螢幕", "尺寸", "主相機", "畫素", "RAM", "記憶體", "ROM", "儲存", "空間", "電池", "容量"];

//計算字詞出現次數
//http://goo.gl/Jfkx8g
var count_word = function(s) {
    var counts = {};
    for (var i = 0; i < s.length; i++)
        counts[s[i]] = (counts[s[i]] + 1) || 1;
    return counts;
}

var s_count = count_word(s);
var t_count = count_word(t);

console.log(s_count);
console.log(t_count);

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
var vector_result = to_vector(s_count, t_count);
var s_array = vector_result[1];
var t_array = vector_result[2];
console.log(s_array);
console.log(t_array);



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

console.log("cosine similarity");
console.log(cosine_similarity(s_array, t_array));