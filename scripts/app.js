const cityInput = document.querySelector(".city-input");
const searchBtn = document.querySelector(".search-btn");
const apiKey = "332947e168d4aed84fd765cd25cea19a";

// https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}

// Display Texts
const cityTxt = document.querySelector(".city");
const tempTxt = document.querySelector(".temp");
const humidityTxt = document.querySelector(".humidity");
const windTxt = document.querySelector(".windspeed");
const conditionTxt = document.querySelector(".condition");
const conditionImg = document.querySelector(".condition-img");

// Container
const tempContainer = document.querySelector(".temp-container");
const forecastContainer = document.querySelector(".forecast-container");
const otherDataContainer = document.querySelector(".otherdata-container");
const rightSideContainer = document.querySelector(".right-side-container");
const bodyContainer = document.querySelector(".body-container");

// Date
const dateTxt = document.querySelector(".date");

function showItems() {
  if (
    tempContainer.classList.contains("hide-this") &&
    otherDataContainer.classList.contains("hide-this") &&
    rightSideContainer.classList.contains("hide-this")
  ) {
    tempContainer.classList.remove("hide-this");
    otherDataContainer.classList.remove("hide-this");
    rightSideContainer.classList.remove("hide-this");
  }
}

function hideItems() {
  tempContainer.classList.add("hide-this");
  otherDataContainer.classList.add("hide-this");
  rightSideContainer.classList.add("hide-this");
}

searchBtn.addEventListener("click", () => {
  if (cityInput.value.trim() != "") {
    weatherInfoUpdate(cityInput.value);
    cityInput.value = "";
    cityInput.blur();
  }
});

cityInput.addEventListener("keydown", (event) => {
  if (event.key == "Enter" && cityInput.value.trim() != "") {
    weatherInfoUpdate(cityInput.value);
    cityInput.value = "";
    cityInput.blur();
  }
});

function getCurrentDate() {
  const currentDate = new Date();
  const options = {
    weekday: "short",
    day: "2-digit",
    month: "short",
  };
  return currentDate.toLocaleDateString("en-GB", options);
}

async function getData(endpoint, city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/${endpoint}?q=${city}&appid=${apiKey}&units=metric`;
  const respond = await fetch(apiUrl);
  return respond.json();
}

async function weatherInfoUpdate(city) {
  const weatherData = await getData("weather", city);

  if (weatherData.cod != 200) {
    cityTxt.textContent = "City Not Found";
    hideItems();
  } else {
    showItems();
    // console.log(weatherData);
    // console.log(weatherData.cod);
    const {
      name: country,
      main: { temp, humidity },
      weather: [{ main }],
      wind: { speed },
    } = weatherData;

    if (main == "Clear") {
      conditionImg.src = "./assests/images/weather/clear-day.svg";
    } else if (main == "Thunderstorm") {
      conditionImg.src = "./assests/images/weather/thunder-day.svg";
    } else if (main == "Drizzle") {
      conditionImg.src = "./assests/images/weather/rain-day.svg";
    } else if (main == "Rain") {
      conditionImg.src = "./assests/images/weather/rain-day.svg";
    } else if (main == "Snow") {
      conditionImg.src = "./assests/images/weather/snow-day.svg";
    } else if (main == "Atmosphere") {
      conditionImg.src = "./assests/images/weather/cloud-day.svg";
    } else if (main == "Clouds") {
      conditionImg.src = "./assests/images/weather/cloud-day.svg";
    }

    dateTxt.textContent = getCurrentDate();
    await forecastInfoUpdate(city);

    cityTxt.textContent = country;
    tempTxt.textContent = Math.round(temp);
    humidityTxt.textContent = humidity + "%";
    windTxt.textContent = speed + "km/h";
    conditionTxt.textContent = main;
  }
}

async function forecastInfoUpdate(city) {
  const forecastData = await getData("forecast", city);
  const timeTaken = "12:00:00";
  const today = new Date().toISOString().split("T")[0];

  forecastContainer.innerHTML = "";
  forecastData.list.forEach((forecastWeather) => {
    if (
      forecastWeather.dt_txt.includes(timeTaken) &&
      !forecastWeather.dt_txt.includes(today)
    ) {
      updateForecastItems(forecastWeather);
    }
  });
}

function updateForecastItems(weatherData) {
  console.log(weatherData);
  const {
    dt_txt: date,
    weather: [{ id, main }],
    main: { temp },
  } = weatherData;
  let forecastConditionImg = "";
  if (main == "Clear") {
    forecastConditionImg = "clear-day.svg";
  } else if (main == "Thunderstorm") {
    forecastConditionImg = "thunder-day.svg";
  } else if (main == "Drizzle") {
    forecastConditionImg = "rain-day.svg";
  } else if (main == "Rain") {
    forecastConditionImg = "rain-day.svg";
  } else if (main == "Snow") {
    forecastConditionImg = "snow-day.svg";
  } else if (main == "Atmosphere") {
    forecastConditionImg = "cloud-day.svg";
  } else if (main == "Clouds") {
    forecastConditionImg = "cloud-day.svg";
  }

  const dateTaken = new Date(date);
  const dateOption = {
    day: "2-digit",
    month: "short",
  };
  const resultDate = dateTaken.toLocaleDateString("en-US", dateOption);

  const forecastItem = `
        <div class="flex justify-evenly items-center bg-slate-600 rounded-md bg-clip-padding backdrop-filter backdrop-blur-3xl bg-opacity-20 m-4 shadow text-style-shadow">
            <span>${resultDate}</span>
            <img src="./assests/images/weather/${forecastConditionImg}" alt="weather" class="size-14 md:size-20">
            <h1>${Math.round(temp)} &deg;C</h1>
         </div>
    `;
  forecastContainer.insertAdjacentHTML("beforeend", forecastItem);
}
