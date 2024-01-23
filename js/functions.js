function GetData() 
{			
		var dataset = d3.csv("./data/Transformed - Population_Income.csv", function(data){
			return{ data: data}	
		});
}

function WriteData()
{
	window.alert(dataset.data);
	//console.log('test');
}
