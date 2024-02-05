
function drawMapChart(file, div) {

	// Set up the tooltip div
	const tooltip = d3.select("body").append("div")
		.attr("class", "tooltip")
		.style("opacity", 0);
	
	// Set up the map chart dimensions
	const width = 800;
	const height = 410;
	
	// Create an SVG element
	const svg = d3.select(div).append("svg")
		.attr("width", width)
		.attr("height", height);
	
	// Define the projection
	const projection = d3.geoNaturalEarth1()
		.scale(150)
		.translate([width/2, height/2+40]);
	
	// Create a path generator
	const path = d3.geoPath().projection(projection);
	
	// Load the GeoJSON data for world countries and CSV data
	Promise.all([
		d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"),
		d3.csv("./data/Load_WorldChart_World.csv") // Replace with your CSV file
	]).then(function (data) {
		const world = data[0];
		const csvData = data[1];
	
		// Create a map for easier data retrieval
		const dataMap = new Map(csvData.map(d => [d.code, +d.pop]));
	
		// Set up color scale based on the data values
	const colorScale = d3.scaleThreshold()
	.domain([5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100])
	.range(d3.range(0, 1.01, 1 / 11).map(d3.interpolateRgbBasis(d3.schemeReds[9])));
	
		// Draw the countries
		svg.selectAll("path")
		.data(world.features)
		.enter().append("path")
		.attr("d", path)
		.attr("fill", d => colorScale(dataMap.get(d.id) || 0))
		.on("mouseover", function (event, d) {
			// Apply effect on mouseover
			d3.select(this)
			.style("stroke", "black")
			.style("opacity", 1);
	
			// Show tooltip on mouseover
			tooltip.transition()
			.duration(200)
			.style("opacity", 0.9);
			
			console.log('aqui');
			
			tooltip.html(`${d.properties.name}: ${(dataMap.get(d.id) || 'N/A').toFixed(2)}%`)
			.style("left", (event.pageX + 10) + "px")
			.style("top", (event.pageY - 28) + "px");
		})
		.on("mouseout", function () {
			// Remove effect on mouseout
			d3.select(this)
			.style("stroke", "#fff")
			.style("opacity", 0.8);
	
			// Hide tooltip on mouseout
			tooltip.transition()
			.duration(500)
			.style("opacity", 0);
		});
		
	// Add legend
		const legend = svg.append("g")
		.attr("class", "legend")
		.selectAll("g")
		.data(colorScale.range())
		.enter().append("g")
		.attr("transform", (d, i) => `translate(0, ${i * 25})`);
	
		legend.append("rect")
		.attr("width", 20)
		.attr("height", 20)
		.attr("fill", d => d);
	
		legend.append("text")
		.attr("x", 30)
		.attr("y", 10)
		.attr("dy", "0.35em")
		.text((d, i) => {
			const extent = colorScale.invertExtent(d);
			if (i === 0) {
			return `≤ ${extent[1]}%`;
			} else if (i === colorScale.range().length - 1) {
			return `> ${extent[0]}%`;
			} else {
			return `${extent[0]}% - ${extent[1]}%`;
			}
		});
		
	});

}


