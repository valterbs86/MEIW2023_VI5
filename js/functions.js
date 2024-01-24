
function LoadData()
{
	console.log('Loading Data...');	
	d3.csv("./data/Transformed - Population_Income.csv").then(function(data) {
		//localStorage.setItem('dataset', JSON.stringify(data));
		
		PopulateDiv(data);
		
	});
}

function PopulateDiv(data)
{
	//window.alert(JSON.parse(localStorage.getItem('dataset')));

	let options = [...new Set(data.map(d => d.MaxYear))]; 
		// optionally add .sort() to the end of that line to sort the unique values
		// alphabetically rather than by insertion order

		d3.select('#my_dataviz')
  			.selectAll('option')
    			.data(options)
  			.enter()
    			.append('option')
    			.text(d => d)
    			.attr('value', d => d);
}
