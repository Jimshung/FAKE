//特徵三

var expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;
var urlPattern = new RegExp(expression);
var article1="然而不同htthttp://www.goo.gl/euYPYeuYPYM），就開發過程可能";
var article2="然而不同htt/goo.gl/euYPYM），就開發過程可能 ";
var article3="然而不同https://www.goo.gl/euYPYeuYPYM），就開發過程可能";

//detect the URL
var has_url = function(article,urlPattern){
	if( article.match(urlPattern)){
		return 1;
	}
	else{
		return 0;
	}
}

console.log(has_url(article1,urlPattern));
console.log(has_url(article2,urlPattern));
console.log(has_url(article3,urlPattern));
