
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
[keys here]  
var client = new DocumentClient(host, {masterKey: masterKey});

var databaseDefinition = { id: "clientDb" };
var dbLink = 'dbs/' + databaseDefinition.id;


//--------------populate the index page on refresh
app.post("/refresh", function (req, resp) {

	var collLink = dbLink + '/colls/' + 'interface-col';
	var input = req.body;
	console.log(input); 
	var company = input.company;
	
	//Call down the documents from the interface collection
	var querySpec = 
	{
		query: "SELECT i.company, i.name, i.source as source, i.count as count FROM docs i WHERE  i.company = '" + company + "'"
	};

	client.queryDocuments(collLink, querySpec).toArray(function (err, results) {		

	if (err) {
				console.log("Error returning the document: " + JSON.stringify(err));
			} 
	
	else  
			{
				//Check to see whether there is already a record of the datasource of the type and company in question
				console.log("Empty recordset 1: " + JSON.stringify(results));
				 if(results[0] == null)
				{
					console.log("Empty recordset 2: " + JSON.stringify(err))
					resp.writeHead(200, {"Content-Type": "text/plain"});
					resp.end('empty');
				}					

				else
				{
					resp.writeHead(200, {"Content-Type": "text/plain"});
					resp.end(JSON.stringify(results));
				} 
			}

	});					

});


//-------------- New data source to be added to the interface.  Once added there is no return back from the database.  The POST return simply triggers a refresh of the index page which is the action that brings the contents of the interface collection down
app.post('/newdatasource', (req, resp) => {
	
	var collLink = dbLink + '/colls/' + 'interface-col';
	var input = req.body;
	console.log(input); 
	var company = input.company;
	var source = input.source;
	var name = input.name;
	var count = 1;
	
	//---- establish the next id for the type of interface required
	//structure for the metadata interface is:  { company: 'Company AAA', source: 'quickbooks', count: 0 }  within collection interface-col
	
	 if (input.length!==0)
		 {				
				//Check if the type of source exists for the company in question
				var querySpec = {
					query: "SELECT MAX(i.count) FROM docs i WHERE  i.company = '" + company + "' AND i.source = '" + source + "'"
				};	

				client.queryDocuments(collLink, querySpec).toArray(function (err, results) {		

					if (err) {
								console.log("Error returning the document: " + JSON.stringify(err));
							} 
					//Either there is no reference to the data source for the company, therefore the code creates one - with the count figure at 1.  Or there is a max count in which case the code creates a document with count++
					else  
							{
								//Check to see whether there is already a record of the datasource of the type and company in question
								if(Object.keys(results[0]).length  == 0)
								{
									console.log("{}result: " + JSON.stringify(results));
									count=1;
								}
								
								//If so increment the count by one
								else
								{
									console.log("{..}result: " + JSON.stringify(results));
									count = Number(results[0].$1) + 1;																		
								}								

								
								//Check that the name is unique
								var querySpec = {
									query: "SELECT MAX(i.count) FROM docs i WHERE  i.company = '" + company + "' AND i.name = '" + name + "'"
								};
								client.queryDocuments(collLink, querySpec).toArray(function (err, namecheck) {
									if(Object.keys(namecheck[0]).length  !== 0)
									{
										
										input.name = name + '-' + count;
										console.log('here: ' + input.name)
									}
								});
								
								//Create the record
								input.count = count;
								console.log ("Creating: " + JSON.stringify(input));									
								
								client.createDocument(collLink, input, function (err, document) {
									if (err) {
										console.log("Error creating document: " + JSON.stringify(err));
									} 
								});
								resp.writeHead(200, {"Content-Type": "text/plain"});
								resp.end('reload');							
							
							} 
				});		
		}
	else
		{			
			resp.writeHead(200, {"Content-Type": "text/plain"});
			resp.end('No text entered');			
		} 	
});

//-------------- delete data source
app.post('/deldatasource', (req, resp) => {
	
	var collLink = dbLink + '/colls/' + 'interface-col';
	var company = req.body.company;
	var name = req.body.name;
	console.log('delete source: ' + company + ' : ' + name);

	 if (name.length!==0)
		{				
				//Establish id for the named source to be deleted
				var querySpec = {
					query: "SELECT i.id FROM docs i WHERE  i.company = '" + company + "' AND i.name = '" + name + "'"
				};	

				client.queryDocuments(collLink, querySpec).toArray(function (err, results) {
					
					if(Object.keys(results[0]).length  !== 0)
						{
							for (let j = 0; j < Object.keys(results[0]).length; j++) {	
								
					
									var docLink = collLink + '/docs/' + results[j].id;
									client.deleteDocument(docLink, function (err) 
									{
										if(err)
											{
											console.log('delete error: ' + JSON.stringify(err));
											}
										
										else
											{
											console.log('Source deleted');
											}
									});					
							}
						}
				});

		resp.writeHead(200, {"Content-Type": "text/plain"});
		resp.end('reload');
		}

});

//-------------- cycles through the JSON file containing FreeAgent token authorisation guidanc
app.post('/fa-steps', (req, resp) => {
	
	var txtResponse;
	var txtbox = req.body.txtstring;
	var steps = require("./json/fa-steps.json");
	if(txtbox=='0'){txtResponse = steps[0].s0;}
	if(txtbox=='1'){txtResponse = steps[1].s1;}
	if(txtbox=='2'){txtResponse = steps[2].s2;}
	if(txtbox=='3'){txtResponse = steps[3].s3;}
	if(txtbox=='4'){txtResponse = steps[4].s4;}
	if(txtbox=='5'){txtResponse = steps[5].s5;}
	if(txtbox=='6'){txtResponse = steps[6].s6;}
	resp.writeHead(200, {"Content-Type": "text/plain"});
	resp.end(txtResponse);

});




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
















