// planning upgrade soon

const link = 'http://api.weatherapi.com/v1/current.json?key=64a9e8f18f714fb8933183915221102';

const main = document.getElementById('main');
const menu = document.getElementById('menu');

const input = document.getElementById('text-input');
const form = document.getElementById('form');

let store = {
  city: 'nyc',
  temperature: 0,
  observationTime: '00:00',
  localTime: '00:00',
  description: '',
  weatherIcon: '',
  feelslike: 1,
  properties: {
    humidity: 1,
    windSpeed: 1,
    pressure: 1,
    uvIndex: 1,
    visibility: 5,
  },
};

const funcData = async () => {
  const result = await fetch(`${link}&q=${store.city}&aqi=no`);
  const data = await result.json();
  // console.log(data);
  const {
    current: {
      condition: { text: description, icon: weatherIcon },
      temp_c: temperature,
      humidity,
      last_updated: observationTime,
      pressure_mb: pressure,
      uv: uvIndex,
      vis_km: visibility,
      wind_kph: windSpeed,
      feelslike_c: feelslike,
    },
    location: { name, localtime: localTime },
  } = data;

  store = {
    ...store,
    city: name,
    temperature,
    observationTime,
    localTime,
    description,
    weatherIcon,
    feelslike,
    properties: {
      humidity: {
        title: 'humidity',
        value: `${humidity} %`,
        icon: 'humidity.svg',
      },
      windSpeed: {
        title: 'wind speed',
        value: `${windSpeed} km/h`,
        icon: 'windspeed.svg',
      },
      pressure: {
        title: 'pressure',
        value: `${pressure / 1000}  bar`,
        icon: 'pressure.svg',
      },
      uvIndex: {
        title: 'uv Index',
        value: `${uvIndex} / 10`,
        icon: 'uvindex.svg',
      },
      visibility: {
        title: 'visibility',
        value: `${visibility} km`,
        icon: 'visibility.svg',
      },
    },
  };
  render();
  // console.log(store);
};

const renderComponent = () => {
  const { city, description, weatherIcon, observationTime, feelslike, temperature, properties } =
    store;

  return `<div class="container">
              <div class="app__top--side">
                  <div class="city">
                      <h2 class="city-name" id="name">${city}</h2>
                      <p class="dateTime">${observationTime}</p>
                      <img src="${weatherIcon}" alt="icon">
                      <p class="description">${description}</p>
                  </div>
                  <div class="city-temperature">
                      <img src="./img/icons/thermometer.svg" alt="icon">
                      <div class="city-temperature-main"><span>${Math.round(
                        temperature,
                      )}°C</span></div>
                      <div class="city-temperature-feels"><span>feels like:</span>${Math.round(
                        feelslike,
                      )}°C</div>
                  </div>
              </div>
              <div class="app___bottom--side">
                  <div class="properties">
                      ${renderItems(properties)}
                  </div>
              </div>          
          </div>`;
};

const renderItems = (properties) => {
  return Object.values(properties)
    .map(({ title, value, icon }) => {
      return `
            <div class="property">
                <p class="property-title">${title}</p> 
                <img src="./img/icons/${icon}" alt="icon">
                <p>${value}</p>
            </div>
          `;
    })
    .join('');
};

const toggleClass = () => {
  menu.classList.toggle('visible');
};

const render = () => {
  main.innerHTML = renderComponent();
  const city = document.getElementById('name');
  const close = document.getElementById('close');

  city.addEventListener('click', toggleClass);
  close.addEventListener('click', toggleClass);
};

const handleInput = (e) => {
  store = {
    ...store,
    city: e.target.value,
  };
};

const handleSubmit = (e) => {
  e.preventDefault();
  const value = store.city;

  if (!value) return null;

  funcData();
  toggleClass();
};

form.addEventListener('submit', handleSubmit);
input.addEventListener('input', handleInput);

funcData();
