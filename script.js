const cityinput = document.querySelector('.city')
const searchbutton = document.querySelector('.search_btn')

const weatherInfoSection = document.querySelector('.weather_info')
const notFoundSection = document.querySelector('.city-not-found')
const searchCitySection = document.querySelector('.search-city')

const cityText = document.querySelector('.city-name')
const temperatureInfo = document.querySelector('.temperature')
const cloudStateInfo = document.querySelector('.cloud_state')
const hummidityValue = document.querySelector('.hummidity_value')
const windSpeedValue = document.querySelector('.wind_speed_value')
const cloudyPicture = document.querySelector('.cloudy_picture')
const currentDateText = document.querySelector('.current-date')

const ForecastItemsCotainer = document.querySelector('.forecast-items-cotainer')

const apikey = 'd1fe9e2d3397097ba7628a4899cd04cf'

searchbutton.addEventListener('click',()=>{
    if(cityinput.value.trim() != '')
        {
        updateweatherinfo(cityinput.value)
        // console.log(cityinput.value)
        cityinput.value = ''
        cityinput.blur();
        }
})

cityinput.addEventListener('keydown', (event)=>{
    
    if(event.key === 'Enter' &&
        cityinput.value.trim() != '')
        {
            updateweatherinfo(cityinput.value);
            // console.log(cityinput.value);
            cityinput.value = ''
            cityinput.blur();
        }
})

async function updateweatherinfo(city){
    const weatherdata = await getfetchdata('weather',city);

    if(weatherdata.cod != 200) {
        showDisplaySection(notFoundSection);
            function_five();
        return;
    }
    console.log(weatherdata);

    const{
        name: country,
        main : {temp, humidity },
        weather : [{id, main}],
        wind : {speed}
    } = weatherdata

    cityText.textContent = country
    temperatureInfo.textContent = Math.round(temp) + ' °C'
    cloudStateInfo.textContent = main
    hummidityValue.textContent = humidity + ' %'
    windSpeedValue.textContent = speed + ' M/s'
    currentDateText.textContent = getCurrentDate()
    console.log(getCurrentDate());

    cloudyPicture.src = `assets/assets/weather/${getweatherIcon(id)}`

    await updateForecastInfo(city)
    showDisplaySection(weatherInfoSection)
    
}

async function updateForecastInfo(city){
    const forecastData = await getfetchdata('forecast', city)

    const timetaken = '12:00:00'
    const todayDate = new Date().toISOString().split('T')[0]

    ForecastItemsCotainer.innerHTML = ''

    forecastData.list.forEach(forecastWeather => {

        if(forecastWeather.dt_txt.includes(timetaken) && !forecastWeather.dt_txt.includes(todayDate)){

            updateForecastItems(forecastWeather)
            // console.log(forecastWeather);
        }
        
    })
    // console.log(todayDate);
    // console.log(forecastData);
}

function updateForecastItems(weatherdata){
    console.log(weatherdata);

    const{
        dt_txt: date,
        weather : [{id}],
        main : {temp}
    } = weatherdata

    const dateTaken = new Date(date)
    const dateOption = {
        day : '2-digit',
        month : 'short'
    }

    const dateResult = dateTaken.toLocaleDateString('en-US', dateOption)

    const ForecastItem = `
                <div class="forecast_items">
                    <h4 class="forcast-items-data">${dateResult}</h4>
                    <img src="assets/assets/weather/${getweatherIcon(id)}" class="forcast-item-img">
                    <h5 class="forecast-item-temp">${Math.round(temp)} °C </h5>
                </div>
        `
    
    ForecastItemsCotainer.insertAdjacentHTML('beforeend', ForecastItem )
    
}


function getweatherIcon(id){
    // console.log(id)
    if(id <= 232) return 'thunderstorm.svg'
    if(id <= 321) return 'drizzle.svg'
    if(id <= 531) return 'rain.svg'
    if(id <= 622) return 'snow.svg'
    if(id <= 721) return 'atmosphere.svg'
    if(id <= 800) return 'clear.svg'
    else return 'clouds.svg'
}
function getCurrentDate(){
    const currentDate = new Date()
    const options = {
        weekday: 'short',
        day: '2-digit',
        month:'short'
    }
    return currentDate.toLocaleDateString('en-GB', options)
}


function showDisplaySection(section) {
    [weatherInfoSection, searchCitySection, notFoundSection]
        .forEach(section => section.style.display)
    
    section.style.display = 'flex'
}

async function getfetchdata(endpoint, city){
    const apiurl = `https://api.openweathermap.org/data/2.5/${endpoint}?q=${city}&appid=${apikey}&units=metric`

    const response = await fetch(apiurl)

    return response.json()
}

function function_five(){
    document.getElementById("last1").style.display = "none";
}



