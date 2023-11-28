
const APIKEY = "0d521a846cb3440a94710259230211";
const APIURL = "https://api.weatherapi.com/v1/forecast.json";
const APIURL_SEARCH = "https://api.weatherapi.com/v1/search.json";
var containerCurrent = document.getElementById('day-info-container');
var containerForecast = document.getElementById('forecast-data');

var body = document.querySelector('body');
var root = document.createElement(':root');

var isDay = false;
 
var forecastHeading = document.querySelector('.forecast-heading');


async function loadData(input) {
    var city = input.value;
    
    var promise = await fetch(`${APIURL}?key=${APIKEY}&q=${city}&days=10&aqi=no&alerts=no&lang=pt`);
    var response = await promise.json();
    
    if (promise.ok) {
        // Dados da localização procurada
        var dataLocation = response.location;
        // Dados do tempo atuais
        var dataCurrent = response.current;
        // Dados da previsão do tempo dos prox 10 dias
        var dataforecast = response.forecast.forecastday;

        forecastHeading.style.display = 'flex';
        
        if (dataCurrent.is_day) { // Caso o local pesquisado esteja dia
            isDay = true;
            body.style.backgroundImage = "url('../img/sun-background.png')";
            containerCurrent.innerHTML = `
            <div class="day-info-top">
                <span class="primary-text">Hoje</span>
                <p id="date" class="secondary-text">${dataLocation.localtime}</p>
                </div>
                <div class="day-info-bottom">
                <h2 id="temperature" class="primary-text">${dataCurrent.temp_c}°C</h2>
                <p id="place" class="secondary-text">${dataLocation.name}, ${dataLocation.country} <i class="fa-solid fa-sun" style="color: #ffd500;"></i></p>
            </div>`;
        } else {  // Caso o local pesquisado esteja noite
            isday = false;
            body.style.backgroundImage = "url('../img/moon-background.png')";
            containerCurrent.innerHTML = `
            <div class="day-info-top">
            <span class="primary-text">Hoje</span>
            <p id="date" class="secondary-text">${dataLocation.localtime}</p>
            </div>
            <div class="day-info-bottom">
            <h2 id="temperature" class="primary-text">${dataCurrent.temp_c}°C</h2>
            <p id="place" class="secondary-text">${dataLocation.name}, ${dataLocation.country} <i class="fa-solid fa-moon" style="color: #422475;"></i></p>
            </div>`;
        }
        
        containerForecast.innerHTML = ``; // Limpar conteúdo anterior
        for (var i = 1; i < dataforecast.length; i++) {

            containerForecast.innerHTML +=` 
            <div class="day-forecast-container">
                <span id="day-forecast" class="primary-text">${dataforecast[i].date.slice(-2)}</span>
                <div class="chuva-forecast-container">
                    <i class="fa-solid fa-droplet"></i>
                    <span id="chuva-forecast" class="primary-text">${dataforecast[i].day.daily_chance_of_rain}%</span>
                </div>
                <img src="${dataforecast[i].day.condition.icon}" alt="tempo-img" height="50px" width="50px">
                <span id="temp-min-forecast" class="primary-text">${parseInt(dataforecast[i].day.mintemp_c)}°C</span>
                <span id="temp-avg-forecast" class="primary-text">${parseInt(dataforecast[i].day.avgtemp_c)}°C</span>
                <span id="temp-max-forecast" class="primary-text">${parseInt(dataforecast[i].day.maxtemp_c)}°C</span>
            </div>
            `;
        }

        if (!isDay) {
            document.querySelectorAll('.primary-text').forEach(element => {
                element.style.color = '#ffffff';
            });
            document.querySelectorAll('.secondary-text').forEach(element => {
                element.style.color = '#ffffff';
            });
        }
        
    } else {
        forecastHeading.style.display = 'none';
        if (city != "") {
            containerCurrent.innerHTML = `<h2 id="aviso-erro">Cidade "<span id="aviso-nome-cidade">${city}</span>" não foi encontrada</h2>`;
        }
        else {
            containerCurrent.innerHTML = ``;   
        }
        containerForecast.innerHTML = ``;
    }
    

}

async function reload() {
    var input = document.getElementById('search-input');
    var suggestion_list = document.getElementById('suggestion-list');
    await loadData(input);
    suggestion_list.style.display = "none";

}

async function suggestion(input) {
    var inputvalue = input.value;
    var suggestion_list = document.getElementById('suggestion-list');

    var promiseSuggestion = await fetch(`${APIURL_SEARCH}?key=${APIKEY}&q=${inputvalue}`);
    var responseSuggestion = await promiseSuggestion.json();

    suggestion_list.innerHTML = ``;
    if (responseSuggestion.length >= 1) {
        suggestion_list.style.display = "block";
        for (var i = 0; i < responseSuggestion.length; i++){
            suggestion_list.innerHTML += `
            <li onclick="applySuggestion(this);">${responseSuggestion[i].name}, ${responseSuggestion[i].country}</li>`;
        }
    } else {
        suggestion_list.style.display = "none";
    }
    
}

async function applySuggestion(suggestion) {
    var input = document.getElementById('search-input');
    var suggestion_list = document.getElementById('suggestion-list');
    input.value = suggestion.textContent;

    await loadData(input);
    suggestion_list.style.display = "none";
}