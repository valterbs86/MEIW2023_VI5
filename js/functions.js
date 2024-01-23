
var myGlobalVariable;

function ReadData()
{
	window.alert('Storing Data...');	
	d3.csv("./data/Transformed - Population_Income.csv").then(function(data) {
  		myGlobalVariable = data;
	});
}

function WriteData()
{
	window.alert('Loading Data...');	
	ReadData();
	window.alert('Output Data...');
	window.alert(myGlobalVariable);	
}
