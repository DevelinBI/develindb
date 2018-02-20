

 
  
  var xlsxj = require("xlsx-to-json");
  xlsxj({
    input: '../develindb/test/sample.xlsx', 
    output: "output.json",
	sheet: "Sheet1"
  }, function(err, result) {
    if(err) {
      console.error(err);
    }else {
      console.log(result);
    }
  });