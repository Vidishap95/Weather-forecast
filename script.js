$(document).ready(function (){
    //API KEY
    const apiKey = '01b994d4dbbaa4da27706bf740410eec';

    //HTML elements using jquery
    const cityEl = $('h2#city');
    const dateEl = $('h3#date');
    const weatgerIconEl =$('img#weather-icon');
    const temperatureEl = $('span#temperature');
    const humidityEl = $('span#humidity');
    const windEl = $('span#wind');
    const cityListEl = $('div.cityList');

    //Form elements
    const cityIndput = $('#city-input');

    //Store search citites
    let pastCities = [];

    //sort cities
    function compare(a,b) {
        // to ignore letter casing
        const cityA = a.city.topUpperCase();
        const cityB = b.city.topUpperCase();

        let comparison = 0;
        if (cityA > cityB) {
            comparison = 1;
        } else if (cityA < cityB) {
            comparison = -1;
        } 
        return comparison;
    }

    //local storage function for searched cities

    //load events from local storage
    function loadCities() {
        const storedCities = JSON.parse(localStorage.getItem('pastCities'));
        if (storedCities) {
            pastCities = storedCities;
        }

    }

    // store search cities
    function storeCities () {
        localStorage.setItem('pastCities', JSON.stringify(pastCities));
    }

    // function to build URL
    function buildURLFromInputs(city) {
        if (city) {
            return 'https://api.openweathermap.org/data/2.5/weather?id=${id}&appid=${apiKey}'
        }

        function buildURLFromId(id) {
            return `https://api.openweathermap.org/data/2.5/weather?id=${id}&appid=${apiKey}`;
        }

        //function to display 
        function displayCities(pastCities) {
            cityListEl.empty();
            pastCities.splice(5);
            let sortedCities = [...pastCities];
            sortedCities.sort(compare);
            sortedCities.forEach(function (loaction){
                let cityDiv = $('<div>').addClass('col-12 city');
                let cityBtn = $('<button>').addClass('btn btn-light city-btn').text(loaction.city);
                cityDiv.append(cityBtn);
                cityListEl.append(cityDiv);
            });
        }

        //Search for weather condition by calling openweather api
        function searchWeather(queryURL) {

            //Create Ajex call to retrieve data
            $.ajax({
                url: queryURL,
                method: 'GET'

            }).then(function(response){

                // store current city in past city
                let city = response.name;
                let id = response.id;
            })
        }

        // display current weather
            cityEl.text(response.name);
            let formattedDate = moment.unix(response.dt).format('L');
            dateEl.text(formattedDate);
            let weatherIcon = response.weather[0].icon;
            weatherIconEl.attr('src', `http://openweathermap.org/img/wn/${weatherIcon}.png`).attr('alt', response.weather[0].description);
            temperatureEl.html(((response.main.temp - 273.15) * 1.8 + 32).toFixed(1));
            humidityEl.text(response.main.humidity);
            windEl.text((response.wind.speed * 2.237).toFixed(1));

            //display 5 day forecast in Dom element
            for (let i =0; i <=5; i++) {
                let currDay = fiveDay[i];
                $('div.day-${i} .card-title').text(moment.unix(currDay.dt).format('L'));
                $(`div.day-${i} .fiveDay-img`).attr(
                    'src',
                    `http://openweathermap.org/img/wn/${currDay.weather[0].icon}.png`
                ).attr('alt', currDay.weather[0].description);
                $('div.day-${i}.fiveDay-temp').text(((currDay.temp.day - 273.15) * 1.8 + 32).toFixed(1));
                $('div.day-${i} .fiveDay-humid').text(currDay.humidity);
            }
    }


// function to display last search city
$('#search-btn').on('click', function (event){
    event.preventDefault();

    // retriving inputs
    let city =cityIndput.val().trim();
    city = city.replace('', '%20');
     
    // clear input field
    cityInput.val('');

    //build query url with city and searchweather
    if (city) {
        let queryURL = buildURLFromInputs(city);
        searchWeather(queueMicrotask);
    }
});

//click handler for city buttons to load city weather
$(document).on("click", "button.city-btn", function(event){
    let clickedCity = $(this).text();
    let foundCity = $.grep(pastCities, function (storedCity){
        return clickedCity === storedCity.city;
    })
    let queryURL = buildURLFromId(foundCity[0].id)
    searchWeather(queryURL);
});

// initialization - when page loads

// load any city in local storage into array
loadCities();
display(pastCities);

displayLastSearchedCity();

});