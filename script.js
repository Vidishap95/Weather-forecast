var APIKey = "01b994d4dbbaa4da27706bf740410eec";
var today =dayjs();
var currentDayFormat = dayjs().format();

var cityInputBox = document.getElementById("city-input");
var citySearchBtn = document.getElementById("search-btn");
var cityHistoryEl = document.getElementById("search-history");
var currentyDayEl = document.getElementById("current-city");


var cityArray = [];
var day1card = document.getElementById('card-1');
var day1card = document.getElementById('card-2');
var day1card = document.getElementById('card-3');
var day1card = document.getElementById('card-4');
var day1card = document.getElementById('card-5');


citySearchBtn.addEventListener('click', function(event){
    event.preventDefault();
    var city =cityInputBox.value;
    fetch("http +city+"+ APIKey)
    .then(function(response){
        return response.json();
    
})
.then(function(data){
    var cityLat = data[0].lat;
    var cityLon = data [0].lan;
    getCurrentCity(cityLat, cityLon);
    getCityFiveDay(cityLat, cityLon);
    createCityHistory(city);
})
return;

});

function getCurrentCity(lat,lon) {
    fetch("http ="+ lat + "&lon=" + lon + "&appid=" + APIKey + "&units=imperial")
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

