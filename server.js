
const express = require('express')
const app = express()
//const port = 8080
//const port = 3000
var port = process.env.port || 3000;

require('dotenv').load({ silent: true });
var cfenv = require("cfenv");

var bodyParser = require('body-parser');
var path = require('path');

var fs = require('fs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
  

//---------------  set the server to listen
app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})



//-------------- receives text item and stores the result in the cloud
app.post('/getstring', (req, resp) => {
	console.log('button pressed');
	
	var search_word = req.body.txtstring;
	
	if (search_word.length!==0){
		resp.writeHead(200, {"Content-Type": "text/plain"});
		resp.end('Text entered');
		console.log("Text received");
		}
	else{
		
		resp.writeHead(200, {"Content-Type": "text/plain"});
		resp.end('No text entered');
		console.log("No text received");
	}
	
});
//---------------------------------------------------





