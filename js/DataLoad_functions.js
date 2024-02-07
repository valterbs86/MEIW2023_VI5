//Função para ler csv sem webserver

/*const reader = new FileReader()

function read(input) {
	const csv = input.files[0]
	reader.readAsText(csv)
}

reader.onload = function (e) {
	csv_To_Array(e.target.result);
	// return the array
	document.querySelector('.output').innerText = e.target.result;
	document.querySelector('.output').style.marginTop = "50px";
	document.querySelector('.output').style.marginLeft = "50px";
	document.querySelector('.output').style.border = "thick solid #0000FF";
	
}


function csv_To_Array(str, delimiter = ',') {
  const header_cols = str.slice(0, str.indexOf('\n')).split(delimiter);
  const row_data = str.slice(str.indexOf('\n') + 1).split('\n');
  const arr = row_data.map(function(row) {
    const values = row.split(delimiter);
    const el = header_cols.reduce(function(object, header, index) {
      object[header] = values[index];
      return object;
    }, {});
    return el;
  });
  
  // return the array
  console.log(arr);
}
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