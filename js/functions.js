
function LoadData()
{
	window.alert('Loading Data...');	
	d3.csv("./data/Transformed - Population_Income.csv").then(function(data) {
		localStorage.setItem('dataset', data)
	});
}

function ShowData()
{
	window.alert('Output Data...');
	// localStorage.getItem('dataset');
	window.alert(localStorage.getItem('dataset'));
}
