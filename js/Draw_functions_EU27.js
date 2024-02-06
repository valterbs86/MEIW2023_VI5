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
        .scale(400)
        .translate([width / 2, height / 2 + 350]);

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
            .range(d3.range(0, 1.01, 1 / 11).map(d3.interpolateRgbBasis(d3.schemeReds[9])));

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
            .attr("fill", d => d);

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

function drawRaceBarChart(data, div_id) {
	
	// Extract unique Countries
	const countries = Array.from(new Set(data.map(d => d.Country)));
	
	// Set up the SVG container
	const margin = { top: 30, right: 30, bottom: 30, left: 150 };
	const width = 600 - margin.left - margin.right;
	const height = 600 - margin.top - margin.bottom;
	
	const svg = d3.select(div_id)
	.append("svg")
	.attr("width", width + margin.left + margin.right+100)
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
	.attr("class", "y-axis")
	.call(yAxis);
	
	// Create color scale for countries
	const colorScale = d3.scaleOrdinal()
	.domain(countries)
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

    // Sort the filtered data by value descending
    filteredData.sort((a, b) => a.Value - b.Value);

    // Update scales with current data
    xScale.domain([0, 100]); // Set the x-axis domain to fixed range [0, 100]
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
        .attr("fill", d => colorScale(d.Country))
        .merge(bars) // Merge enter and update selections
        .transition()
        .duration(500)
        .attr("width", d => xScale(d.Value) * (width / 100)) // Scale the width to fit the fixed x-axis range
        .attr("y", d => yScale(d.Country))
        .attr("height", yScale.bandwidth());

    // Add [% of Population under Poverty Line] labels
    const labels = svg.selectAll(".label")
        .data(filteredData, d => d.Country);

    labels.enter()
        .append("text")
        .attr("class", "label")
        .attr("x", d => xScale(d.Value) * (width / 100) + 10) // Scale the x position
        .attr("y", d => yScale(d.Country) + yScale.bandwidth() / 2)
        .style("font-size", "14px")
        .style("dominant-baseline", "middle")
        .merge(labels) // Merge enter and update selections
        .transition()
        .duration(500)
        .attr("x", d => xScale(d.Value) * (width / 100) + 5) // Scale the x position
        .attr("y", d => yScale(d.Country) + yScale.bandwidth() / 2)
        .text(d => d.Value+'%');

    // Exit selection
    labels.exit().remove();

    // Update the year text
    yearText.text('Year: '+Year);
}
	
	// Initial update with the first year of data
	update(2000);
	
	// Automatic year change every second
	setInterval(() => {
		const currentYear = parseInt(yearText.text().slice(-4));
		const nextYear = currentYear + 1;
		if (nextYear <= d3.max(data, d => d.Year)) {
			update(nextYear);
		}
	}, 1000);	
}