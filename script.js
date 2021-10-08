const regionNamesInEnglish = new Intl.DisplayNames(['en'], { type: 'region' });

var input = document.querySelector("#input");
var btnGuess = document.querySelector(".guess");
var output = document.querySelector("#output");


btnGuess.addEventListener("click", function clickHandler()
{
	var inputValue = input.value;
	var inputNamesList = [];

	var i = 0;
	for(var i = 0; i < inputValue.length; i++)
	{
		if( inputValue[i] == " ")
		{
			inputNamesList = inputValue.split(" ");
			break;
		}
	}

	console.log(inputNamesList.length);

	if( inputNamesList.length === 0)
	{
		getNationalitySingle(inputValue);
	}
	else{
		getNationalityMultiple(inputNamesList);
	}
});



function getNationalitySingle(name)
{
	if( name === "")
	{
		output.innerText = "Please enter a name"
	}
	else{
		var url = "https://api.nationalize.io?name="+name;
		fetch(url)
		.then(response => response.json())
		.then(json => printCountryAndProbability(json, name))
		.catch(errorHandling)
	}
}

function printCountryAndProbability(json, name)
{
	var outputText = "";
	if( json.length > 1)
	{
		for( var i = 0; i < json.length ; i++)
		{
			outputText = outputText + name[i] + " is probably from " + regionNamesInEnglish.of(json[i].country[0].country_id) + "\t";
		}
		output.innerText = outputText;
	}
	else{
		output.innerText = name + " is probably from " + regionNamesInEnglish.of(json.country[0].country_id);
	}
}


function getNationalityMultiple(nameList)
{
	var url = "https://api.nationalize.io/?name[]="
	for(var i = 0; i < nameList.length-1; i++)
	{
		url = url + nameList[0] + "&name[]=";
	}

	url = url + nameList[nameList.length-1];
	fetch(url)
	.then(response => response.json())
	.then(json => printCountryAndProbability(json, nameList))
	.catch(errorHandling)

}

function errorHandling(){
	output.innerText = "Couldn't fetch data for some of the requested names ";
}