function drawLineChart(csvData, div_id) {	
	
	var data = Array.from(d3.group(csvData, d => d.Continent), ([key, values]) => ({ key, values }));

	const uniqueContinents = [...new Set(csvData.map(d => d.Continent))];
	
	var width = 600;
	var height = 350;
	const margin = {top: 20, right: 50, bottom: 0, left: 50};
	var duration = 250;

	var lineOpacity = "0.25";
	var lineOpacityHover = "0.85";
	var otherLinesOpacityHover = "0.1";
	var lineStroke = "1.5px";
	var lineStrokeHover = "2.5px";

	var circleOpacity = '0.85';
	var circleOpacityOnLineHover = "0.25";
	var circleRadius = 3;
	var circleRadiusHover = 6;


	/* Scale */
	var xScale = d3.scaleTime()
		.domain(d3.extent(csvData, d => d.Year))
		.range([0, width - margin.left - margin.right]);

	var yScale = d3.scaleLinear()
		.domain([0, d3.max(csvData, d => d.Avg_Share_of_pop) + 30])
		.range([height - margin.top - margin.bottom, 0]);
	
	var color = d3.scaleOrdinal()
		.domain(uniqueContinents)
		.range(d3.schemeCategory10);

	/* Add SVG */
	var svg = d3.select(div_id).append("svg")
		.attr("width", (width + margin.left + margin.right) + "px")
		.attr("height", (height + margin.top + margin.bottom) + "px")
		.append('g')
		.attr("transform", `translate(${margin.right}, 15)`);

	/* Add line into SVG */
	var line = d3.line()
		.x(d => xScale(d.Year))
		.y(d => yScale(d.Avg_Share_of_pop));

	let lines = svg.append('g')
		.attr('class', 'lines');

	lines.selectAll('.line-group')
    .data(data).enter()
    .append('g')
    .attr('class', 'line-group')
    .on("mouseover", function(d) {
		d3.select(this)
			.style("fill", d => color(d.key))
			.append("text")
			.attr("class", "title-text")
			.text(d => `${d.key}`)
			.attr("x", (width - margin.left - margin.right) / 2)
			.attr("y", 0);
    })
    .on("mouseout", function(d) {
      svg.select(".title-text").remove();
    })
    .append('path')
    .attr('class', 'line')
    .attr('d', d => line(d.values))
    .style('stroke', d => color(d.key))
    .style('opacity', lineOpacity)
    .on("mouseover", function(d) {
		d3.selectAll('.line')
			.style('opacity', otherLinesOpacityHover);
		d3.selectAll('.circle')
			.style('opacity', circleOpacityOnLineHover);
		d3.select(this)
			.style('opacity', lineOpacityHover)
			.style("stroke-width", lineStrokeHover)
			.style("cursor", "pointer");
    })
    .on("mouseout", function(d) {
		d3.selectAll(".line")
			.style('opacity', lineOpacity);
		d3.selectAll('.circle')
			.style('opacity', circleOpacity);
		d3.select(this)
			.style("stroke-width", lineStroke)
			.style("cursor", "none");
    });

	/* Add circles in the line */
	lines.selectAll("circle-group")
		.data(data).enter()
		.append("g")
		.style("fill", d => color(d.key))
		.selectAll("circle")
		.data(d => d.values).enter()
		.append("g")
		.attr("class", "circle")
		.on("mouseover", function(d) {
			d3.select(this)
				.style("cursor", "pointer")
				.append("text")
				.attr("class", "text")
				.text(d => `${d.Avg_Share_of_pop}`+'%')
				.attr("x", d => xScale(d.Year) + 5)
				.attr("y", d => yScale(d.Avg_Share_of_pop) + 20);
		})
		.on("mouseout", function(d) {
			d3.select(this)
				.style("cursor", "none")
				.transition()
				.duration(duration)
				.selectAll(".text").remove();
		})
		.append("circle")
		.attr("cx", d => xScale(d.Year))
		.attr("cy", d => yScale(d.Avg_Share_of_pop))
		.attr("r", circleRadius)
		.style('opacity', circleOpacity)
		.on("mouseover", function(d) {
		d3.select(this)
			.transition()
			.duration(duration)
			.attr("r", circleRadiusHover);
		})
		.on("mouseout", function(d) {
		d3.select(this)
			.transition()
			.duration(duration)
			.attr("r", circleRadius);
		});

	/* Add Axis into SVG */
	var xAxis = d3.axisBottom(xScale).ticks(10);
	var yAxis = d3.axisLeft(yScale).ticks(10);

	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", `translate(0, ${height - margin.top - margin.bottom})`)
		.call(xAxis);

	//Add the Y axis legend
	svg.append("g")
		.attr("class", "y axis")
		.call(yAxis)
		.append('text')
		.attr("y", -30)
		.attr("x", -50)
		.attr("transform", "rotate(-90)")
		.attr("fill", "#000")
		.text("Average Share (%) of Population")
		.style("font-size", "10px") 
		.style("fill", "blue");
		
    //Add the X axis legend
        const legend = d3.select(div_id).append('div')
            .attr('class', 'legend');

        legend.selectAll('.legend-item')
            .data(uniqueContinents)
            .enter().append('div')
            .attr('class', 'legend-item')
            .html(d => `<span style="background-color: ${color(d)}"></span>${d}`)
			.style("font-size", "20px") ;		

}

