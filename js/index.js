
const APIKEY = "0d521a846cb3440a94710259230211";
const APIURL = "https://api.weatherapi.com/v1/forecast.json";
const APIURL_SEARCH = "https://api.weatherapi.com/v1/search.json";

var containerCurrent = document.getElementById('day-info-container');
var containerCurrentHours = document.getElementById('day-hours-container');

var containerForecastData = document.getElementById('forecast-data'); 

var forecastContainer = document.querySelector('.forecast-container');

var tempSufix = '°C';
const tempC = ['temp_c', 'mintemp_c', 'avgtemp_c', 'maxtemp_c', 'feelslike_c'];
const tempF = ['temp_f', 'mintemp_f', 'avgtemp_f', 'maxtemp_f', 'feelslike_f'];
var userTemp = tempC;

const windDirections = { N: 'Norte', NNE: 'Norte-Nordeste', NE: 'Nordeste', ENE: 'Leste-Nordeste', E: 'Leste', ESE: 'Leste-Sudeste', SE: 'Sudeste', SSE: 'Sul-Sudeste', S: 'Sul', SSW: 'Sul-Sudoeste', SW: 'Sudoeste', WSW: 'Oeste-Sudoeste', W: 'Oeste', WNW: 'Oeste-Noroeste', NW: 'Noroeste', NNW: 'Noroeste-Noroeste', };
var moreInfoSufixes = ['%', '', 'mm', '', 'km/h', 'km', '°C', 'mb', 'Índice EPA'];
const moreInfosTitles = ['Umidade', 'Índice UV', 'Precipitação', 'Direção do Vento', 'Velocidade do Vento' ,'Visibilidade', 'Sensação térmica', 'Pressão', 'Qualidade do Ar'];
var moreInfos = ['humidity', 'uv', 'precip_mm', 'wind_dir', 'wind_kph', 'vis_km', 'feelslike_c', 'pressure_mb', 'us-epa-index'];
var moreInfoContainer = document.getElementById('more-info-data');

var sliderParentContainer = document.getElementById('slider-parent-container');
var sliderContainer = document.getElementById('slider-container');

var contentToRender = document.getElementById('content-to-render');
var loadingIcon = document.getElementById('loading-icon');



