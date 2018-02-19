
const express = require('express')
const app = express()

var port = process.env.port || 3000;

require('dotenv').load({ silent: true });
var cfenv = require("cfenv");
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');
var request = require("request")

//var data_chargePoint = require("./js/data_chargePoint.js");



//---------------  set the server to listen
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})



//-------------- receives control items and confirms receipt
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

require("./js/data_chargePoint.js");

//--------------  set up the cosmos db npm requirements
/* var DocumentClient = require('documentdb').DocumentClient;
var host = "https://develindb.documents.azure.com:443/";                     // Add your endpoint
var masterKey = "XwOJ5m9wao57sUj7d1rzdv6Fx9xPrR0C2M0cI6JGWyI4SJ0XW1CwdSrvAwHxDqK2npaPifCALNlIJu2fmTYeGA==";  // This is the primary key from the set of keys
var client = new DocumentClient(host, {masterKey: masterKey});

var databaseDefinition = { id: "clientDb" };
var collectionDefinition = { id: "clientdb-coll" };
var dbLink = 'dbs/' + databaseDefinition.id;
var collLink = dbLink + '/colls/' + collectionDefinition.id;
var documentDefinition = { "id": "hello world doc2", "content": "Hello World!" };


//------------- Source Data
var url = "http://chargepoints.dft.gov.uk/api/retrieve/registry/format/json/postcode/MK11+1HX/limit/10/";
var Tarray = [];

request({
    url: url,
    json: true
}, function (error, response, body) {

    if (!error && response.statusCode === 200) {
        
		
		//-----------------  Build the source data array
		 for (k = 0; k < body.ChargeDevice.length; k++) { 
		
			var Tstr = {};
			Tstr.Deviceid = body.ChargeDevice[k].ChargeDeviceId;
			Tstr.ChargeDeviceRef = body.ChargeDevice[k].ChargeDeviceRef;
			Tarray.push(Tstr);

			//console.log(JSON.stringify(Tstr));
		} 
		
		console.log('Initial array: ' + JSON.stringify(Tarray));

		//-------------------  delete the old collection and create a new one
		client.readCollection(collLink, (err, result) => {
					if (err) 
						{
							if (err.code == 404) 
								{
								console.log('Collection not found');
								createCollection();
								}
							else
								{
								console.log('Error from check before delete - stopping: ' + JSON.stringify(err));
								return;
								}
						}
					else 
						{
								client.deleteCollection(collLink, function(err, collection) {
									if(err) 
										{
											console.log('Deletion error - stopping: ' + JSON.stringify(err));
											return;
										}
									else
										{
											console.log('deleted collection');
											createCollection();
										}
								});
								
						}	
		});					
		
		//------------------  create a new collection
		
		function createCollection(){
			
			client.createCollection(dbLink, collectionDefinition, { offerThroughput: 400 }, function(err, collection) {
				if(err) 
					{
						console.log('Problem creating collection - stopping: ' + JSON.stringify(err));
						return;
					}
				else
					{
						console.log('created collection');
						for (k = 0; k < Tarray.length; k++) { 

						
							client.createDocument(collLink, Tarray[k], function (err, document) {
								if (err) {
									console.log('Problem creating a document: ' + JSON.stringify(Tarray[k]));
								} 
							}); 

						}
						console.log('uploaded documents');
					}
			}); 
		}
		

	}

	
}); */




