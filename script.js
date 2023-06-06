var APIKey = "01b994d4dbbaa4da27706bf740410eec";
var today =dayjs();
var currentDayFormat = today.format('M/D/YYYY');

var cityInputBox = document.getElementById("city-input");
var citySearchBtn = document.getElementById("search-btn");
var cityHistoryEl = document.getElementById("search-history");
var currentyDayEl = document.getElementById("current-city");


var cityArray = [];
var day1card = document.getElementById('card-1');
var day2card = document.getElementById('card-2');
var day3card = document.getElementById('card-3');
var day4card = document.getElementById('card-4');
var day5card = document.getElementById('card-5');


citySearchBtn.addEventListener('click', function(event){
    event.preventDefault();
    var city =cityInputBox.value;
    fetch("https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=" + APIKey)
    .then(function(response){
        return response.json();
    
})
.then(function(data){
    var cityLat = data[0].lat;
    var cityLong = data [0].lon;
    getCurrentCity(cityLat, cityLong);
    getCityFiveDay(cityLat, cityLong);
    createCityHistory(city);
})
return;

});

cityHistoryEl.addEventListener('click', function(event){
    event.preventDefault();
    getCityHistory(event.target.id);
    return;
})


//function to get current city weather
function getCurrentCity(lat,lon) {
    fetch("https://api.openweathermap.org/data/2.5/weather?lat="+ lat + "&lon=" + lon + "&appid=" + APIKey + "&units=imperial")
    .then(function(response){
        return response.json();
    })
    .then(function (data){
        var weatherIcon = data.weather[0].icon;
        currentyDayEl.textContent = data.anme + " (" + currentDayFormat +") ";

        var temp = "Temp: "+ data.main.temp + " &degF";
        var wind = "Wind:" + data.wind.speed + "MPH";
        var humidity = "Humidity:" + data.main.humidity +"%";
        
        document.getElementById('weather-current').innerHTML = temp +"<br><br>" + wind + "<br><br>"+humidity;

    })
    return;
}

// function to fetch 5 days weather forecast
function getCityFiveDay (lat, lon) {
    fetch ("https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&units=imperial")
    .then(function(response) {
        return response.json();
    })
    .then (function(data) {
        var count = 0;
        for (var i=0; i < data.list.length; i++) {
            var timestamp = data.list[i].dt_txt;
            var dateOnly = dayjs(data.list[i].dt_txt).format('M/D/YYYY');
            var timeOnly = dayjs(data.list[i].dt_txt).format('H');

            var weatherIcon = data.list[i].weather[0].icon;
            var temp = data.list[i].main.temp;
            var wind = data.list[i].wind.speed;
            var humidity = data.list[i].main.humidity;

            if (timeOnly == 15) {
                var cardArray = [day1card, day2card, day3card, day4card, day5card]

                cardArray[count].children[0].textContent = dateOnly;
                cardArray[count].children[1].src = "https://openweathermap.org/img/wn/" + weatherIcon+ ".png";
                cardArray[count].children[2].innerHTML = "Temp:" + temp + " &degF<br><br>Wind: " + wind + " MPH<br><br>Humidity: " + humidity + "%";

                count++;
            }else {

            }
        }
    })
    return;
}

// function create historybutton for creating new search history for every city search
function createCityHistory(city) {
    var cityHistoryList = document.createElement("BUTTON");

    cityHistoryList.classList.add("btn", "btn-secondary");
    cityHistoryList.setAttribute('id', city);
    cityHistoryList.textContent = city;

    cityHistoryEl.appendChild(cityHistoryList);
    cityArray.push(city);

    localStorage.setItem("city-finder", JSON.stringify(city));
    localStorage.setItem("city-storage", JSON.stringify(cityArray));
}

//function to get city history fetch
function getCityHistory(data) {
    var city = data;
    fetch("https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=" + APIKey)
    .then (function(response) {
        return response.json();
    })
    .then(function(data) {
        var cityLat = data[0].lat;
        var cityLon = data[0].lon;

        getCurrentCity(cityLat, cityLon);
        getCityFiveDay(cityLat, cityLon);
    })
}

//Render functon to get last city name and call the array data from loca storage 
function renderLastCity () {
    var lastCity = JSON.parse(localStorage.getItem("city-finder"));
    var lastArray = JSON.parse(localStorage.getItem("city-storage"));
    if (lastCity !== null) {
        cityInputBox.value = lastCity;

        for(var i =0; i<lastArray.length; i++)  {
            var lastCityHistoryList = document.createElement("BUTTON");

            lastCityHistoryList.classList.add("btn", "btn-secondary");
            lastCityHistoryList.setAttribute('id', lastArray[i]);
            lastCityHistoryList.textContent = lastArray[i];

            cityHistoryEl.appendChild(lastCityHistoryList);
        }
    } else {
        return;
    }
}

function initial () {
    renderLastCity();
}

initial();