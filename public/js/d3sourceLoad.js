function loadData(data){

	// Set up the css
	var listlabel1 = 'listlabel1', listlabel2 = 'listlabel2';
	
	var data=JSON.parse(data);
	var columns = ['company', 'name', 'source', 'count', 'edit', 'del'];

	d3.select("#tbl-sources").remove();
	var table = d3.select('#sources').append('table').attr("id","tbl-sources");
	var thead = table.append('thead')
	var	tbody = table.append('tbody');

	// append the header row
	thead.append('tr')
	.selectAll('th')
	.data(columns).enter()
	.append('th')
	.text(function (column) 
		{ 
			if(column !== 'del' && column !== 'edit'){return column;}
		})
	.attr('class', function (d) 
		{
			if(d == 'company' || d == 'name' || d == 'source'){return listlabel1;}
			else{return listlabel2;}
		});

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
				if (column == 'del')
				{
					return {column: column, value: row['company'] + ':' + row['name']};
				}
				else if	(column == 'edit')			
				{
					return {column: column, value: "c." + row['company'] + ",n." + row['name'] + ",s." + row['source'] };
				}
				else
				{
					return {column: column, value: row[column]};
				}
			});
	})
	.enter()
	.append('td')
	.text(function (d) { return d.value; })
	.attr('id', function (d) 
		{ 			
			if(d.column == 'edit' || d.column == 'del'){return d.value;}			
		})
	//Set the classes for each column
	.attr('class', function (d) 
		{							
			if(d.column == 'company' || d.column == 'source'){return listlabel1;}
			else if(d.column == 'name'){return listlabel1;}
			else if(d.column == 'count'){return listlabel2;}
			else if(d.column == 'edit'){return 'btn-edit' + ' ' + 'pointer';}
			else if(d.column == 'del'){return 'btn-delete' + ' ' + 'pointer';}
	
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
			if(d.column == 'edit')
			{
				var id = this.id;
							
				var cPos = id.search("c.");
				var nPos = id.search(",n.");				
				var sPos = id.search(",s.");

				var company = id.substring(cPos + 2, nPos).trim();
				var name = id.substring(nPos + 3, sPos).trim();
				var source = id.substring(sPos + 3, id.length).trim();

				openSource(company, name, source);	
			}
		});
	
}	
	
function deleteSource(company, name){ 
	
		$.ajax({
			type: 'POST',
			url: '../deldatasource',
			contentType: 'application/json',
			data: JSON.stringify({company: company, name: name}),
			success: function(result){location.reload()}  		
		});	
	
}
function openSource(company, name, source){ 
	
		console.log('fn clicked company: ' + company + '  fn clicked name: ' + name);
		window.open("http://localhost:3000/api/" + source + ".html", "[source:" + source + ",name:" + name + ",company:" + company + "]", "location=1,toolbar=1,menubar=1,resizable=1,width=1200,height=1200,top=50, left=50");
	
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
							
	
	
			
