function loadData(data){

	
	var data=JSON.parse(data);

	var columns = ['company', 'name', 'source', 'count', 'del'];

	d3.select("#tbl-sources").remove();
	var table = d3.select('#sources').append('table').attr("id","tbl-sources");
	var thead = table.append('thead')
	var	tbody = table.append('tbody');

	// append the header row
	thead.append('tr')
	.selectAll('th')
	.data(columns).enter()
	.append('th')
	.text(function (column) { return column; });

	// create a row for each object in the data
	var rows = tbody.selectAll('tr')
	.data(data)
	.enter()
	.append('tr');

	// create a cell in each row for each column
	var cells = rows.selectAll('td')
	.data(function (row) 
	{
		return columns.map(function (column) 
			{
				if (column !== 'del')
				{
					return {column: column, value: row[column]};
				}
				else
				{
					return {column: column, value: row['company'] + ':' + row['name']};
				}
			});
	})
	.enter()
	.append('td')
	.text(function (d) { return d.value; })
	.attr('id', function (d) 
		{ 			
			if(d.column == 'name' || d.column == 'del'){return d.value;}			
		})
	.attr('class', function (d) 
		{							
			if(d.column == 'del'){return 'btn-delete';}
	
		})
	.on("click", function(d) 
		{
			if(d.column == 'del')
			{
				var companyName = this.id				
				var locPos = companyName.search(":");				
				var company = companyName.substring(0, locPos).trim();
				var name = companyName.substring(locPos + 1, companyName.length).trim();
				
			
				console.log('clicked company: ' + company + '  clicked name: ' + name);
				var confirm = confirmAction(name);
				if (confirm == 'yes'){deleteSource(company, name);}
				
			}
		});
	
	
	/* .attr('id', function (d) { return d.column + ":" + d.row; })
						.text(function (d) { if(typeof d.value === 'undefined'){return '-';} else { if(isNumeric(d.value) && this.id.search("row") == -1) {return formatComma(d.value);} else {return d.value;}} })						
						.attr('class', function (d) {							
							if(d.column == 'Income Variance_revised' && d.row >= 7){return planCell;}
							else if(d.column == 'Income Variance' && d.row >= 7){return planCell_noBackground;}							
							else if(d.column.search("total") > -1 ){return col_rowtotal;} 
							else if(d.column.search("row") > -1 ){return col_rowlabel;}
							else {return cell;}	
							})						
						.on("mouseover", function(d){d3.select(this).attr('class',this.className + ' ' + cellMouseOver);mouseover_text([this.id]);})
						.on("mouseout", function(d){d3.select(this).attr('class', this.className.replace(cellMouseOver, ''));mouseover_text(['none']);}); */


}	
	
function deleteSource(company, name){ 
	
		console.log('fn clicked company: ' + company + '  fn clicked name: ' + name);
		$.ajax({
			type: 'POST',
			url: '../deldatasource',
			contentType: 'application/json',
			data: JSON.stringify({company: company, name: name}),
			success: function(result){location.reload()}  		
		});	
	
}							
							
function confirmAction(name) {
    var txt;
    if (confirm("Confirm source " + name + " delete")) {
        txt = "yes";
    } else {
        txt = "no";
    }
    return txt;
}							
							
	
	
			
