
var myGlobalVariable;

function LoadData()
{
	window.alert('Loading Data...');	
	d3.csv("./data/Transformed - Population_Income.csv").then(function(data) {
  		myGlobalVariable = data;
	});

	window.alert(myGlobalVariable);
}

function WriteData()
{
	window.alert('Loading Data...');	
	ReadData();
	window.alert('Output Data...');
	window.alert(myGlobalVariable);	
}
