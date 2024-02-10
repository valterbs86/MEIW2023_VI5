/*
Mestrado em Engenharia Informática e Tecnologia Web
Visualização de Informação
Projeto Final
Grupo: Claudia Pires (1303334) / Valter Bastos (2302612)
Ficheiro JS
*/

function drawMapChart(file, div) {
	
	       // Add text box for displaying current year
        const yearTextbox = d3.select(div).append("div")
            .attr("class", "year-textbox")
            .text("Year: 2021");
	
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
        .translate([width / 2, height / 2 + 40]);

    // Create a path generator
    const path = d3.geoPath().projection(projection);

    // Load the GeoJSON data for world countries and CSV data
    Promise.all([
        d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"),
        d3.csv(file) // Use the provided file parameter
    ]).then(function(data) {
        const world = data[0];
        let csvData = data[1];

        // Function to update the map for a given year
        function updateMapForYear(year) {
            // Filter CSV data for the given year
            const filteredData = csvData.filter(d => +d.year === year);
            const dataMap = new Map(filteredData.map(d => [d.code, +d.pop]));

            // Update map colors
            svg.selectAll("path")
                .attr("fill", d => colorScale(dataMap.get(d.id) || 0));

            // Update tooltip content based on the current year
            svg.selectAll("path")
                .on("mouseover", function(event, d) {
                    // Apply effect on mouseover
                    d3.select(this)
                        .style("stroke", "black")
                        .style("opacity", 1);

                    // Show tooltip on mouseover with updated values
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", 0.9);

                    const population = dataMap.get(d.id);
                    tooltip.html(`Year: ${year} - ${d.properties.name}: ${population ? population.toFixed(2) + "%" : "N/A"}`)
                        .style("left", (event.pageX + 10) + "px")
                        .style("top", (event.pageY - 28) + "px");
                })
                .on("mouseout", function() {
                    // Remove effect on mouseout
                    d3.select(this)
                        .style("stroke", "#fff")
                        .style("opacity", 0.8);

                    // Hide tooltip on mouseout
                    tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                });

            // Update the year text box
            yearTextbox
			.text(`Year: ${year}`)
			;
        }

        // Create a map for easier data retrieval
        const dataMap = new Map(csvData.map(d => [d.code, +d.pop]));

        // Set up color scale based on the data values
        const colorScale = d3.scaleThreshold()
            .domain([5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100])
            .range(d3.range(0, 1.01, 1 / 11).map(d3.interpolateRgbBasis(d3.schemeOranges[9])));

        // Draw the countries
        svg.selectAll("path")
            .data(world.features)
            .enter().append("path")
            .attr("d", path)
            .attr("fill", d => colorScale(dataMap.get(d.id) || 0));


   		// Update tooltip content based on the current year
        svg.selectAll("path")
            .on("mouseover", function(event, d) {
                // Apply effect on mouseover
                d3.select(this)
                .style("stroke", "black")
                .style("opacity", 1);

                // Show tooltip on mouseover with updated values
                tooltip.transition()
                        .duration(200)
                        .style("opacity", 0.9);

                const population = dataMap.get(d.id);
                tooltip.html(`${d.properties.name}: ${population ? population.toFixed(2) + "%" : "N/A"}`)
                        .style("left", (event.pageX + 10) + "px")
                        .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function() {
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
            .attr("fill", d => d)
			.attr("stroke", "black") // Add border color
			.attr("stroke-width", 1); // Add border width

        legend.append("text")
            .attr("x", 30)
            .attr("y", 10)
            .attr("dy", "0.35em")
            .text((d, i) => {
                const extent = colorScale.invertExtent(d);
                if (i === 0) {
                    return `≤ ${extent[1].toFixed(2)}%`;
                } else if (i === colorScale.range().length - 1) {
                    return `> ${extent[0].toFixed(2)}%`;
                } else {
                    return `${extent[0].toFixed(2)}% - ${extent[1].toFixed(2)}%`;
                }
            });

 

		// Play button setup
		let isAnimating = false; // Flag to track if animation is in progress
		const playButton = d3.select(div).append("button")
			.attr("class", "Play_button")
			.text("Play Year")
			.on("click", function() {
				// Toggle between starting and stopping the animation
				if (!isAnimating) {
					// Start the animation
					isAnimating = true;
					playButton.text("Stop"); // Change button text to "Stop"
					startAnimation();
				} else {
					// Stop the animation
					isAnimating = false;
					playButton.text("Play Year"); // Change button text back to "Play Year"
				}
			});
			
		// Function to start the animation
		function startAnimation() {
			const years = [...new Set(csvData.map(d => +d.year))];
			let currentYearIndex = 0;
			
			// Start playing the animation
			const interval = setInterval(() => {
				if (currentYearIndex < years.length && isAnimating) {
					const year = years[currentYearIndex];
					updateMapForYear(year);
					currentYearIndex++;
				} else {
					clearInterval(interval); // Stop when all years are processed or when animation is stopped
					isAnimating = false; // Set flag to false
					playButton.text("Play Year"); // Change button text back to "Play Year"
				}
			}, 1000); // Adjust the interval duration as needed
		}
    });
}


function drawLineChart(csvData, div_id) {    
    var data = Array.from(d3.group(csvData, d => d.Continent), ([key, values]) => ({ key, values }));

    const uniqueContinents = [...new Set(csvData.map(d => d.Continent))];
    
    var width = 600;
    var height = 350;
    const margin = {top: 20, right: 100, bottom: 0, left: 0};
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

    // Add an initial transition for each line to simulate gradual drawing
    lines.selectAll('.line')
        .attr('stroke-dasharray', function() {
            return this.getTotalLength() + " " + this.getTotalLength();
        })
        .attr('stroke-dashoffset', function() {
            return this.getTotalLength();
        })
		.style('opacity', lineOpacityHover)
		.style("stroke-width", lineStrokeHover)
        .transition()
        .duration(3000) // Adjust the duration as needed
        .ease(d3.easeLinear)
        .attr('stroke-dashoffset', 0);
}

