var dataset = d3.csv("./data/Transformed - Population_Income.csv", function(data){
	return{ data}	
});


function WriteData()
{
	let result = dataset();
	window.alert(GetData());	
}
