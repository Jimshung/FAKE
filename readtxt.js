var fs = require('fs');

fs.readFile('./dictionary/phone_feature.txt', function(err, data) {
    if(err) throw err;
    var array = data.toString().split("\n");
        console.log(array);

    for(i in array) {
        // console.log(typeof array[i]);
    }
});

