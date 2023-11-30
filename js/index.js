
const APIKEY = "0d521a846cb3440a94710259230211";
const APIURL = "https://api.weatherapi.com/v1/forecast.json";
const APIURL_SEARCH = "https://api.weatherapi.com/v1/search.json";

var containerCurrent = document.getElementById('day-info-container');
var containerCurrentHours = document.getElementById('day-hours-container');

var containerForecastData = document.getElementById('forecast-data'); 
var forecastContainer = document.querySelector('.forecast-container');

var sliderParentContainer = document.getElementById('slider-parent-container');
var sliderContainer = document.getElementById('slider-container');

var contentToRender = document.getElementById('content-to-render');
var loadingIcon = document.getElementById('loading-icon');



async function loadData(input) {
    var city = input.value;
    
    var promise = await fetch(`${APIURL}?key=${APIKEY}&q=${city}&days=10&aqi=no&alerts=no&lang=pt`);
    var response = await promise.json();
    
    try {
        // Dados da localização procurada
        var dataLocation = response.location;
        // Dados do tempo atuais
        var dataCurrent = response.current;
        // Dados da previsão do tempo dos prox 10 dias
        var dataforecast = response.forecast.forecastday;

        forecastContainer.style.display = 'flex';
        sliderParentContainer.style.display = 'flex';
        
        if (dataCurrent.is_day) { // Caso o local pesquisado esteja dia
            containerCurrent.innerHTML = `
            <div class="day-info-top">
                <span>Hoje</span>
                <p id="date">${dataLocation.localtime.replace(/-/g, '/')}</p>
            </div>
            <div class="day-info-bottom">
                <h2 id="temperature">${dataCurrent.temp_c}°C</h2>
                <p id="place">${dataLocation.name}, ${dataLocation.country} <i class="fa-solid fa-sun" style="color: #ffd500;"></i></p>
            <div class="tempo-atual-container">
                <span class="desc-tempo">${dataCurrent.condition.text}</span>
                <img src="${dataCurrent.condition.icon}" alt="tempo-atual-img">
            </div>
            </div>`;
        } else {  // Caso o local pesquisado esteja noite
            containerCurrent.innerHTML = `
            <div class="day-info-top">
                <span>Hoje</span>
                <p id="date">${dataLocation.localtime.replace(/-/g, '/')}</p>
            </div>
            <div class="day-info-bottom">
                <h2 id="temperature">${dataCurrent.temp_c}°C</h2>
                <p id="place">${dataLocation.name}, ${dataLocation.country} <i class="fa-solid fa-moon" style="color: #422475;"></i></p>
            <div class="tempo-atual-container">
                <span class="desc-tempo">${dataCurrent.condition.text}</span>
                <img src="${dataCurrent.condition.icon}" alt="tempo-atual-img">
            </div>
            </div>`;
        }

        containerCurrentHours.innerHTML = ``;
        dataforecast[0].hour.forEach(hourInfo => {
            containerCurrentHours.innerHTML += `
                    <div class="hour-card">
                        <h3 class="horario">${hourInfo.time.slice(-5)}</h3>
                        <img src="${hourInfo.condition.icon}" alt="tempo-img">
                        <span class="card-temp">${parseInt(hourInfo.temp_c)}°C</span>
                    </div>`;
        })
        
        containerForecastData.innerHTML = ``; // Limpar conteúdo anterior
        for (var i = 1; i < dataforecast.length; i++) {

            containerForecastData.innerHTML +=` 
            <div class="day-forecast-container">
                <span id="day-forecast">${dataforecast[i].date.slice(-2)}</span>
                <div class="chuva-forecast-container">
                    <i class="fa-solid fa-droplet"></i>
                    <span id="chuva-forecast">${dataforecast[i].day.daily_chance_of_rain}%</span>
                </div>
                <img src="${dataforecast[i].day.condition.icon}" alt="tempo-img" height="50px" width="50px">
                <span id="temp-min-forecast">${parseInt(dataforecast[i].day.mintemp_c)}°C</span>
                <span id="temp-avg-forecast">${parseInt(dataforecast[i].day.avgtemp_c)}°C</span>
                <span id="temp-max-forecast">${parseInt(dataforecast[i].day.maxtemp_c)}°C</span>
            </div>
            `;
        }

    } catch {
        if (city != "") {
            containerCurrent.innerHTML = `<h2 id="aviso-erro">Cidade "<span id="aviso-nome-cidade">${city}</span>" não foi encontrada</h2>`;
        }
        else {
            containerCurrent.innerHTML = ``;   
        }
        containerForecastData.innerHTML = ``;
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

    suggestion_list.style.display = "none";
    loadingIcon.style.display = "block";

    await loadData(input);
    loadingIcon.style.display = "none";
}


var currentPos = 0;
var slideWidth = 164;

function slideLeft() {
    if (currentPos > 0) {
        currentPos -= slideWidth; 
    }
    containerCurrentHours.style.right = currentPos + "px"; 
    
}

function slideRight() {
    var qntdVisibleCard = Math.round(sliderContainer.clientWidth / 160);
    if (currentPos < (24 - qntdVisibleCard) * 164) {
        currentPos += slideWidth; 
    }
    containerCurrentHours.style.right = currentPos + "px"; 
}
