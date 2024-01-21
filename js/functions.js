function LoadData() {			
		d3.csv("./data/Transformed - Population_Income.csv", function(data){
			//console.log(data);
			writeData(data)
		});
}

function writeData()
{
	d3.select("body")
        .selectAll("p")
        .data(data)
        .enter()
        .append("p")
        .text(function(d) {
            return d.name + ", " + d.location;
        });

}