function drawRaceBarChart(data, div_id) {
	
	// Extract unique continents
	const continents = Array.from(new Set(data.map(d => d.Continent)));
	
	// Set up the SVG container
	const margin = { top: 30, right: 30, bottom: 30, left: 150 };
	const width = 600 - margin.left - margin.right;
	const height = 600 - margin.top - margin.bottom;
	
	const svg = d3.select(div_id)
	.append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom + 20)
	.append("g")
	.attr("transform", `translate(${margin.left},${margin.top})`);
	
	// Create scales
	const xScale = d3.scaleLinear()
	.range([0, width]);
	
	const yScale = d3.scaleBand()
	.range([height, 0])
	.padding(0.1);
	
	// Set up axes
	const xAxis = d3.axisBottom(xScale);
	const yAxis = d3.axisLeft(yScale);
	
	// Add axes to the SVG
	svg.append("g")
	.attr("class", "x-axis")
	.attr("transform", `translate(0,${height})`)
	.call(xAxis);
	
	svg.append("g")
	.attr("class", "y-axis")
	.call(yAxis);
	
	// Create color scale for continents
	const colorScale = d3.scaleOrdinal()
	.domain(continents)
	.range(d3.schemeCategory10);
	
	// Text element to display the current year
	const yearText = svg.append("text")
	.attr("class", "year-text")
	.attr("x", width - 200)
	.attr("y", -10)
	.style("font-size", "20px")
	.style("font-weight", "bold")
	.style("text-anchor", "end");
	
	// Update function for rendering the chart
	function update(Year) {
	// Filter data for the current year
	const filteredData = data.filter(d => d.Year === Year);
	
	// Update scales with current data
	xScale.domain([0, d3.max(filteredData, d => d.Value)]);
	yScale.domain(filteredData.map(d => d.Country));
	
	// Update axes
	svg.select(".x-axis").call(xAxis);
	svg.select(".y-axis").call(yAxis);
	
	// Join data to bars
	const bars = svg.selectAll(".bar")
		.data(filteredData, d => d.Country);
	
	// Enter selection
	bars.enter()
		.append("rect")
		.attr("class", "bar")
		.attr("x", 0)
		.attr("y", d => yScale(d.Country))
		.attr("width", 0)
		.attr("height", yScale.bandwidth())
		.attr("fill", d => colorScale(d.Continent))
		.transition()
		.duration(500)
		.attr("width", d => xScale(d.Value));
	
	// Add [% of Population under Poverty Line] labels
	const labels = svg.selectAll(".label")
		.data(filteredData, d => d.Country);
	
	labels.enter()
		.append("text")
		.attr("class", "label")
		.attr("x", d => xScale(d.Value) + 10)
		.attr("y", d => yScale(d.Country) + yScale.bandwidth() / 2)
		.style("font-size", "14px")
		.style("dominant-baseline", "middle")
		.text(d => d.Value);
	
	// Update selection
	labels.transition()
		.duration(500)
		.attr("x", d => xScale(d.Value) + 5)
		.attr("y", d => yScale(d.Country) + yScale.bandwidth() / 2)
		.text(d => d.Value);
	
	// Exit selection
	labels.exit().remove();
	
	bars.transition()
		.duration(500)
		.attr("x", 0)
		.attr("y", d => yScale(d.Country))
		.attr("width", d => xScale(d.Value))
		.attr("height", yScale.bandwidth())
		.attr("fill", d => colorScale(d.Continent));
	
	// Exit selection
	bars.exit()
		.transition()
		.duration(500)
		.attr("width", 0)
		.remove();
	
	// Update the year text
	yearText.text(Year);
	}
	
	// Initial update with the first year of data
	update(2000);
	
	// Automatic year change every second
	setInterval(() => {
		const currentYear = parseInt(yearText.text());
		const nextYear = currentYear + 1;
		if (nextYear <= d3.max(data, d => d.Year)) {
			update(nextYear);
		}
	}, 1000);	
}

