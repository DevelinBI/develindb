const express = require('express'),
router = express.Router();

//------------------ 1.  setup the interface collection connection.

var DocumentClient = require('documentdb').DocumentClient;
[KEYS]
var client = new DocumentClient(host, {masterKey: masterKey});

var databaseDefinition = { id: "clientDb" };
var dbLink = 'dbs/' + databaseDefinition.id;



//--------------  2. populate the index page on refresh.

router.post("/refresh", function (req, resp) {

	var collLink = dbLink + '/colls/' + 'interface-col';
	var input = req.body;
	console.log('POST refresh: ' + JSON.stringify(input)); 
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



//-------------- 3.  New data source to be added to the interface collection.

router.post('/newdatasource', (req, resp) => {
	
	var collLink = dbLink + '/colls/' + 'interface-col';
	var input = req.body;
	console.log('POST new source: ' + JSON.stringify(input)); 
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

								input.count = count;
								
								//Check that the name is unique
								var querySpec = {
									query: "SELECT MAX(i.count) FROM docs i WHERE  i.company = '" + company + "' AND i.name = '" + name + "'"
								};
								client.queryDocuments(collLink, querySpec).toArray(function (err, namecheck) {
									if(Object.keys(namecheck[0]).length  !== 0)
									{										
										input.name = name + '-' + count;
										console.log('here: ' + input.name)
										
										//Create the meta record								
										console.log ("Creating new name: " + JSON.stringify(input));									
								
										client.createDocument(collLink, input, function (err, document) {
											if (err) {
												console.log("Error creating document: " + JSON.stringify(err));
											} 
										});

										//Send the response to open the set up page for the interface in question
										resp.writeHead(200, {"Content-Type": "text/plain"});
										resp.end(JSON.stringify(input));		
									}
									
									else
									{										
										console.log ("Creating existing name: " + JSON.stringify(input));
										client.createDocument(collLink, input, function (err, document) {											
											if (err) {
												console.log("Error creating document: " + JSON.stringify(err));
											} 
										});											

										//Send the response to open the set up page for the interface in question
										resp.writeHead(200, {"Content-Type": "text/plain"});
										resp.end(JSON.stringify(input));
									}		
									
								});										
							
							} 
				});		
		}
	else
		{			
			resp.writeHead(200, {"Content-Type": "text/plain"});
			resp.end('No text entered');			
		} 	
});



//-------------- 4.  Open data source to edit the details of a particular interface  --- NOT USED AT PRESENT

router.post('/opendatasource', (req, resp) => {
	
	var collLink = dbLink + '/colls/' + 'interface-col';
	var input = req.body;
	console.log('POST open source: ' + JSON.stringify(input)); 
	var company = input.company;
	var source = input.source;
	var name = input.name;	

});


//-------------- 5. delete a data source

