
const express = require('express')
const app = express()
//const port = 8080
const port = 3000

require('dotenv').load({ silent: true });
var cfenv = require("cfenv");

var bodyParser = require('body-parser');
var path = require('path');

var fs = require('fs');
var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');

var nlu = new NaturalLanguageUnderstandingV1({
  version_date: NaturalLanguageUnderstandingV1.VERSION_DATE_2017_02_27
});


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

//-------------- receives tweets for analysis
//var Tstr = {};
var Twit = require('twit'); //***
var config = require('./config')  //***



//-------------- receives tweet search term and stores the result in the cloud
app.post('/getstring', (req, resp) => {
	console.log('tweet button pressed');
	
	var search_word = req.body.txtstring;
	
	var Tarray = [];
	
	var date_start = 'Mon Dec 01 2017 07:00:00';
	var date_start_msec = Date.parse(date_start);

	//q: 'noths, NOTHS, not on the high street, notonthehighstreet, NOTONTHEHIGHSTREET, Notonthehighstreet',
	
	if (search_word.length!==0){

		var T = new Twit(config); 
		
		var params = {	q: 'NOTHS',
						result_type: 'recent',
						lang: 'en' ,
						until: '2018-01-16',
						count: 100
		};
			
		
		
		var tweet = "";
		T.get('search/tweets', params, searchedData);
	
	
		function searchedData(err, data, response) {
	
			for (k = 0; k < data.statuses.length; k++) { 
		
				//With each tweet, the following fields are pushed into the array such that it should hold every tweet captured under the count total.  The array acts as a buffer to get around the frequency limitation set by the cloudant account
				var Tstr = {};
				Tstr.lang = data.statuses[k].lang;
				Tstr.count = k + 1;
				Tstr.search_item = 'NOTHS';
				Tstr.screen_name = data.statuses[k].user.screen_name;
				Tstr.name = data.statuses[k].user.name;
				Tstr.friends = data.statuses[k].user.friends_count;
				Tstr.followers = data.statuses[k].user.followers_count;
				Tstr.created_at = data.statuses[k].created_at;				
				
				var screendate_msec = Date.parse(data.statuses[k].created_at);
				//var d = new Date(screendate);
				if (screendate_msec > date_start_msec){Tstr.include = 'yes';} else{Tstr.include = 'no';}
				//console.log('screen: ' + Tstr.include);

				Tstr.T_id = data.statuses[k].id;
				Tstr.text = data.statuses[k].text;
				tweet = data.statuses[k].text;
				Tarray.push(Tstr);
				console.log('k: ' + k);
				}

				//console.log('data: ' + JSON.stringify(data));
				console.log('array: ' + JSON.stringify(Tarray));
					
						var h = 0, array_items = Tarray.length;

						if(array_items>0){

								function array_read(){
								
									var tweet = Tarray[h].text,
									count = Tarray[h].count,
									search_term = Tarray[h].search_item,
									T_id  = Tarray[h].T_id,
									created_at = Tarray[h].created_at,
									name = Tarray[h].name,
									screen_name = Tarray[h].screen_name,
									friends = Tarray[h].friends,
									followers = Tarray[h].followers,
									include = Tstr.include,
									jsontxt = "", jsontxt_sent = "", jsontxt_emot = "";
									
									console.log('tweet: ' + tweet);

									if(include == 'yes' || include == 'no'){

										nlu.analyze({
											'text': tweet, 
											'features': {
												'concepts': {},
												'keywords': {},
												'sentiment': {},
												'emotion': {},
												},
											}, 	
											function(err, response) {
												 if (err)
													{console.log('error:', err);}
												 else
													{
										
														if(!mydb) {
															console.log("No database.");
															return;
														}

														//resp.writeHead(200, {"Content-Type": "text/plain"});
														//resp.end(JSON.stringify(response, null, 2)); 
														console.log("data analysed");	
														
														jsontxt_sent = {"tweet" : tweet , "count" : count , "search_term" : search_term , "T_id" : T_id , "created_at" : created_at , "name" : name , "screen_name" : screen_name , "friends" : friends , "followers" : followers , "focus" : "sentiment" , "score" : response.sentiment.document.score , "label" : response.sentiment.document.label };
														jsontxt_emot = {"tweet" : tweet , "count" : count , "search_term" : search_term , "T_id" : T_id , "created_at" : created_at , "name" : name , "screen_name" : screen_name , "friends" : friends , "followers" : followers , "focus" : "emotion" , "sadness" : response.emotion.document.emotion.sadness , "joy" : response.emotion.document.emotion.joy , "fear" : response.emotion.document.emotion.fear , "disgust" : response.emotion.document.emotion.disgust , "anger" : response.emotion.document.emotion.anger };

															
														mydb.insert(jsontxt_sent, function(err) {																		
															if (err) {
																return console.log('[mydb.insert] ', err.message);
															}
															else
															{console.log("Sentiment Database updated");}
														});															
													
													
														mydb.insert(jsontxt_emot, function(err) {																		
															if (err) {
																return console.log('[mydb.insert] ', err.message);
															}
															else
															{console.log("Emotion Database updated");}
														});
																															

														
														var i = 0, iterations = response.keywords.length;																
														function dbUpdate1() {

															jsontxt = {"count" : count ,"search_term" : search_term , "T_id" : T_id , "created_at" : created_at , "focus" : "keywords" , "text" : response.keywords[i].text , "relevance" : response.keywords[i].relevance };
															
															mydb.insert(jsontxt, function(err) {																		
																if (err) {
																	return console.log('[mydb.insert] ', err.message);
																}
																else
																{console.log("1 Database updated");}
															});

															i++;
															
															if( i < iterations ){																		
																setTimeout( dbUpdate1, 500 );
															}
															
															
															
															  else{
																

																	if (typeof response.concepts.length !== 'undefined') {
																		var j = 0, iterations2 = response.concepts.length;
																		function dbUpdate2() {

																			if(typeof response.concepts[j] !== 'undefined'){
																			
																				jsontxt = {"count" : count , "search_term" : search_term , "T_id" : T_id , "created_at" : created_at , "focus" : "concepts" , "text" : response.concepts[j].text , "relevance" : response.concepts[j].relevance };
																					
																				mydb.insert(jsontxt, function(err) {
																					if (err) {
																						return console.log('[mydb.insert] ', err.message);
																					}
																					else
																					{console.log("2 Database updated");}
																				});
																			}
																			

																			j++;
																			if( j < iterations2 ){
																				setTimeout( dbUpdate2, 500 );
																			}
																		}
																		dbUpdate2(); 
																	}

																}  		  		 	  										
															
														}
														if (iterations > 0){dbUpdate1()};


													}

											}
										
										);

									}
									
									h++;
									if( h < array_items ){										
										setTimeout( array_read, 200 );
									}
												
							
								}
								array_read();
								
						}
						else{console.log('zero array length'); return;}
			}

		}
	else{
		
		resp.writeHead(200, {"Content-Type": "text/plain"});
		resp.end('No text entered');
		console.log("No data received");
	}
	
});
//---------------------------------------------------








