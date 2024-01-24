
function LoadData()
{
	console.log('Loading Data...');	
	d3.csv("./data/Transformed - Population_Income.csv").then(function(data) {
		localStorage.setItem('dataset', JSON.stringify(data));
	});
}

function ShowData()
{
	window.alert(JSON.parse(localStorage.getItem('dataset')));
}
