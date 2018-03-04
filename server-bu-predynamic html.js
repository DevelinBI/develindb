
const express = require('express')
const app = express()

var port = process.env.port || 3000;

require('dotenv').load({ silent: true });
var cfenv = require("cfenv");
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');
var request = require("request");


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


//require("./js/data_freeagent_AuthRequest.js");
//require("./js/data_freeagent_TokenRequest.js");
//require("./js/data_freeagent_TokenUse.js");



//------------------ setup the interface collection connection
var DocumentClient = require('documentdb').DocumentClient;
var host = "https://develindb.documents.azure.com:443/";                     
var masterKey = "XwOJ5m9wao57sUj7d1rzdv6Fx9xPrR0C2M0cI6JGWyI4SJ0XW1CwdSrvAwHxDqK2npaPifCALNlIJu2fmTYeGA==";  
var client = new DocumentClient(host, {masterKey: masterKey});

var databaseDefinition = { id: "clientDb" };
var collectionDefinition = { id: "interface-col" };
var dbLink = 'dbs/' + databaseDefinition.id;
var collLink = dbLink + '/colls/' + collectionDefinition.id;




//-------------- receives control items and confirms receipt
app.post('/submitstring', (req, resp) => {
	
	var txt_box1 = req.body.txtstring;
	var id='box1';
	var input = txt_box1;
	
	if (txt_box1.length!==0)
		{
				var jsonText = {id:id,type:input};
				
				//Check if exists
				var querySpec = {
					query: "SELECT * FROM docs i WHERE  i.id = 'box1'",
				};	

				client.queryDocuments(collLink, querySpec).toArray(function (err, results) {		

					if (err) {
								console.log("Error returning the document: " + JSON.stringify(err));

							} 
					else if (results.length == 0) 
							{
								//Create the record
								console.log ("No documents found matching");
								client.createDocument(collLink, jsonText, function (err, document) {
									if (err) {
										console.log("Error creating document: " + JSON.stringify(err));
									} 
								});
								var progMsg = "created " + JSON.stringify(jsonText); 
								console.log(progMsg);
							} 
					else  
							{
								//Replace the record
								client.replaceDocument(collLink + '/docs/' + id, jsonText, function (err, updated) {
									if (err) 
									{
										console.log("Error replacing the document: " + JSON.stringify(err));

									}
								});
								var progMsg = "Replaced: " + JSON.stringify(jsonText); 
								console.log(progMsg);
								resp.writeHead(200, {"Content-Type": "text/plain"});
								resp.end('Text updated');

							}
				});									
												
			
			
		}
	else
		{
			
			resp.writeHead(200, {"Content-Type": "text/plain"});
			resp.end('No text entered');
			
		}
	
});

//-------------- refreshes the index page
app.get('/refreshstring', (req, resp) => {
	
				var querySpec = {
					query: "SELECT * FROM docs i WHERE  i.id = 'box1'",
				};
				
				client.queryDocuments(collLink, querySpec).toArray(function (err, results) {		

					if (err) {
								console.log("Error returning the document: " + JSON.stringify(err));

							} 

					else if (results.length == 1)
							{

								resp.writeHead(200, {"Content-Type": "text/plain"});
								resp.end('Result: ' + JSON.stringify(results));

							}
				});		
	
	
	
});


//-------------- requests FreeAgent token
app.get('/freeagent', (req, resp) => {


	
	  request(

			{
			
				uri: 'https://api.freeagent.com/v2/token_endpoint',
				method: 'POST',
				client_id: 'MyeuHkExlC8nJrdx6mTDyA',
				client_secret: 'JJihUFZ1YyiOyk-woxQcFQ',
				grant_type: 'authorization_code',
				response_type: 'code',
				headers: {					
							'Accept': 'application/json',
							'Content-Type': 'application/json'							
						},
				redirect_uri: 'https://localhost:3000/',
				access_type: 'offline',
				scope: 'some text'

			}, function (error, response, body) 
				{
			
					console.log('response: ' +  JSON.stringify(response));
					console.log('body: ' + body);
					
					resp.writeHead(200, {"Content-Type": "text/plain"});
					resp.end(body);
			
				}
		);		  
			
	
});













