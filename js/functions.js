var dataset;

function LoadData() 
{			
		d3.csv("./data/Transformed - Population_Income.csv", function(data){
			let dataset = data;
			window.alert(dataset);
		});
		
writeData();
	
}

function writeData()
{
	window.alert(dataset);
	//console.log('test');
}