function drawGroupedChart(data, div_id){
	
	// set the dimensions and margins of the graph
	var margin = {top: 70, right: 20, bottom: 50, left: 40},
    width = 450 - margin.left - margin.right,
    height = 350 - margin.top - margin.bottom;

	// append the svg object to the body of the page
	const svg = d3.select(div_id)
		.append("svg")
		.attr("width", "100%")
		.attr("height", "100%")
		.attr("viewBox", "0 0 450 350")
		.attr("preserveAspectRatio", "xMinYMin")
		.append("g")
		.attr("transform", `translate(${margin.left}, ${margin.top})`);


	// data wrangling
	const sumbyYearOffice = d3.rollups(data, v => d3.sum(v, d => +d.refugee_number), d => d.year, d => d.main_office)
	const yearKeys = Array.from(sumbyYearOffice).map(d => d[0])
	const officeKey = Array.from(Array.from(sumbyYearOffice)[0][1]).map(d=>d[0])
	const officeKey_sorted = officeKey.sort(d3.ascending)

	// X scale and Axis
	const xScale = d3.scaleBand()
		.domain(yearKeys)
		.range([0, width])
		.padding(.2);
	svg
		.append('g')
		.attr("transform", `translate(0,${height})`)
		.call(d3.axisBottom(xScale).tickSize(0).tickPadding(8));
	
	// Y scale and Axis
	const formater =  d3.format(".1s")
	const yScale = d3.scaleLinear()
		.domain([0, d3.max(data.map(d => +d.refugee_number))])
		.range([height, 0]);
	svg
	.append('g')
	.call(d3.axisLeft(yScale).ticks(5).tickSize(0).tickPadding(6).tickFormat(formater))
	.call(d => d.select(".domain").remove());
	
	// set subgroup sacle
	const xSubgroups = d3.scaleBand()
	.domain(officeKey_sorted)
	.range([0, xScale.bandwidth()])
	.padding([0.05])
	
	// color palette
	const color = d3.scaleOrdinal()
	.domain(officeKey_sorted)
	.range(['#18375F','#0072BC','#8EBEFF'])
	
	// set horizontal grid line
	const GridLine = () => d3.axisLeft().scale(yScale);
	svg
	.append("g")
		.attr("class", "grid")
	.call(GridLine()
		.tickSize(-width,0,0)
		.tickFormat("")
	);
	
	// create a tooltip
	const tooltip = d3.select(div_id)
		.append("div")
		.attr("id", "chart")
		.attr("class", "tooltip");
	
	// tooltip events
	const mouseover = function(d) {
		tooltip
		.style("opacity", .8)
		d3.select(this)
		.style("opacity", .5)
	}
	const mousemove = function(event, d) {
	const formater =  d3.format(",")
		tooltip
		.html(formater(d[1]))
		.style("top", event.pageY - 10 + "px")
		.style("left", event.pageX + 10 + "px");
	}
	const mouseleave = function(d) {
		tooltip
		.style("opacity", 0)
		d3.select(this)
		.style("opacity", 1)
	}
	
	// create bars
	bars = svg.append("g")
	.selectAll("g")
	.data(sumbyYearOffice)
	.join("g")
		.attr("transform", d => "translate(" + xScale(d[0]) +", 0)")
	.selectAll("rect")
	.data(d => { return d[1] })
	.join("rect")
		.attr("x", d => xSubgroups(d[0]))
		.attr("y", d => yScale(d[1]))
		.attr("width", xSubgroups.bandwidth())
		.attr("height", d => height - yScale(d[1]))
		.attr("fill", d=>color(d[0]))
	.on("mouseover", mouseover)
	.on("mousemove", mousemove)
	.on("mouseleave", mouseleave);
	
	// set title
	svg
	.append("text")
		.attr("class", "chart-title")
		.attr("x", -(margin.left)*0.6)
		.attr("y", -(margin.top)/1.5)
		.attr("text-anchor", "start")
	.text("Refugees in Africa region | 2018-2021")
	
	// set Y axis label
	svg
	.append("text")
		.attr("class", "chart-label")
		.attr("x", -(margin.left)*0.6)
		.attr("y", -(margin.top/15))
		.attr("text-anchor", "start")
	.text("Displaced population (millions)")
	
	// set source
	svg
	.append("text")
		.attr("class", "chart-source")
		.attr("x", -(margin.left)*0.6)
		.attr("y", height + margin.bottom*0.7)
		.attr("text-anchor", "start")
	.text("Source: UNHCR Refugee Data Finder")
	
	// set copyright
	svg
	.append("text")
		.attr("class", "copyright")
		.attr("x", -(margin.left)*0.6)
		.attr("y", height + margin.bottom*0.9)
		.attr("text-anchor", "start")
	.text("©UNHCR, The UN Refugee Agency")
	
	//set legend
	svg
	.append("rect")
		.attr("x", -(margin.left)*0.6)
		.attr("y", -(margin.top/2))
		.attr("width", 13)
		.attr("height", 13)
		.style("fill", "#18375F");
	svg
		.append("text")
			.attr("class", "legend")
			.attr("x", -(margin.left)*0.6+20)
			.attr("y", -(margin.top/2.5))
		.text("East and Horn of Africa and Great Lakes")
	svg
		.append("rect")
			.attr("x", 180)
			.attr("y", -(margin.top/2))
			.attr("width", 13)
			.attr("height", 13)
			.style("fill", "#0072BC")
	svg
		.append("text")
			.attr("class", "legend")
			.attr("x", 200)
			.attr("y", -(margin.top/2.5))
		.text("Southern Africa")
	svg
		.append("rect")
			.attr("x", 280)
			.attr("y", -(margin.top/2))
			.attr("width", 13)
			.attr("height", 13)
			.style("fill", "#8EBEFF")
	svg
		.append("text")
			.attr("class", "legend")
			.attr("x", 300)
			.attr("y", -(margin.top/2.5))
		.text("West and Central Africa")
	
}

