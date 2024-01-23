
var myGlobalVariable;

function ReadData()
{
	d3.csv("./data/Transformed - Population_Income.csv").then(function(data) {
  		myGlobalVariable = data;
	});
}

function WriteData()
{
	window.alert('Reading Data...');	
	ReadData();
	window.alert(myGlobalVariable);	
}
