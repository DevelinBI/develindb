
exports.msg = function(id, input, err){
	
	
	//------------------ setup the interface collection connection
	var DocumentClient = require('documentdb').DocumentClient;
	var host = "https://develindb.documents.azure.com:443/";                     
	var masterKey = "XwOJ5m9wao57sUj7d1rzdv6Fx9xPrR0C2M0cI6JGWyI4SJ0XW1CwdSrvAwHxDqK2npaPifCALNlIJu2fmTYeGA==";  
	var client = new DocumentClient(host, {masterKey: masterKey});

	var databaseDefinition = { id: "clientDb" };
	var collectionDefinition = { id: "interface-col" };
	var dbLink = 'dbs/' + databaseDefinition.id;
	var collLink = dbLink + '/colls/' + collectionDefinition.id;
	
	var progMsg = "";
	
	
	//------------------- Check to see if the id already exists and then post the document to the dB
	
	
	//if(err){return "Error calling the function: " + err;}
	//else{
	
	

	var jsonText = {id:id,type:input};
	
	//Check if exists
	var querySpec = {
		query: "SELECT * FROM docs i WHERE  i.id = 'box1'",
	};	
	//---------------------------------------------------------------	

	
	var initializePromise = initialize();
	initializePromise.then(function(result) {
         console.log("Returned: " + result)
		 return result;
    }, function(err) {
        console.log("Initialise error: " + err);
	})

		
		function initialize() {

			return new Promise(function(resolve, reject) {
				// Do async job
				
				
				

									//-------------------------------------------------------------
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
														progMsg = "created " + JSON.stringify(jsonText); 
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
														progMsg = "Resolved: " + JSON.stringify(jsonText); 
														//console.log(progMsg);
														resolve(progMsg); //============

													}
										});
										
									//---------------------------------------------------
									
										
									//} else bracket
			
				})

		}

	
}

