function openMenu() {
    document.querySelector('.sheet-menu').style.left = '0';
}

function closeMenu() {
    document.querySelector('.sheet-menu').style.left = '-350px';
}


function scrollToDiv(div) {
		let text1 = ".";
		let element = text1.concat(div);
		var targetDiv = document.querySelector(element);
		
		targetDiv.scrollIntoView({ behavior: 'smooth' });
    }


function ShowDiv(div) {
	
	let parentElement = document.querySelector('.content');
	let text1 = ".";
	let element = text1.concat(div);
	document.querySelector('.intro').remove();
	document.querySelector('.overview').remove();
	parentElement.appendChild(document.querySelector(element));
	
	//console.log(div);
    //document.querySelector('.intro').style.visibility = 'hidden';
	//document.querySelector('.overview').style.visibility = 'hidden';
	//document.querySelector(element).style.visibility = 'visible';
	//content.appendChild(element);
	//document.querySelector('.overview').remove();
	//document.querySelector(element).remove();
	//document.querySelector(element).remove();
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