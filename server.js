
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

var publicDir = path.join(__dirname, 'public');


 /* app.get("/", function (req, resp) {

	var blocks = require('./html/blocks.json');	
	var html;
	var htmlArray=[];
	
	var blockcount = Object.keys(blocks).length;
	
	Object.keys(blocks).forEach(function(key) {

		fs.readFile('./html/' + blocks[key] + '.html',null, function(error, data){
			if(error){
				resp.writeHead(404, {"Content-Type": "text/plain"});
				resp.write('file not found');
			}
			else{					

				htmlArray.push(data);
				if(htmlArray.length==blockcount){

					htmlArray.sort();
					for (let j = 0; j < blockcount; j++) {	
		
						if(html == undefined){html = htmlArray[j];}
						else{
							html = html + htmlArray[j];
						}							
				
						if (j == blockcount - 1){
							
							fs.writeFile('./public/index.html', html, function (err) {
								if (err) {console.log(err);}
								else{
									resp.sendFile(path.join(publicDir, 'index.html'));
									app.use(express.static(path.join(__dirname, 'public')));
								}
							});
						}	
					}						
				}
			}	
		});
	});	
});   */

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


function newSource(type, err){
	
	//---------- Identify the location for the new code and read the max number in the index file that sits above this position
	
	
	
	
	
	
	
}




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


//-------------- New data source to be added to the interface
app.post('/newdatasource', (req, resp) => {
	var txt_box1 = req.body.txtstring;
	console.log(txt_box1);
	
});













