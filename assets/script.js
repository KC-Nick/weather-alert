var APIKey = '2c5de945f63568dd4dbf3de2fad3fcd4';
// var queryUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
var temp = document.querySelector('.temp');
var desc = document.querySelector('.desc');
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
        cityName.textContent = data.city.name;
        temp.textContent = `Temperature: ${Math.round(data.list[0].main.temp)} degrees.`;
        humidity.textContent = `Humidity: ${data.list[0].main.humidity} %`;
        windSpeed.textContent = `Wind Speed: ${Math.round(data.list[0].wind.speed)} mph.`;
        todayIcon.setAttribute('src', `https://openweathermap.org/img/w/${data.list[0].weather[0].icon}.png`)
    }
    function fiveDayDisplay(data) {
        for (let index = 0; index < data.list.length; index = index + 8) {
            console.log(data.list[index]);
            var html = `<div id="nextDay" class="five-day-forecast weatherBox">
            <h2 class="temp">${data.list[index].dt_txt.split(" ")[0]}</h2>
                <p class="desc">Temp: ${Math.round(data.list[index].main.temp)} Degrees.</p>
                <p class="humidity">Humidity: ${data.list[index].main.humidity} %</p>
                <p class="wind-speed">Wind Speed: ${Math.round(data.list[index].wind.speed)} MPH.</p>
                <p class="weather-icon">Weather: <img src="https://openweathermap.org/img/w/${data.list[index].weather[0].icon}.png"
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
    }

    // function to clear out the  fiveDayForcast div
    // that runs before we getWeather()
    function clearHTML() {
        $('.five-day-forecast').empty()
    }

    // Function to display search history on the page
    function displaySearchHistory() {
        // Get the search history from local storage
        var searchHistory = JSON.parse(localStorage.getItem('searchHistory'));

        // Check if there is search history
        if (searchHistory && searchHistory.length > 0) {
            // Loop through the search history and display it on the page
            searchHistory.forEach(function (search) {
                var query = search.query;

                // Display the search history on the page (e.g., append to a list)
                var historyItem = $('<li>' + query + '</li>').on('click', function () {
                    // clear out any old html
                    clearHTML()
                    getWeather(query);
                });
                $("#history").append(historyItem);
            });
        }
    }
    $(".submitBtn").on('click', function () {
        citySubmitHistory();
        var city = $('#city-search').val();
        clearHTML()
        getWeather(city);
    });
    displaySearchHistory();
});