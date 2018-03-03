

var request = require("request")

	  
request(

		{

		
		uri: 'https://api.freeagent.com/v2/company.json',
		method: 'POST',		
		headers: {
					'Authorization': 'Bearer 1Xi_ScCpy7TO7j7VtfxdHCXcd5meRREHvwXQpynK_',
					'Content-Type': 'application/json;charset=UTF-8',
					'user-agent': 'google-oauth-playground'
				},
		redirect_uri: 'http://localhost:3000/'

		}, function (error, response, body) 
			{
		
			console.log('response: ' +  JSON.stringify(response));
			console.log('body: ' + body);
		
			}
	);		
			
