
function LoadData()
{
	console.log('Loading Data...');	
	d3.csv("./data/Transformed - Population_Income.csv").then(function(data) {
		//localStorage.setItem('dataset', JSON.stringify(data));
		
		PopulateDiv(data);
		
	});
}

function PopulateDiv(data)
{
	//window.alert(JSON.parse(localStorage.getItem('dataset')));
	window.alert(data);
}
