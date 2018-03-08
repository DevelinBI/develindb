//---------  CODE TO MANIPULATE BLOCKS OF HTML

/* app.get("/", function (req, resp) {

	var blocks = require('./html/blocks.json');	
	var html;
	var htmlArray=[];
	
	var blockcount = Object.keys(blocks).length;
	
	Object.keys(blocks).forEach(function(key) {

		fs.readFile('./html/' + blocks[key] + '.html',null, function(error, data){
			if(error){
				resp.writeHead(404, {"Content-Type": "text/plain"});
				resp.write('file not found');
			}
			else{					

				htmlArray.push(data);
				if(htmlArray.length==blockcount){

					htmlArray.sort();
					for (let j = 0; j < blockcount; j++) {	
		
						if(html == undefined){html = htmlArray[j];}
						else{
							html = html + htmlArray[j];
						}							
				
						if (j == blockcount - 1){
							
							fs.writeFile('./public/index.html', html, function (err) {
								if (err) {console.log(err);}
								else{
									resp.sendFile(path.join(publicDir, 'index.html'));
									app.use(express.static(path.join(__dirname, 'public')));
								}
							});
						}	
					}						
				}
			}	
		});
	});	
});   */

//----- Typical load of rubbish provided by the D3 community 

//======================================================



/* var htmlStub = '<html><head></head><body><div id="dataviz-container"></div><script src="js/d3.v3.min.js"></script></body></html>' // html file skull with a container div for the d3 dataviz

jsdom.env({
	features : { QuerySelector : true }
	, html : htmlStub
	, done : function(errors, window) {
	// this callback function pre-renders the dataviz inside the html document, then export result into a static file

			var el = window.document.querySelector('#sources')
				, body = window.document.querySelector('body')
				, circleId = 'a2324'  // say, this value was dynamically retrieved from some database

			// generate the dataviz
			d3.select(el)
				.append('svg:svg')
					.attr('width', 600)
					.attr('height', 300)
					.append('circle')
						.attr('cx', 300)
						.attr('cy', 150)
						.attr('r', 30)
						.attr('fill', '#26963c')
						.attr('id', circleId) // say, this value was dynamically retrieved from some database

			// make the client-side script manipulate the circle at client side)
			var clientScript = "d3.select('#" + circleId + "').transition().delay(1000).attr('fill', '#f9af26')"

			d3.select(body)
				.append('script')
					.html(clientScript)

			// save result in an html file, we could also keep it in memory, or export the interesting fragment into a database for later use
			var svgsrc = window.document.innerHTML

			fs.writeFile('index.html', svgsrc, function(err) {
				if(err) {
					console.log('error saving document', err)
				} else {
					console.log('The file was saved!')
				}
			})	


			fs.writeFile('./public/index.html', svgsrc, function (err) {
				if (err) {console.log(err);}
				else{
					resp.sendFile(path.join(publicDir, 'index.html'));
					app.use(express.static(path.join(__dirname, 'public')));
				}
			});







		} // end jsDom done callback
})
 */


//-------------------------------------------
/* 								var chartWidth = 500, chartHeight = 500;

var arc = d3.svg.arc()
    .outerRadius(chartWidth/2 - 10)
    .innerRadius(0);

var colours = ['#F00','#000','#000','#000','#000','#000','#000','#000','#000'];

module.exports = function( pieData, outputLocation ){
	if(!pieData) pieData = [12,31];
	if(!outputLocation) outputLocation = 'test.svg';

	jsdom.env({
	    html:'',
	    features:{ QuerySelector:true }, //you need query selector for D3 to work
	    done:function(errors, window){
	    	window.d3 = d3.select(window.document); //get d3 into the dom

	    	//do yr normal d3 stuff
	    	var svg = window.d3.select('#sources')
	    		.append('div').attr('class','container') //make a container div to ease the saving process
	    		.append('svg')
	    			.attr({
			      		xmlns:'http://www.w3.org/2000/svg',
			      		width:chartWidth,
			      		height:chartHeight
			      	})
			    .append('g')
			    	.attr('transform','translate(' + chartWidth/2 + ',' + chartWidth/2 + ')');

	    	svg.selectAll('.arc')
	    		.data( d3.layout.pie()(pieData) )
	    			.enter()
	    		.append('path')
	    			.attr({
	    				'class':'arc',
	    				'd':arc,
	    				'fill':function(d,i){
	    					return colours[i];
	    				},
	    				'stroke':'#fff'
	    			});

	    	//write out the children of the container div
    		fs.writeFileSync(outputLocation, window.d3.select('.container').html()) //using sync to keep the code simple

	    }
	});
}

if (require.main === module) {
    module.exports();
} */
//=================================================