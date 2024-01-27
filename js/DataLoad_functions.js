const reader = new FileReader()

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
		

		if (ChartType === "StackedBarChart") {
			
			console.log('StackedBarChart');
			AddStackedBarChart(data, div_id);
			
		} else if (ChartType === "BarChart") {
			
			console.log('BarChart');
			AddBarChart(data, div_id);
			
		} else if (ChartType === "GroupedColumnChart") {
			
			console.log('GroupedColumnChart');
			AddGroupedColumnChart(data, div_id);
			
		}else {
			console.log('Chart Type not found');	
		}
		
	});
}

function AddBarChart(data, div_id)
{

	//console.log(barChartData);

	//Get only the desired fields
	barChartData = Object.keys(data).map(element => ({
            Year: data[element]['Year'],
			Value: data[element]['% of Population under Poverty Line']
			//,Region: data[element]['Region']
        }));
		
	
	//Sort Data by Year
	barChartData = barChartData.sort((a, b) => {return a.Year - b.Year;});
	//console.log('Remove columns and sort');	
	console.log(barChartData);
	
	drawBarChart(barChartData, div_id);
		
}


function AddStackedBarChart(data, div_id)
{

	//Filter only EU27
	barChartData = data.filter((element) => {
			return element.Region = 'EU27';
	});
	
	//console.log('Filter only EU27...');	
	//console.log(barChartData);

	//Get only the desired fields
	barChartData = Object.keys(barChartData).map(element => ({
            Year: data[element]['Year'],
			Female: data[element]['Population under Poverty Line % Female'],
			Male: data[element]['Population under Poverty Line % Male']
			//,Region: data[element]['Region']
        }));
		
	
	//Sort Data by Year
	barChartData = barChartData.sort((a, b) => {return a.Year - b.Year;});
	//console.log('Remove columns and sort');	
	console.log(barChartData);
	
	drawStackedBarChart(barChartData, div_id);
		
}

function AddGroupedColumnChart(data, div_id)
{
	
	console.log(data);
	
	drawGroupedChart(data, div_id);
		
}	
		

function PopulateDiv(data, div_id)
{
	//window.alert(JSON.parse(localStorage.getItem('dataset')));
	let options = [...new Set(data.map(d => d.MaxYear).sort())]; 
	
	//
	//let options2 = options.filter(d => d.MaxYear = 2016);
		// optionally add .sort() to the end of that line to sort the unique values
		// alphabetically rather than by insertion order

		d3.select('#my_dataviz')
  			.selectAll('option')
    		.data(filtered_options)
  			.enter()
    		.append('option')
    		.text(d => d)
    		.attr('value', d => d);

}



