var cities_name=[];
var cityFormEl=document.querySelector("#search-form");
var cityInputEl=document.querySelector("#city");
var weatherEl=document.querySelector("#current-weather-container");
var citySearchEl = document.querySelector("#searched-city");
var forecast_fiveday = document.querySelector("#forecast");
var forecastContainerEl = document.querySelector("#fiveday-weather-container");
var search_HistoryButtonEl = document.querySelector("#past-search-buttons");
var apiKey = "363b3ab162ca6f58342a47ebc3324814";


var formSumbitHandler =function(event){
    event.preventDefault();
    var city=cityInputEl.value.trim();
    if(city){
        getCurrentWeather(city);
        five_dayWeather(city);
        cities_name.unshift({city});
        cityInputEl.value="";
    }else{
        alert("Please enter a city");
    }
    save_Search();
    search_History(city);
}

var save_Search = function(){
    localStorage.setItem("cities_name",JSON.stringify(cities_name))
}
var getCurrentWeather = function(city){
    var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`
    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            displayWeather(data, city);
        });
    });
};

var displayWeather = function(weather, searchCity){
    weatherEl.textContent= "";  
    citySearchEl.textContent=searchCity;
 
    //create date element
   var currentDate = document.createElement("span");
   currentDate.textContent="(" + moment(weather.dt.value).format("MM/DD/YYYY") + ") ";
   citySearchEl.appendChild(currentDate);
   //create Image
   var weatherIcon = document.createElement("img")
   weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
   citySearchEl.appendChild(weatherIcon);
   //create a span element to hold temperature data
   var temperatureEl = document.createElement("span");
   temperatureEl.textContent = "Temperature: " + weather.main.temp + " °F";
   temperatureEl.classList ="list-group-item";
   //create a span element to hold Humidity data
   var humidityEl = document.createElement("span");
   humidityEl.textContent = "Humidity: " + weather.main.humidity + " %";
   humidityEl.classList = "list-group-item"
   //create a span element to hold Wind data
   var windSpeedEl = document.createElement("span");
   windSpeedEl.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
   windSpeedEl.classList = "list-group-item"
   //append to container
   weatherEl.appendChild(temperatureEl);
   weatherEl.appendChild(humidityEl);
   weatherEl.appendChild(windSpeedEl);

   var lat = weather.coord.lat;
   var lon = weather.coord.lon;
   UvIndex(lat,lon)
}

var UvIndex = function(lat,lon){
    
    var apiURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`;
    
    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            displayUvIndex(data)
        
        });
    });
    
};
 //to display uvIndex 
var displayUvIndex = function(index){
    var uvIndexEl = document.createElement("div");
    uvIndexEl.textContent = "UV Index: ";
    uvIndexEl.classList = "list-group-item";
    uvIndexValue = document.createElement("span");
    uvIndexValue.textContent = index.value;
    if(index.value <=2){
        uvIndexValue.classList = "favorable"
    }else if(index.value >2 && index.value<=8){
        uvIndexValue.classList = "moderate "
    }
    else if(index.value >8){
        uvIndexValue.classList = "severe"
    };
    uvIndexEl.appendChild(uvIndexValue);
    weatherEl.appendChild(uvIndexEl);
}
//getting 5-day forecast
var five_dayWeather= function(city){
    var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiUrl)
    .then(function(response){
        response.json().then(function(data){
            display5day(data);
        });
    });
};
 
//display 5-day forecast
var display5day=function(weather){
    forecastContainerEl.textContent="";
    forecast_fiveday.textContent="5-Day Forecast:";

    var forecast=weather.list;
    for(i=5;i < forecast.length;i=i+8){
        var dailyForecast=forecast[i];
        var forecastEl=document.createElement("div");
        forecastEl.classList="card bg-primary text-light m-2";

        var forecastDate=document.createElement("h5")
        forecastDate.textContent=moment.unix(dailyForecast.dt).format("MM/DD/YYYY");
        forecastDate.classList="card-header text-center";
        forecastEl.appendChild(forecastDate);

        var weatherIcon=document.createElement("img");
        weatherIcon.classList="card-body text-center";
        weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`);
        forecastEl.appendChild(weatherIcon);

       var forecastTempEl=document.createElement("span");
       forecastTempEl.classList = "card-body text-center";
       forecastTempEl.textContent = dailyForecast.main.temp + " °F";
       console.log(dailyForecast.main.temp);
       forecastEl.appendChild(forecastTempEl);

       var forecastHumEl=document.createElement("span");
       forecastHumEl.classList = "card-body text-center";
       forecastHumEl.textContent = dailyForecast.main.humidity + "  %";
       forecastEl.appendChild(forecastHumEl);

       forecastContainerEl.appendChild(forecastEl);
    }
}
 //getting the searched cities
var search_History = function(search_History){

    search_HistoryEl = document.createElement("button");
    search_HistoryEl.textContent = search_History;
    search_HistoryEl.classList = "d-flex w-100 btn-light border p-3";
    search_HistoryEl.setAttribute("data-city",search_History);
    search_HistoryEl.setAttribute("type", "submit");

    search_HistoryButtonEl.prepend(search_HistoryEl);
};
 //re search the city from saved history
var search_HistoryHandler = function(event){
    var city = event.target.getAttribute("data-city")
    if(city){
        getCurrentWeather(city);
        five_dayWeather(city);
    }
}
//Event listeners
cityFormEl.addEventListener("submit", formSumbitHandler);
search_HistoryButtonEl.addEventListener("click", search_HistoryHandler);



 

   