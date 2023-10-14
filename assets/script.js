var APIKey = '2c5de945f63568dd4dbf3de2fad3fcd4';
var temp = document.querySelector('.temp');
var weatherForecast = document.querySelector('.weather-forecast');
var windSpeed = document.querySelector('.wind-speed');
var cityName = document.querySelector('.city-name');
var humidity = document.querySelector('.humidity');
var btn = document.querySelector('.submitBtn');
var fiveDayForecast = document.querySelector('.five-day-forecast');
var weather = document.querySelector('.weather')
var todayIcon = document.getElementById('weather-icon')

$(document).ready(function () {
    function weatherDisplay(data) {
        console.log(data);
        var html = `<div id="currentDay" class="weather-box">
        <h2 class="city-name"><strong>${data.city.name} Today;</strong></h2>
        <p class="temp"><strong>Temp</strong>: ${Math.round(data.list[0].main.temp)} Degrees.</p>
        <p class="humidity"><strong>Humidity</strong>: ${data.list[0].main.humidity} %</p>
        <p class="wind-speed"><strong>Wind Speed</strong>: ${Math.round(data.list[0].wind.speed)} MPH.</p>
        <p class="weather-icon"><strong>Weather</strong>: <img src="https://openweathermap.org/img/w/${data.list[0].weather[0].icon}.png"
        </div>`
        weatherForecast.insertAdjacentHTML("afterbegin", html);
    }
    // Function to display search history on the page
    function displaySearchHistory() {
        // Get the search history from local storage
        var searchHistory = JSON.parse(localStorage.getItem('searchHistory'));
        console.log(searchHistory);
        // Check if there is search history
        if (searchHistory && searchHistory.length > 0) {
            // Loop through the search history and display it on the page
            $('#history').empty();
            searchHistory.forEach(function (search) {
                var query = search.query;

                // Display the search history on the page (e.g., append to a list)
                var historyItem = $('<li>' + query + '</li>').on('click', function () {
                    // clear out any old html
                    clearHTML();
                    getWeather(query);
                    weatherForecast.style.display = "block";
                });
                $("#history").append(historyItem);
            });
        }
    }
    function fiveDayDisplay(data) {
        for (let index = 0; index < data.list.length; index = index + 8) {
            console.log(data.list[index]);
            var apiDate = data.list[index].dt_txt.split(" ")[0];
            var dateObj = new Date(apiDate);
            var formattedDate = dateObj.toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
            var html = `<div class="five-day-forecast weatherBox">
            <h2 class="today">${formattedDate}</h2>
                <p class="temp"><strong>Temp</strong>: ${Math.round(data.list[index].main.temp)} Degrees.</p>
                <p class="humidity"><strong>Humidity</strong>: ${data.list[index].main.humidity} %</p>
                <p class="wind-speed"><strong>Wind Speed</strong>: ${Math.round(data.list[index].wind.speed)} MPH.</p>
                <p class="weather-icon"><strong>Weather</strong>: <img src="https://openweathermap.org/img/w/${data.list[index].weather[0].icon}.png"
        </div>`
            fiveDayForecast.insertAdjacentHTML("beforeend", html);
        }
    }
    function getWeather(city) {
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=2c5de945f63568dd4dbf3de2fad3fcd4&units=imperial`)
            .then(response => {
                return response.json()
            })
            .then(data => {
                weatherDisplay(data);
                fiveDayDisplay(data);
            })
    };

    function citySubmitHistory() {
        // Get the search query and format values
        var query = $('#city-search').val();
        var format = $('#form-input').val();

        // Create an object or array to store the search history
        var searchHistory = [];

        // Check if there is existing search history in local storage
        if (localStorage.getItem('searchHistory')) {
            // Retrieve the existing search history from local storage
            searchHistory = JSON.parse(localStorage.getItem('searchHistory'));
        }

        // Add the search query and format values to the search history
        searchHistory.push({ query, format });

        // Convert the search history to a JSON string
        var searchHistoryString = JSON.stringify(searchHistory);

        // Store the JSON string in local storage
        localStorage.setItem('searchHistory', searchHistoryString);
        displaySearchHistory();
    }

    // function to clear out the  fiveDayForcast div
    // that runs before we getWeather()
    function clearHTML() {
        $('.weather-box').empty()
        $('.five-day-forecast').empty()
    }
    $(".submitBtn").on('click', function () {
        citySubmitHistory();
        var city = $('#city-search').val();
        clearHTML();
        getWeather(city);
        weatherForecast.style.display = "block";
    });
    displaySearchHistory();
});