//-------------- receives text for analysis and responds - else sends a message back that no text has been received
app.post('/getstring_bu', (req, resp) => {
	console.log('button pressed');
	
	var data = req.body.txtstring;
	var jsontxt = "";
	
	if (data.length!==0){

		nlu.analyze({
		  'html': data, 
		  'features': {
			'concepts': {},
			'keywords': {},
		  }
		}, function(err, response) {
			 if (err)
				{console.log('error:', err);}
			 else
			 {
	
				if(!mydb) {
					console.log("No database.");
					return;
				}

				resp.writeHead(200, {"Content-Type": "text/plain"});
				resp.end(JSON.stringify(response, null, 2));
				console.log("data received");			


				var i = 0, iterations = response.keywords.length;
				function dbUpdate1() {

					jsontxt = {"focus" : "keywords" , "text" : response.keywords[i].text , "relevance" : response.keywords[i].relevance };
					mydb.insert(jsontxt, function(err, body, header) {
						if (err) {
							return console.log('[mydb.insert] ', err.message);
						}
						else
						{console.log("1 Database updated");}
					});

					i++;
					if( i < iterations ){
						setTimeout( dbUpdate1, 200 );
					}
					
 					else{
						

 							var j = 0, iterations2 = response.concepts.length;
							function dbUpdate2() {

								jsontxt = {"focus" : "concepts" , "text" : response.concepts[j].text , "relevance" : response.concepts[j].relevance };
								mydb.insert(jsontxt, function(err, body, header) {
									if (err) {
										return console.log('[mydb.insert] ', err.message);
									}
									else
									{console.log("2 Database updated");}
								});

								j++;
								if( j < iterations2 ){
									setTimeout( dbUpdate2, 200 );
								}
							}
							if (iterations2 > 0){dbUpdate2()}; 

						}  					
					
				}
				if (iterations > 0){dbUpdate1()};

			}
		});
		
	}
	else{
		
		resp.writeHead(200, {"Content-Type": "text/plain"});
		resp.end('No text entered');
		console.log("No data received");
	}
});
//---------------------------------------------------





//--------------------- load local VCAP configuration  and service credentials
var vcapLocal;
try {
  vcapLocal = require('./vcap-local.json');
  console.log("Loaded local VCAP", vcapLocal);
} catch (e) { }

const appEnvOpts = vcapLocal ? { vcap: vcapLocal} : {}

const appEnv = cfenv.getAppEnv(appEnvOpts);

if (appEnv.services['dev-cloudant-db'] || appEnv.getService(/cloudant/)) {
  // Load the Cloudant library.
  var Cloudant = require('cloudant');

  // Initialize database with credentials
  if (appEnv.services['dev-cloudant-db']) {
     // CF service named 'cloudantNoSQLDB'
     var cloudant = Cloudant(appEnv.services['dev-cloudant-db'][0].credentials);
  } else {
     // user-provided service with 'cloudant' in its name
     var cloudant = Cloudant(appEnv.getService(/cloudant/).credentials);
  }

  //database name
  var dbName = 'mydb';

  // Create a new "mydb" database.
  cloudant.db.create(dbName, function(err, data) {
    if(!err) //err if database doesn't already exists
      console.log("Created database: " + dbName);
  });

  // Specify the database we are going to use (mydb)...
  mydb = cloudant.db.use(dbName);
}