router.post('/deldatasource', (req, resp) => {
	
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
					
					if(results[0] !== null)
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


//=================  FREEAGENT ================================================================

//-------------- 1. Cycles through the JSON file containing FreeAgent token authorisation guidance

router.post('/fa-steps', (req, resp) => {
	
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


//-----------------  TOKENS --------------------------------------------------------------------

//--------------- 1. Freeagent - Receives token submission

router.post('/fa-token-submit', (req, resp) => {
	
	var collLink = dbLink + '/colls/' + 'token-col';
	var input = req.body;
	console.log('POST new token: ' + JSON.stringify(input)); 
	var company = input.company;
	var source = input.source;
	var name = input.name;	

	  if (input.length!==0)
		 {				
				//Check if there is already a token record in place
				var querySpec = {
					query: "SELECT i.id FROM docs i WHERE  i.company = '" + company + "' AND i.source = '" + source + "' AND i.name = '" + name + "'"
				};	

				client.queryDocuments(collLink, querySpec).toArray(function (err, results) {		

					if (err) {
								console.log("Error locating token documents: " + JSON.stringify(err));
							} 					
					else  
							{
								if(typeof results[0] !== 'undefined')
								{
									//Token string already in place so delete it in order to replace it		
									var docLink = collLink + '/docs/' + results[0].id;										
									client.deleteDocument(docLink, function (err) 
									{
										if(err)
											{
												console.log('Error deleting the old token document: ' + JSON.stringify(err));
											}										
										else
											{
												console.log('Token document deleted');
												
												client.createDocument(collLink, input, function (err, document) {											
													if (err) {
														console.log("Error creating token document: " + JSON.stringify(err));
													}
													else{
														resp.writeHead(200, {"Content-Type": "text/plain"});
														resp.end('Token submitted');
													}													
												});	
											
											}
									});
									
								}
								else	
								{								
									client.createDocument(collLink, input, function (err, document) {											
										if (err) {
											console.log("Error creating token document: " + JSON.stringify(err));
										}
										else{
											resp.writeHead(200, {"Content-Type": "text/plain"});
											resp.end('Token submitted');
										}
									});
								}	
							} 
				});		
		}
	else
		{			
			resp.writeHead(200, {"Content-Type": "text/plain"});
			resp.end('No tokens received');			
		} 	
});


//--------------- 2. Freeagent - Refresh data

router.post('/fa-datarefresh', (req, resp) => {
	
	var collLink = dbLink + '/colls/' + 'token-col';
	var input = req.body;
	var company = input.company;
	var source = input.source;
	var name = input.name;

	console.log('input: ' + JSON.stringify(input)); 
	
	//Obtain the access token, and in case the access token has expired, the clientID and refresh tokens as well
	  if (input.length!==0)
		 {	
				var querySpec = {
					query: "SELECT i.accessToken, i.clientID, i.secretToken, i.refreshToken FROM docs i WHERE  i.company = '" + company + "' AND i.source = '" + source + "' AND i.name = '" + name + "'"
				};

				client.queryDocuments(collLink, querySpec).toArray(function (err, results) {		

					if (err) {
								console.log("Error locating token documents: " + JSON.stringify(err));
								resp.writeHead(200, {"Content-Type": "text/plain"});
								resp.end('Error locating token documents');
							} 					
					else  
							{
				
								if(typeof results[0] !== 'undefined')
								{									
									
									//An access token exists - use it to access FA data
									var accessToken = results[0].accessToken;
									var refreshToken = results[0].refreshToken;
									var clientID = results[0].clientID;
									var secretToken = results[0].secretToken;
									
									
									request(
											{											
											uri: 'https://api.freeagent.com/v2/company.json',
											method: 'POST',		
											headers: {
														'Authorization': 'Bearer ' + accessToken,
														'Content-Type': 'application/json;charset=UTF-8',
														'user-agent': 'google-oauth-playground'
													},
											redirect_uri: 'http://localhost:3000/'

											}, function (error, response, body) 
												
												{
													if(error){console.log('Error accessing data: ' + JSON.stringify(error));}
													else
													{
												
														//Check to see whether access token has expired
														if(response.body.search("Access token not recognised")!==-1)
														{															
														
															var faHeaders = {
															'Content-Type': 'application/x-www-form-urlencoded'
															};

															// Use the refresh token to get another access token
															var faOptions = {
															url: 'https://api.freeagent.com/v2/token_endpoint',
															method: 'POST',
															headers: faHeaders,
															form: {
																client_id: clientID,
																client_secret: secretToken,
																grant_type: 'refresh_token',
																refresh_token: refreshToken,
																redirect_uri: 'http://localhost:3000/'
																}
															};

															request.post(faOptions, function(err, response, body) {
																var body =  JSON.parse(body);
																console.log('access_token: ' + body.access_token);
																var accessToken =  body.access_token;																		
															
															
															//Upload the new access token to the database - can be an async action

																//Check if there is already a token record in place
																var querySpec = {
																	query: "SELECT i.id FROM docs i WHERE  i.company = '" + company + "' AND i.source = '" + source + "' AND i.name = '" + name + "'"
																};	

																//Extend the input string to include the new access token so that the input string can now be used to update the token collection
																input.accessToken = accessToken;
																input.refreshToken = refreshToken;
																input.clientID = clientID;
																input.secretToken = secretToken;
																
																 client.queryDocuments(collLink, querySpec).toArray(function (err, results) {		

																	if (err) {
																				console.log("Error locating token documents: " + JSON.stringify(err));
																			} 					
																	else  
																			{
																				if(typeof results[0] !== 'undefined')
																				{
																					//Token string already in place so delete it in order to replace it		
																					var docLink = collLink + '/docs/' + results[0].id;										
																					client.deleteDocument(docLink, function (err) 
																					{
																						if(err)
																							{
																								console.log('Error deleting the old token document: ' + JSON.stringify(err));
																							}										
																						else
																							{
																								
																								client.createDocument(collLink, input, function (err, document) {											
																									if (err) {
																										console.log("Error creating token document: " + JSON.stringify(err));
																									}
																								});	
																							
																							}
																					});
																					
																				}
																				else	
																				{								
																					client.createDocument(collLink, input, function (err, document) {											
																						if (err) {
																							console.log("Error creating token document: " + JSON.stringify(err));
																						}
																					});
																				}	
																			} 
																});	 	

															//Use the access token to obtain the data - can be an async action															
																faRefresh(accessToken);					
															}); 
														}												
														else
														{
															//Access token was valid so refresh the FA data
															faRefresh(accessToken);
															
														}
													}
												}
										);
																		
								}
								else	
								{	
									console.log("No token found: " + results[0]);
									resp.writeHead(200, {"Content-Type": "text/plain"});
									resp.end('Access token not available');

								}	
							} 
				});		
		}
	else
		{			
			resp.writeHead(200, {"Content-Type": "text/plain"});
			resp.end('Information missing from the refresh request');			
		} 		
	


});


function faRefresh(accessToken){	
		request(
		{											
			uri: 'https://api.freeagent.com/v2/company.json',
			method: 'POST',		
			headers: {
						'Authorization': 'Bearer ' + accessToken,
						'Content-Type': 'application/json;charset=UTF-8',
						'user-agent': 'google-oauth-playground'
					},
			redirect_uri: 'http://localhost:3000/'
	
		}, function (error, response, body) 

		{
			
			if(error){'Error accessing data: ' + JSON.stringify(error);}																
			else
			{																	
				console.log('Data response: ' + body);
			}																
		
		});
	
}


//=================  EXCEL ================================================================

//--------------- 1. Loads the current excel path and range

router.post('/xl-pageLoad', (req, resp) => {
	
	var collLink = dbLink + '/colls/' + 'excel-col';
	var input = req.body;
	console.log('Loads current excel range: ' + JSON.stringify(input)); 
	var company = input.company;
	var source = input.source;
	var sourceName = input.sourceName;
	var path, name, range;

	  if (input.length!==0)
		 {				
				//Obtains the range record in place
				var querySpec = {
					query: "SELECT i.path, i.name, i.range FROM docs i WHERE  i.company = '" + company + "' AND i.source = '" + source + "' AND i.sourceName = '" + sourceName + "'"
				};	

				client.queryDocuments(collLink, querySpec).toArray(function (err, results) {		

					if (err) {
								console.log("Error locating excel documents: " + JSON.stringify(err));
							} 					
					else  
							{

								if(typeof results[0] !== 'undefined')
								{
									path = results[0].path;
									name = results[0].name;
									range = results[0].range;

									resp.writeHead(200, {"Content-Type": "text/plain"});
									resp.end(JSON.stringify(results));									
								}
								else	
								{								
									resp.writeHead(200, {"Content-Type": "text/plain"});
									resp.end('No excel information received');			
								}	
							} 
				});		
		}
	else
		{			
			resp.writeHead(200, {"Content-Type": "text/plain"});
			resp.end('No excel information received');			
		} 	
});

//--------------- 2. Uploads revisions to the excel path name and source

router.post('/xl-sourceUpdate', (req, resp) => {
	
	var collLink = dbLink + '/colls/' + 'excel-col';
	var input = req.body;
	console.log('POST new excel range: ' + JSON.stringify(input)); 
	var company = input.company;
	var source = input.source;
	var sourceName = input.sourceName;
	var path = input.path;
	var name = input.name;
	var range = input.range;	

	  if (input.length!==0)
		 {				
				//Check if there is already a range record in place
				var querySpec = {
					query: "SELECT i.id FROM docs i WHERE  i.company = '" + company + "' AND i.source = '" + source + "' AND i.sourceName = '" + sourceName + "'"
				};	

				client.queryDocuments(collLink, querySpec).toArray(function (err, results) {		

					if (err) {
								console.log("Error locating excel documents: " + JSON.stringify(err));
							} 					
					else  
							{
								if(typeof results[0] !== 'undefined')
								{
									//range document already in place so delete it in order to replace it		
									var docLink = collLink + '/docs/' + results[0].id;										
									client.deleteDocument(docLink, function (err) 
									{
										if(err)
											{
												console.log('Error deleting the old excel document: ' + JSON.stringify(err));
											}										
										else
											{
												console.log('Excel document deleted');
												
												client.createDocument(collLink, input, function (err, document) {											
													if (err) {
														console.log("Error creating excel document: " + JSON.stringify(err));
													}
													else{
														resp.writeHead(200, {"Content-Type": "text/plain"});
														resp.end('Excel source workbook submitted');
													}													
												});	
											
											}
									});
									
								}
								else	
								{								
									client.createDocument(collLink, input, function (err, document) {											
										if (err) {
											console.log("Error creating excel document: " + JSON.stringify(err));
										}
										else{
											resp.writeHead(200, {"Content-Type": "text/plain"});
											resp.end('Excel source workbook submitted');
										}
									});
								}	
							} 
				});		
		}
	else
		{			
			resp.writeHead(200, {"Content-Type": "text/plain"});
			resp.end('No excel information received');			
		} 	
});


//--------------- 3. Upload data from spreadsheet to database

router.post('/xl-dataUpload', (req, resp) => {
	
	
	var collLink = dbLink + '/colls/' + 'excel-col';
	var input = req.body;	
	console.log('Perform the data refresh: ' + JSON.stringify(input));
	var company = input.company;
	var source = input.source;
	var sourceName = input.sourceName;
	var path = input.path;
	var name = input.name;
	var range = input.range;

	   if (input.length!==0)
		 {	
	 
			var path = __dirname + '/batch/testbatch.bat';
			path = path.replace(/\\/g, "/");

			const spawn = require('child_process').spawn;
			const bat = spawn('cmd.exe', ['/c', path]);


			// Handle normal output
			bat.stdout.on('data', (data) => {
				// Convert the Uint8Array to a readable string.
				var str = String.fromCharCode.apply(null, data);
				console.info(str);
			});

			// Handle error output
			bat.stderr.on('data', (data) => {
				// Convert the Uint8Array to a readable string.
				var str = String.fromCharCode.apply(null, data);
				console.error(str);
			}); 

			// Handle on exit event
			bat.on('exit', (code) => {
				var preText = `Batch exited with code ${code} : `;

				switch(code){
					case 0:
						console.info(preText+"Something unknown happened executing the batch.");
					break;
					case 1:
						console.info(preText+"Batch completed");
						excelUpload()
					break;
					case 2:
						console.info(preText+"The file doesn't exists and now is created");
					break;
					case 3:
						console.info(preText+"An error ocurred while creating the file");
					break;
				}
			});  
	 
				
	
		 }
		 
		 resp.end();
		 
		 
});

function excelUpload(){
	
	var xlsxj = require("xlsx-to-json");
	xlsxj({
			input: '../develindb/data/pmt_example.xlsx', 
			output: "output.json",
			sheet: "Sheet1"
		}, function(err, result) 
		{
			if(err) {
			console.error('Error reading file: ' + err);
			}
			else {
			console.log(result);
			}
		});
	
}


//============================================================================================
//exporting thee router to other modules
module.exports = router;