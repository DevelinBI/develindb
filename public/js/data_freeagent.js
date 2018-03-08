

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
			
NS REQUEST AN AUTHORISATION KEY USING THE SAME APP ID AND SECRET KEY.  AND USE THE REFRESH KEY TO CREATE A NEW APPLICATION KEY

the client id and secret key create the authorisation key.  the authorisation key creates the access and refresh keys.