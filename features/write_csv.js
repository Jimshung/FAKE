var fs = require('fs');
var stream = fs.createWriteStream("result.csv");

var values=[
[1.2,1.3,2.5,3.2],
[0.3,2.1,1.4,5.2],
[0.2,1.3,3.5,3.3],
[0.9,1.1,3.5,3.3],
[0.7,3.3,4.5,3.3],
[0.5,0.1,2.1,1.2],
];
console.log(0);

var file_content =""

for(var i=0; i<values.length; i++){
	for(var j=0; j<values[i].length;j++){
			console.log("val:",values[i][j]);
		  	file_content += values[i][j].toString();
		  	if(j<values[i].length -1){
				file_content += ", ";
			}
	}
	file_content += "\n";
}


fs.writeFile('helloworld.csv', file_content, function (err) {
    if (err) 
        return console.log(err);
    console.log('file_content > helloworld.csv');
});


/*
jimwu-3:features jim$ node write_csv.js 
0
val: 1.2
val: 1.3
val: 2.5
val: 3.2
val: 0.3
val: 2.1
val: 1.4
val: 5.2
val: 0.2
val: 1.3
val: 3.5
val: 3.3
val: 0.9
val: 1.1
val: 3.5
val: 3.3
val: 0.7
val: 3.3
val: 4.5
val: 3.3
val: 0.5
val: 0.1
val: 2.1
val: 1.2
file_content > helloworld.csv
jimwu-3:features jim$ vim helloworld.csv 
*/