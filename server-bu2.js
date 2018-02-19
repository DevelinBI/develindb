
const express = require('express')
const app = express()

var port = process.env.port || 3000;

require('dotenv').load({ silent: true });
var cfenv = require("cfenv");
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');
var request = require("request")


//--------------  set up the cosmos db npm requirements
var DocumentClient = require('documentdb').DocumentClient;
var host = "https://develindb.documents.azure.com:443/";                     // Add your endpoint
var masterKey = "XwOJ5m9wao57sUj7d1rzdv6Fx9xPrR0C2M0cI6JGWyI4SJ0XW1CwdSrvAwHxDqK2npaPifCALNlIJu2fmTYeGA==";  // This is the primary key from the set of keys
var client = new DocumentClient(host, {masterKey: masterKey});

var databaseDefinition = { id: "clientDb" };
var collectionDefinition = { id: "clientdb-coll" };
var documentDefinition;



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


//------------- Source Data
var url = "http://chargepoints.dft.gov.uk/api/retrieve/registry/format/json/postcode/MK11+1HX/limit/2/";
var JSONarray = [];

request({
    url: url,
    json: true
}, function (error, response, body) {

    if (!error && response.statusCode === 200) {
        documentDefinition = body.ChargeDevice[1].ChargeDeviceId;
		console.log(documentDefinition)
    }
	/* console.log("response: " + JSON.stringify(response));
	console.log("error: " + error);
	console.log("body: " + body); */
})


//------------- create the database content
 /* client.createDatabase(databaseDefinition, function(err, database) {
    if(err) return console.log(err);
    console.log('created db');

    client.createCollection(database._self, collectionDefinition, function(err, collection) {
        if(err) return console.log(err);
        console.log('created collection');

        client.createDocument(collection._self, documentDefinition, function(err, document) {
            if(err) return console.log(err);
            console.log('Created Document with content: ', document.content);

            //cleanup(client, database);
        });
    });
});  */

/* function cleanup(client, database) {
    client.deleteDatabase(database._self, function(err) {
        if(err) console.log(err);
    })
} */

//------------- add documents to the database
/* var databaseId = "clientDb";
var collectionId = "clientdb-coll";
var dbLink = 'dbs/' + databaseId;
var collLink = dbLink + '/colls/' + collectionId;

 
client.createDocument(collLink, documentDefinition, function (err, document) {
	if (err) {
		console.log(err);

	} else {
		console.log('created ' + document.id);
	}
}); */

