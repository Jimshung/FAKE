var fs = require('fs');

fs.readFile('./dictionary/NTUSD/positive.txt', function(err, data) {
    if(err) throw err;
    var array = data.toString().split("\n");
        console.log(typeof array);

    for(i in array) {
        // console.log(typeof array[i]);
    }
});

