// check local storage and initialize storage variable
var cities = JSON.parse(localStorage.getItem("cities"));
if (!cities) {
  cities = {}
} else {
  historyFunction(cities);
}
console.log(cities)

// On Button Clink
function searchCoordsFunction() {
    var APIKey = "642b965a11b50c9be2b1b21f3c287306";
  
// function to fetch current weather 
    let cityName = document.querySelector("#search input").value;
    let currentApiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;
    fetch(currentApiUrl)
      .then(function (response) {
        if (response.ok) {
          response.json()
            .then(function (data) {
              let lat = (data.coord.lat);
              let lon = (data.coord.lon);
              let dt = (data.dt);
              weatherFunction(cityName, dt, lat, lon, APIKey);
            });
        } else {
          alert("Error: " + response.statusText);
        }
      });
  };


function weatherFunction(cityName, dt, lat, lon, APIKey) {
    let city = {
      today: {},
      forecast: {}
    };
    let oneCallApiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&dt=" + dt + "&units=imperial&appid=" + APIKey;
    
    // send coordinates to fetch one call
    fetch(oneCallApiUrl).then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data)
          city.today = {
            date: String(new Date(dt * 1000)),
            icon: data.current.weather[0].icon,
            temp: data.current.temp,
            wind: data.current.wind_speed,
            humidity: data.current.humidity,
            uvi: data.current.uvi
          };
          // places forecast data
          for (i = 1; i < 6; i++) {
            city.forecast[i] = {
              date: String(new Date(data.daily[i].dt * 1000)),
              icon: data.daily[i].weather[0].icon,
              temp: data.daily[i].temp.day,
              wind: data.daily[i].wind_speed,
              humidity: data.daily[i].humidity,
            }
          }
  
          cities[cityName] = city;
          localStorage.setItem("cities", JSON.stringify(cities));
          historyFunction(cities);
          displayFunction(cityName)
        });
      } else {
        alert("Error: " + response.statusText);
      }
    });
  };

// History buttons based on localstorage
function historyFunction(cities) {
    document.getElementById("bottom").innerHTML = ""
    for (const city in cities) {
      let buttonEl = document.createElement("button");
      buttonEl.onclick = function () {
        displayFunction(city)
      }
      buttonEl.innerText = String(city);
      document.getElementById("bottom").append(buttonEl);
    }
  }


function displayFunction(city) {
    console.log("displaying for .. " + city)
  
    // clear daily
    document.getElementById("today").innerText = "";
    // display daily
    let dateHeaderEl = document.createElement("h2")
    dateHeaderEl.innerText = (cities[city].today.date).substr(0, 10)
    document.getElementById("today").appendChild(dateHeaderEl)
    let iconImgEl = document.createElement("img")
    iconImgEl.src = "http://openweathermap.org/img/wn/" + (cities[city].today.icon) + "@2x.png";
    dateHeaderEl.append(iconImgEl)
  
    let tempDivEl = document.createElement("h4")
    tempDivEl.innerText = "Temp: " + cities[city].today.temp + " °F"
    document.getElementById("today").appendChild(tempDivEl)
  
    let windDivEl = document.createElement("h4")
    windDivEl.innerText = "Wind: " + cities[city].today.wind + " MPH"
    document.getElementById("today").appendChild(windDivEl)
  
    let humidityDivEl = document.createElement("h4")
    humidityDivEl.innerText = "Humidity: " + cities[city].today.humidity + " %"
    document.getElementById("today").appendChild(humidityDivEl)
  
    let uviDivEl = document.createElement("h4")
    uviDivEl.innerText = "UV Index: " + cities[city].today.uvi
    document.getElementById("today").appendChild(uviDivEl)
  
    let uviCondition = "";
    if (cities[city].today.uvi >= 0 && cities[city].today.uvi < 2){
      uviCondition = "Green"
    } else if (cities[city].today.uvi > 3 && cities[city].today.uvi < 5){
      uviCondition = "Yellow"
    } else if (cities[city].today.uvi > 6 && cities[city].today.uvi < 7){
      uviCondition = "Orange"
    } else {uviCondition = "Red"}
  
    uviDivEl.style.backgroundColor = uviCondition
  
    // clear forecast
    for (var i = 1; i < 6; i++) {
      document.querySelector(".day" + i).innerHTML = ""
    }
    // display forecast
    for (var i = 1; i < 6; i++) {
      let dateSpanEl = document.createElement("span")
      dateSpanEl.innerText = (cities[city].forecast[i].date).substr(0, 10)
      document.querySelector(".day" + i).appendChild(dateSpanEl)
  
      let iconImgEl = document.createElement("img")
      iconImgEl.src = "http://openweathermap.org/img/wn/" + (cities[city].forecast[i].icon) + "@2x.png";
      document.querySelector(".day" + i).appendChild(iconImgEl)
  
      let tempDivEl = document.createElement("span")
      tempDivEl.innerText = "Temp: " + cities[city].forecast[i].temp + " °F"
      document.querySelector(".day" + i).appendChild(tempDivEl)
  
      let windDivEl = document.createElement("span")
      windDivEl.innerText = "Wind: " + cities[city].forecast[i].wind + " MPH"
      document.querySelector(".day" + i).appendChild(windDivEl)
  
      let humidityDivEl = document.createElement("span")
      humidityDivEl.innerText = "Humidity: " + cities[city].forecast[i].humidity + " %"
      document.querySelector(".day" + i).appendChild(humidityDivEl)
    }
  
  }