function drawStackedBarChart(data, div_id) {
	//https://d3-graph-gallery.com/graph/barplot_stacked_basicWide.html
	
	// set the dimensions and margins of the graph
	var margin = {top: 10, right: 30, bottom: 20, left: 50},
    width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

	// append the svg object to the body of the page
	var svg = d3.select(div_id)
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
			.domain([0, 100])
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
			
svg.append("text")
  .attr("y", 400)
  .attr("x",x.rangeBand()/2 )
  .style("text-anchor", "middle")
  .style("font-size", "20px")
  .style("color", "white")
  .text(function(d,i) { return i+1; }); 			

}


function drawBarChart(data, div_id) {

	// set the dimensions and margins of the graph
	var margin = {top: 10, right: 30, bottom: 30, left: 50},
    width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
	
	// append the svg object to the body of the page
	var svg = d3.select(div_id)
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


	// X axis
	var x = d3.scaleBand()
	.range([ 0, width ])
	.domain(data.map(function(d) { return d.Year; }))
	.padding(0.2);
	svg.append("g")
	.attr("transform", "translate(0," + height + ")")
	.call(d3.axisBottom(x))
	.selectAll("text")
		.attr("transform", "translate(-10,0)rotate(-45)")
		.style("text-anchor", "end");

	// Add Y axis
	var y = d3.scaleLinear()
	.domain([0, 25])
	.range([ height, 0]);
	svg.append("g")
	.call(d3.axisLeft(y));

	// Bars
	svg.selectAll("mybar")
	.data(data)
	.enter()
	.append("rect")
		.attr("x", function(d) { return x(d.Year); })
		.attr("width", x.bandwidth())
		.attr("fill", "#69b3a2")
		// no bar at the beginning thus:
		.attr("height", function(d) { return height - y(0); }) // always equal to 0
		.attr("y", function(d) { return y(0); })

	// Animation
	svg.selectAll("rect")
	.transition()
	.duration(800)
	.attr("y", function(d) { return y(d.Value); })
	.attr("height", function(d) { return height - y(d.Value); })
	.delay(function(d,i){console.log(i) ; return(i*100)})

}
