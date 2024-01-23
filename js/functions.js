var dataset;

function LoadData() 
{			
		d3.csv("./data/Transformed - Population_Income.csv", function(data){
			let dataset = data;
		});
		
writeData();
	
}

function writeData()
{
	console.log(dataset);
}
