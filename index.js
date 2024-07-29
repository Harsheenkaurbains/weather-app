// // const res = require("express/lib/response");

// const { response } = require("express");

// console.log('hello ');

// const API_KEY="f3d1393a750e0e0135f4880027c1b8f7";

// function renderweather(){
//   let newpara=document.createElement('p');
//      newpara.textContent=`${data?.main?.temp.toFixed(2)} °C`;
//      document.body.appendChild(newpara);
// }
// async function showeather(){
//     // let latitude=12.333;
//     // let longitude=64.3223;
//     try{
//     let city="muzaffarnagar";
//      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric%27`);

//      const data= await response.json();
//      console.log("weather data:=>",data);

// //    renderweather();
// let newpara=document.createElement('p');
// let para2=document.createElement('p');
// para2.textContent=city+" is";
// newpara.textContent=`${data?.main?.temp.toFixed(2)} °C`;
// document.body.appendChild(para2);
// document.body.appendChild(newpara);
//     }
//     catch(err){
//         // handle the error here
//     }
// }

// async function customweather(){
//     try{
//     let latitude=34.223;
//     let longitude=57.564;
//     let result=await fetch(`api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`);
//     let data= await result.json();
//     console.log(data);

// }catch(err){
// console.log("error found" ,err);
// }}



// function getLocation(){
//     if(navigator.geolocation){
//         navigator.geolocation.getCurrentPosition(showPosition);
//     }
//     else{
//         console.log("no geo location support");
//     }
// }
// function showPosition(position){
//     let lat=position.coords.latitude;
//     let longi=position.coords.longitude;

//     console.log(lat);
//     console.log(longi);
// }








// we are going to make the project from scratch from here

// we need to switch  between the tabs thats why weneed to make active classes

const usertab = document.querySelector("[data-userweather]");
const searchtab=document.querySelector("[data-searchweather]");
const usercontainer=document.querySelector(".weathercontainer");
const grantaccesscontainer=document.querySelector(".grantlocationcontainer");
const searchform=document.querySelector("[data-searchform]");
const loadingscreen=document.querySelector(".loadingcontainer");
const userinfocontainer=document.querySelector(".userinforcontainer");


// initially variables need???
let currenttab=usertab;

const API_KEY = "f3d1393a750e0e0135f4880027c1b8f7";
currenttab.classList.add("currenttab");

getfromsessionstorage();



function switchtab(clickedtab){
if(clickedtab != currenttab){
    currenttab.classList.remove("currenttab");
    currenttab=clickedtab;
    currenttab.classList.add("currenttab");

    if(!searchform.classList.contains("active")){

    // kya search form  wala conatiner is invisible if yea then make it visible 

    userinfocontainer.classList.remove("active");
    grantaccesscontainer.classList.remove("active");
    searchform.classList.add("active");

}
else
{
    // main pehle seacrch wale tab pr tha ab your weather tab visib;le karana h 

    searchform.classList.remove("active");

    userinfocontainer.classList.remove("active");
    // ab main your weather tab me aagya hun toh weather display karna padega so lets chheck local storage first 
    // for coordinates if we have saved then there

    getfromsessionstorage();

}
}
}
    
    usertab.addEventListener("click", ()=> {
    // pass clicked tab as input parameter
    switchtab(usertab);
});


searchtab.addEventListener("click", ()=> {
    // pass clicked tab as input parameter
    switchtab(searchtab);

});


function getfromsessionstorage(){
    const localcoordinates=sessionStorage.getItem("usercoordinates");
    ;
    if(!localcoordinates){
        // agr local coordinates nahi mile
        grantaccesscontainer.classList.add("active");
    }
    else{
        const coordinates=JSON.parse(localcoordinates);
        fetchuserweatherinfo(coordinates);
    }
}

async function fetchuserweatherinfo(coordinates){
    const {lat,lon} =coordinates;

    // make gran tconatiner invisible 
    grantaccesscontainer.classList.remove("active");

    // make loader visible
    loadingscreen.classList.add("active");

    // API call     
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data= await response.json();

        // when the response is recived the remove the loader

        loadingscreen.classList.remove("active");
        userinfocontainer.classList.add("active");
        renderweatherinfo(data);


    }
    catch(err){
// hw
loadingscreen.classList.remove("active");
    }
}

function renderweatherinfo(weatherinfo){

    // firstly we have to fetch the elements 

    const cityname=document.querySelector("[data-cityname]");
    const countryicon=document.querySelector("[data-countryicon]");
    const desc=document.querySelector("[data-weatherdesc]");
    const weathericon=document.querySelector("[data-weathericon]");
    const temp=document.querySelector("[data-temp]");
    const windspeed=document.querySelector("[data-windspeed]");
    const humidity=document.querySelector("[data-humidity]");
    const cloudiness=document.querySelector("[data-cloudiness]");

    // fetch values from weather info object then put in the UI

    cityname.innerText=weatherinfo?.name;
    countryicon.src=`https://flagcdn.com/144x108/${weatherinfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText=weatherinfo?.weather?.[0]?.description;
weathericon.src=`https://openweathermap.org/img/w/${weatherinfo?.weather?.[0]?.icon}.png`;
temp.innerText = `${weatherinfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherinfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherinfo?.main?.humidity} %`;
    cloudiness.innerText = `${weatherinfo?.clouds?.all} %`;

}

function getlocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        // hw
        // alert("no geolocation support avaliavble");
    }
}
function showPosition(position){
const usercoordinates ={
    lat:position.coords.latitude,
    lon:position.coords.longitude,
}

sessionStorage.setItem("usercoordinates", JSON.stringify(usercoordinates));
fetchuserweatherinfo(usercoordinates);
}

const grantaccessbutton=document.querySelector("[data-grantaccess]");
grantaccessbutton.addEventListener("click",getlocation);


let searchinput=document.querySelector("[data-searchinput]");

searchform.addEventListener("submit",(e)=>{
e.preventDefault();
let cityname= searchinput.value;
if(cityname === ""){
    return;
}

else{
    fetchseacrchweatherinfo(cityname);
}

})
const errorContainer=document.querySelector(".errorcontainer");
async function fetchseacrchweatherinfo(city){
    loadingscreen.classList.add("active");
    userinfocontainer.classList.remove("active");
    grantaccesscontainer.classList.remove("active");


    try{

        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data= await response.json();

        
        if (response.ok) {
            if (data.cod === "404") {
                throw new Error("City not found");
            }
        loadingscreen.classList.remove("active");
        userinfocontainer.classList.add("active");
        renderweatherinfo(data);
    } else {
        throw new Error("Failed to fetch weather data");
    }
    }
    catch(err){
loadingscreen.classList.remove("active");
userinfocontainer.classList.remove("active");
errorContainer.classList.add("active");
      
    }
}





