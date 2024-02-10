/*
Mestrado em Engenharia Informática e Tecnologia Web
Visualização de Informação
Projeto Final
Grupo: Claudia Pires (1303334) / Valter Bastos (2302612)
Ficheiro JS
*/

function LoadData(File, ChartType, div_id)
{

	console.log('Loading Data...');	
	console.log(div_id);	
	
	d3.csv(File).then(function(data) {
		//localStorage.setItem('dataset', JSON.stringify(data));
		
		//console.log(data);	
		
		//Replace empty by N/A
		data = JSON.parse(JSON.stringify(data), (key, value) => value === "" ? "N/A": value);
		data = JSON.parse(JSON.stringify(data), (key, value) => value === "#DIV/0!" ? "0": value);
		
		//console.log('Replace empties...');	
		//console.log(data);	
		

		if (ChartType === "LineChart") {
			
			console.log('LineChart');
			PrepareLineChartData(data, div_id);
			
		} 
		if (ChartType === "WorldMapChart") {
			
			console.log('WorldMapChart');
			PrepareMapChartData(File, div_id);
			
		} else if (ChartType === "RaceBarChart") {
			
			console.log('RaceBarChart');
			PrepareRaceBarChartData(data, div_id);
			
		} else if (ChartType === "LolipopChart") {
			
			console.log('LolipopChart');
			PrepareLolipopChartData(data, div_id);
			
		} else {
			console.log('Chart Type not found');	
		}
		
	});
}

function PrepareLineChartData(data, div_id)
{
	
	console.log(data);
	
	var parseYear = d3.timeParse("%Y");
		
	data.forEach(item => {
		item.Year = parseYear(item.Year); // or parseFloat(item.Year) for floating-point numbers
		item.Avg_Share_of_pop = +item.Avg_Share_of_pop;
		item.Avg_Share_of_pop = parseFloat(item.Avg_Share_of_pop).toFixed(2);
	});
	
	drawLineChart(data, div_id);		
}	

function PrepareMapChartData(file, div_id)
{
	console.log(file);
	drawMapChart(file, div_id);	
	
}	


function PrepareRaceBarChartData(data, div_id)
{
	data.forEach(item => {
		item.Year = parseInt(item.Year); // or parseFloat(item.Year) for floating-point numbers
	});
	
	data.forEach(item => {
		item.Value = parseFloat(item.Value).toFixed(2); // or parseFloat(item.Year) for floating-point numbers
	});


	console.log(data);
	drawRaceBarChart(data, div_id);		
}	

function PrepareLolipopChartData(data, div_id)
{
	
	console.log(data);
	drawLolipopChart(data, div_id);		
}	