

var request = require("request")

	  
request(

		{

		
		uri: 'https://api.freeagent.com/v2/approve_app',
		method: 'POST',		
		client_id: 'MyeuHkExlC8nJrdx6mTDyA',
		response_type: 'code',
		headers: {
					
					'Content-Type': 'application/json;charset=UTF-8'
					
				},
		redirect_uri: 'http://localhost:3000/'

		}, function (error, response, body) 
			{
		
			console.log('response: ' +  JSON.stringify(response));
			console.log('body: ' + body);
		
			}
	);		
			

			
			
			
    /* client_id (required) which is the Client ID obtained at FreeAgent Developer Dashboard
    response_type=code (required)
    redirect_uri (required unless supplied when registering) must be url escaped
    state (optional) arbitrary parameters supplied by the app developer to maintain their app's state */