async function loadData(input) {
    var city = input.value;
    
    var promise = await fetch(`${APIURL}?key=${APIKEY}&q=${city}&days=10&aqi=yes&alerts=no&lang=pt`);
    var response = await promise.json();
    
    try {
        // Dados da localização procurada
        var dataLocation = response.location;
        // Dados do tempo atuais
        var dataCurrent = response.current;
        // Dados da previsão do tempo dos prox 10 dias
        var dataforecast = response.forecast.forecastday;
        console.log(dataCurrent);

        forecastContainer.style.display = 'flex';
        sliderParentContainer.style.display = 'flex';
        
        if (dataCurrent.is_day) { // Caso o local pesquisado esteja dia
            containerCurrent.innerHTML = `
            <div class="day-info-top">
                <span id="hoje-text">Hoje</span>
                <p id="date">${dataLocation.localtime.replace(/-/g, '/')}</p>
                <span class="sunrise-sunset-span">Amanhecer: <span>${dataforecast[0].astro.sunrise}</span> | Anoitecer: <span>${dataforecast[0].astro.sunset}</span> </span>
            </div>
            <div class="day-info-bottom">
                <h2 id="temperature">${dataCurrent[userTemp[0]]}${tempSufix}</h2>
                <p id="place">${dataLocation.name}, ${dataLocation.country} <i class="fa-solid fa-sun" style="color: #ffd500;"></i></p>
            <div class="tempo-atual-container">
                <span class="desc-tempo">${dataCurrent.condition.text}</span>
                <img src="${dataCurrent.condition.icon}" alt="tempo-atual-img">
            </div>
            </div>`;
        } else {  // Caso o local pesquisado esteja noite
            containerCurrent.innerHTML = `
            <div class="day-info-top">
                <span id="hoje-text">Hoje</span>
                <p id="date">${dataLocation.localtime.replace(/-/g, '/')}</p>
                <span class="sunrise-sunset-span">Amanhecer: <span>${dataforecast[0].astro.sunrise}</span> | Anoitecer: <span>${dataforecast[0].astro.sunset}</span> </span>
            </div>
            <div class="day-info-bottom">
                <h2 id="temperature">${dataCurrent[userTemp[0]]}${tempSufix}</h2>
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
                        <span class="card-temp">${parseInt(hourInfo[userTemp[0]])}${tempSufix}</span>
                    </div>`;
        })

        moreInfoContainer.innerHTML = ``;
        for (var i = 0; i < moreInfos.length; i++) {
            if (i == 1) {
                moreInfoContainer.innerHTML += `
                <div class="card-more-info card-uv">
                <div class="card-uv-data">
                    <h3>${moreInfosTitles[i]}</h3>
                    <span>${dataCurrent[moreInfos[i]]}</span>
                </div>
                <div class="card-uv-graph-container">
                    <div class="graph-text-container">
                        <p class="span-graph">> 11 Extremo</p>
                        <p class="span-graph">8 a 10 Muito Alto</p>
                        <p class="span-graph">6 a 7 Alto</p>
                        <p class="span-graph">3 a 5 Moderado</p>
                        <p class="span-graph">< 2 Baixo</p>
                    </div>
                    <div class="uv-graph">
                    </div>
                </div>
            </div>`;
            }
            else if (i == 3) {
                moreInfoContainer.innerHTML += `
            <div class="card-more-info">
                <h3>${moreInfosTitles[i]}</h3>
                <span id="wind-dir-span">${windDirections[dataCurrent[moreInfos[i]]]} <p>${moreInfoSufixes[i]}</p></span>
            </div>`;
            }
            else if (i == 8) {
                moreInfoContainer.innerHTML += `
            <div class="card-more-info">
                <h3>${moreInfosTitles[i]}</h3>
                <div class="epa-index-container">
                    <span>${dataCurrent.air_quality[moreInfos[i]]} <p>${moreInfoSufixes[i]}</p></span>
                    <a href="https://www.airnow.gov/aqi/aqi-basics/" target="_blank">
                    <i class="fa-solid fa-circle-info"></i>
                    </a>
                </div>
            </div>`;
            }
            else {
                moreInfoContainer.innerHTML += `
                <div class="card-more-info">
                    <h3>${moreInfosTitles[i]}</h3>
                    <span>${dataCurrent[moreInfos[i]]} <p>${moreInfoSufixes[i]}</p></span>
                </div>`;
            }
        }
        
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
                <span id="temp-min-forecast">${parseInt(dataforecast[i].day[userTemp[1]])}${tempSufix}</span>
                <span id="temp-avg-forecast">${parseInt(dataforecast[i].day[userTemp[2]])}${tempSufix}</span>
                <span id="temp-max-forecast">${parseInt(dataforecast[i].day[userTemp[3]])}${tempSufix}</span>
            </div>
            `;
        }

    } catch (error){
        if (city != "") {
            containerCurrent.innerHTML = `<h2 id="aviso-erro">Cidade "<span id="aviso-nome-cidade">${city}</span>" não foi encontrada</h2>`;
        }
        else {
            containerCurrent.innerHTML = ``; 
        }
        sliderParentContainer.style.display = 'none';
        forecastContainer.style.display = 'none';
        containerForecastData.innerHTML = ``;
        console.log(error);
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
    contentToRender.style.display = "none";

    await loadData(input);
    loadingIcon.style.display = "none";
    contentToRender.style.display = "flex";
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

function atualizarTemp(input) {
    if (input.checked) {
        userTemp = tempF;
        tempSufix = '°F';
        moreInfoSufixes[6] = '°F';
        moreInfos[6] = tempF[4];
    } else {
        userTemp = tempC;
        tempSufix = '°C';
        moreInfoSufixes[6] = '°C';
        moreInfos[6] = tempC[4];
       
    }
    
}