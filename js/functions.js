
var myGlobalVariable;

function ReadData()
{
	d3.csv("./data/Transformed - Population_Income.csv").then(function(data) {
  		myGlobalVariable = data;
	});
}

function WriteData()
{
	ReadData();
	window.alert(myGlobalVariable);	
}
