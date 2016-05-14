var cosine_similarity = function(a,b){
	if(a.length!=b.length){
		console.log("error");
		return -1;
	}
	var sum_up = 0;
	var sum_asq = 0;
	var sum_bsq = 0;
	for(var i=0; i< a.length; i++){
			sum_up+= a[i]*b[i];
			sum_asq+= Math.pow(a[i],2);
			sum_bsq+= Math.pow(b[i],2);
	}
	return sum_up / (Math.sqrt(sum_asq) * Math.sqrt(sum_bsq));
}

console.log(cosine_similarity([1,2,3],[3,4,5]) );//0.9827076298239908
console.log(cosine_similarity([1,2,3],[-3,4,5])); //0.7559289460184545 