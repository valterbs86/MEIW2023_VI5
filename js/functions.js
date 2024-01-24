function LoadData()
{

	console.log('Loading Data...');	
	
	d3.csv("./data/Transformed - Population_Income.csv").then(function(data) {
		//localStorage.setItem('dataset', JSON.stringify(data));
		
		//console.log(data);	
		
		//Replace empty by N/A
		data = JSON.parse(JSON.stringify(data), (key, value) => value === "" ? "N/A": value);
		
		//console.log('Replace empties...');	
		//console.log(data);	
		AddBarChart(data);
		
	});
}

function AddBarChart(data)
{

	//Filter only EU27
	barChartData = data.filter((element) => {
			return element.Region = 'EU27';
	});
	
	//console.log('Filter only EU27...');	
	//console.log(barChartData);

	//Get only the desired fields
	barChartData = Object.keys(barChartData).map(element => ({
            Year: data[element]['Year'],
			Female: data[element]['% of Female Population under Poverty Line'],
			Male: data[element]['% of Male Population under Poverty Line']
			//,Region: data[element]['Region']
        }));
		
	
	//Sort Data by Year
	barChartData = barChartData.sort((a, b) => {return a.Year - b.Year;});
	//console.log('Remove columns and sort');	
	//console.log(barChartData);
	
	drawBarChart(barChartData);
		
}


function drawBarChart(data) {
	//https://d3-graph-gallery.com/graph/barplot_stacked_basicWide.html
	
	// set the dimensions and margins of the graph
	var margin = {top: 10, right: 30, bottom: 20, left: 50},
    width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

	// append the svg object to the body of the page
	var svg = d3.select("#my_dataviz")
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
		var subgroups = Object.keys(data[0]).slice(1);	
	
		const groups = [...new Set(data.map(d => d.Year))]; 	
		//const groups = data.map(d => (d.Year));
	
		
		// Add X axis
		const x = d3.scaleBand()
			.domain(groups)
			.range([0, width])
			.padding([0.2])
			svg.append("g")
			.attr("transform", `translate(0, ${height})`)
			.call(d3.axisBottom(x).tickSizeOuter(0));	
		

		// Add Y axis
		const y = d3.scaleLinear()
			.domain([0, 60])
			.range([ height, 0 ]);
			svg.append("g").call(d3.axisLeft(y));	

		// color palette = one color per subgroup
		const color = d3.scaleOrdinal()
			.domain(subgroups)
			.range(['#377EB8','#4DAF4A']);

		const stackedData = d3.stack().keys(subgroups)(data);
		
		 // Show the bars
		svg.append("g")
			.selectAll("g")
			// Enter in the stack data = loop key per key = group per group
			.data(stackedData)
			.join("g")
			.attr("fill", d => color(d.key))
			.selectAll("rect")
			// enter a second time = loop subgroup per subgroup to add all rectangles
			.data(d => d)
			.join("rect")
			.attr("x", d => x(d.data.Year))
			.attr("y", d => y(d[1]))
			.attr("height", d => y(d[0]) - y(d[1]))
			.attr("width",x.bandwidth())

}


		
		

function PopulateDiv(data)
{
	//window.alert(JSON.parse(localStorage.getItem('dataset')));
	let options = [...new Set(data.map(d => d.MaxYear).sort())]; 
	
	//
	//let options2 = options.filter(d => d.MaxYear = 2016);
		// optionally add .sort() to the end of that line to sort the unique values
		// alphabetically rather than by insertion order

		d3.select('#my_dataviz')
  			.selectAll('option')
    		.data(filtered_options)
  			.enter()
    		.append('option')
    		.text(d => d)
    		.attr('value', d => d);

}
