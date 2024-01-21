function LoadData() {			
		d3.csv("./data/Transformed - Population_Income.csv", function(data){
			//console.log(data);
			d3.select("#my_dataviz")
        			.selectAll("p")
        			.data(d3.map(data, function(d){return d.MaxYear;}).keys())data(data)
        			.enter()
        			.append("p")
        			.text(function(d) {
            				return d.MaxYear;
        			});
		});
}

function writeData()
{

}
