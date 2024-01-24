
var myGlobalVariable;

function LoadData()
{
	console.log('Loading Data...');	
	d3.csv("./data/Transformed - Population_Income.csv").then(function(data) {
  		myGlobalVariable = data;
	});

	console.log(myGlobalVariable);
}

function WriteData()
{
	window.alert('Loading Data...');	
	ReadData();
	window.alert('Output Data...');
	window.alert(myGlobalVariable);	
}
