var APIKey = '2c5de945f63568dd4dbf3de2fad3fcd4';
// var queryUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
var temp = document.querySelector('.temp');
var desc = document.querySelector('.desc');
var windSpeed = document.querySelector('.wind-speed');
var cityName = document.querySelector('.city-name');
var humidity = document.querySelector('.humidity');
var btn = document.querySelector('.submitBtn');
var fiveDayForecast = document.querySelector('.five-day-forecast');

// Mapping between weather conditions and icons
var weatherIcons = {
    Clear: './assets/clear-sky.png',
    Clouds: './assets/cloud.png',
    Rain: './assets/rain.png',
    Snow: './assets/snow.png'
};
$(document).ready(function () {
    function weatherDisplay(data) {
        console.log(data);
        cityName.textContent = data.city.name;
        temp.textContent = `Temperature: ${data.list[0].main.temp} degrees.`;
        humidity.textContent = `Humidity: ${data.list[0].main.humidity} %`;
        windSpeed.textContent = `Wind Speed: ${data.list[0].wind.speed} mph.`;
    }
    function fiveDayDisplay(data) {
        for (let index = 0; index < data.list.length; index = index + 8) {
            console.log(data.list[index]);
            var html = `<div id="nextDay" class="five-day-forecast weatherBox">
            <h2 class="temp">${data.list[index].dt_txt.split(" ")[0]}</h2>
                <p class="desc">Temp: ${data.list[index].main.temp} Degrees.</p>
                <p class="humidity">Humidity: ${data.list[index].main.humidity} %</p>
                <p class="wind-speed">Wind Speed: ${data.list[index].wind.speed} MPH.</p>
        </div>`
            fiveDayForecast.insertAdjacentHTML("beforeend", html);
            // Access the weather condition
            var weatherCondition = data.list[0].weather[0].main;
            // Retrieve the corresponding icon based on the weather condition
            var iconSrc = weatherIcons[weatherCondition];
            // Create and set the icon image element
            var iconImg = $('<img>').attr('src', iconSrc).attr('class', 'weatherIcon');
            console.log({ iconImg });
            // Append the icon image to the container
            $('.weatherBox').append(iconImg);
        }
    }
    function getWeather(city) {
        // var city = $('#city-search').val();
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
                    getWeather(query);
                });
                $("#history").append(historyItem);
            });
        }
    }
    $(".submitBtn").on('click', function () {
        citySubmitHistory();
        var city = $('#city-search').val();
        getWeather(city);
    });
    displaySearchHistory();
});