
const express = require('express')
const app = express()

var port = process.env.port || 3000;

require('dotenv').load({ silent: true });
var cfenv = require("cfenv");
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');

var response = require("./js/interface.js");

//---------------  set the server to listen
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`);
})



//-------------- receives control items and confirms receipt
app.post('/submitstring', (req, resp) => {
	
	var txt_box1 = req.body.txtstring;
	
	if (txt_box1.length!==0)
		{
			resp.writeHead(200, {"Content-Type": "text/plain"});
			resp.end('Text entered');
			response.submitMsg("box1", txt_box1);
			
			
		}
	else
		{
			
			resp.writeHead(200, {"Content-Type": "text/plain"});
			resp.end('No text entered');
			
		}
	
});

//-------------- refreshes the index page
app.get('/refreshstring', (req, resp) => {
	
	
	
	
	
});

//require("./js/data_chargePoint.js");
//require("./js/data_local_excel.js");




