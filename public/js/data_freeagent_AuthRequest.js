

var request = require("request")



app.post('/freeagent', (req, resp) => {
	
	resp.writeHead(200, {"Content-Type": "text/plain"});
	resp.end('FA request updated');
	
});




//========================================================	  
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
//============================================================			

			
			
			

