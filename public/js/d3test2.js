function loadData(data){

	
	var data=JSON.parse(data);

	var columns = ['name', 'source', 'count', 'del'];

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
					return {column: column, value: 'del'};
				}
			});
	})
	.enter()
	.append('td')
	.text(function (d) { return d.value; });


};	
	
							
							
							
							
	
	
			
