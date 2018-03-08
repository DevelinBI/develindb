(function ($) 
	{
	
	
	$(document).ready(function loadChart(){


		var dataset = [],
    i = 0;

    for(i=0; i<5; i++){
        dataset.push(Math.round(Math.random()*100));
    }

    var sampleSVG = d3.select("#sources")
    .append("svg")
    .attr("width", 500)
    .attr("height", 300);    

    sampleSVG.selectAll("circle")
    .data(dataset)
    .enter().append("circle")
    .style("stroke", "gray")
    .style("fill", "white")
    .attr("r", 40)
    .attr("cx", function(d, i){return 50 + (i*80)})
    .attr("cy", 120);
		
		
			
	});	
							
							
							
							
							
	
	
			
})(jQuery);	