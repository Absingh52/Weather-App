const userTab=document.querySelector("[data-userWeather]")
const searchTab=document.querySelector("[data-searchWeather]")
const userContainer=document.querySelector(".weather-container")

const grantAccessContainer=document.querySelector(".grant-location-container")
const searchForm = document.querySelector("[data-searchForm]");

const loadingScreen=document.querySelector(".loading-container")
const userInfoContainer=document.querySelector(".user-info-container")


// initailly variables  needed 

let currentTab=userTab;
const API_KEY="d1845658f92b31c64bd94f06f7188c9c";
currentTab.classList.add("current-tab");
getfromSessiongetStorage();

// Creating function for  switch tab 

function switchTab(newtab){
    if(newtab!=currentTab){
        currentTab.classList.remove("current-tab");
        currentTab=newtab;
        currentTab.classList.add("current-tab");
        if(!searchForm.classList.contains("active"))
            //checks searchTab do not  have active class if it do
            // not have active which means it is visible and i want to make it invisible 
        {
            grantAccessContainer.classList.remove("active");
            userInfoContainer.classList.remove("active");
            searchForm.classList.add("active")
        }
        else{
            // this else part work when i want to switch to your weather for firstly
            //  i have to ramove the search tab classes from the search tab 
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            // searchForm.classList.remove("active");
            getfromSessiongetStorage();
        }
    }
}

userTab.addEventListener("click",()=>{
    switchTab(userTab);
})

searchTab.addEventListener("click",()=>{
    switchTab(searchTab);
})

// check is coordinates avalible
 function getfromSessiongetStorage(){
    const localCoordinates=sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantAccessContainer.classList.add("active")
    }
    else{
        const coordinates= JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
 }

//  fetch weather info function by sending a api call to server
async function fetchUserWeatherInfo(coordinates){
    const {lat,lon}=coordinates;

    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");
    
    try{
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
        const data= await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        // this function will render the weather info dynamically 00 
        renderWeatherInfo(data);0
    }
    catch(e){
        loadingScreen.classList.remove("active");
        console.log("Error occur",e);
    }
}

// renderfunction
function renderWeatherInfo(weatherInfo){
    // firstly access the user container elements 
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    // asigning the values to the above const variables 

    cityName.innerText=weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText =`${weatherInfo?.main?.temp}°C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed}m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}

// now we make function if we  dont have coordinates 
function getLocation(){
    // checks my browser has this geolocation api
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("Api is not available")
    }
}
function showPosition(position){
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}
const grantAccessButton=document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click",getLocation);
const searchInput = document.querySelector("[data-searchInput]");

console.log("Search form:", searchForm);  // Debugging
console.log("Search input:", searchInput);  // Debugging

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;
    
    if(cityName === ""){
        return;}
    else {
    console.log("Searching for:", cityName);

        fetchSearchWeatherInfo(cityName)}
})

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    console.log("hello")
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
        console.log("heloo")
    }
    catch(err) {
        loadingScreen.classList.remove("active");
        console.log("Error occur",err);
    }
}