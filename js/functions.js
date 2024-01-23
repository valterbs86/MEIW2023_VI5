var dataset;

function LoadData() {			
		d3.csv("./data/Transformed - Population_Income.csv", function(data){

		let dataset = data;
			
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

			//console.log(data);

		});
}

function writeData()
{

}
