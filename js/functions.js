var dataset;

function LoadData() 
{			
		d3.csv("./data/Transformed - Population_Income.csv", function(data){
			let dataset = data;
			//window.alert(dataset);
		});
		
writeData(dataset);
	
}

function writeData(dataset)
{
	window.alert(dataset);
	//console.log('test');
}
