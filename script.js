// THEME TOGGLE

const toggle=document.getElementById("themeToggle")

toggle.onclick=()=>{
document.body.classList.toggle("dark")
localStorage.setItem("theme",document.body.classList.contains("dark"))
}

if(localStorage.getItem("theme")==="true"){
document.body.classList.add("dark")
}

// BACKGROUND UPLOAD

document.getElementById("bgUpload").addEventListener("change",e=>{

const file=e.target.files[0]
const reader=new FileReader()

reader.onload=()=>{
document.body.style.backgroundImage=`url(${reader.result})`
localStorage.setItem("bg",reader.result)
}

reader.readAsDataURL(file)

})

const savedBG=localStorage.getItem("bg")
if(savedBG){
document.body.style.backgroundImage=`url(${savedBG})`
}

// CLOCK

function updateClock(){

const now=new Date()

document.getElementById("digitalClock").textContent=
now.toLocaleTimeString()

}

setInterval(updateClock,1000)


// ANALOG CLOCK

const canvas=document.getElementById("analogClock")
const ctx=canvas.getContext("2d")

function drawClock(){

const now=new Date()

const sec=now.getSeconds()
const min=now.getMinutes()
const hr=now.getHours()

ctx.clearRect(0,0,200,200)

ctx.beginPath()
ctx.arc(100,100,90,0,Math.PI*2)
ctx.stroke()

// hour hand

ctx.beginPath()
ctx.moveTo(100,100)
ctx.lineTo(
100+40*Math.sin(hr*Math.PI/6),
100-40*Math.cos(hr*Math.PI/6)
)
ctx.stroke()

}

setInterval(drawClock,1000)

// POPUPS

function popup(icon,popup){

document.getElementById(icon).onclick=()=>{
document.getElementById(popup).classList.add("show")
}

}

popup("clockIcon","clockPopup")
popup("calendarIcon","calendarPopup")
popup("weatherIcon","weatherPopup")

document.querySelectorAll(".close").forEach(btn=>{
btn.onclick=()=>btn.parentElement.classList.remove("show")
})

// WEATHER

async function loadWeather(){

const url="https://api.open-meteo.com/v1/forecast?latitude=42.8467&longitude=-2.6716&current_weather=true"

const res=await fetch(url)
const data=await res.json()

document.getElementById("weather").innerHTML=
`Temperature: ${data.current_weather.temperature}°C`

}

loadWeather()

// CALENDAR

const calendar=document.getElementById("calendar")
const events=JSON.parse(localStorage.getItem("events")||"{}")

function generateCalendar(){

calendar.innerHTML=""

for(let i=1;i<=31;i++){

const day=document.createElement("div")
day.className="day"
day.textContent=i

if(events[i]) day.classList.add("event")

calendar.appendChild(day)

}

}

generateCalendar()

document.getElementById("addEvent").onclick=()=>{

const date=document.getElementById("eventDate").value
const text=document.getElementById("eventText").value

const day=new Date(date).getDate()

events[day]=text

localStorage.setItem("events",JSON.stringify(events))

generateCalendar()

}

// FILE UPLOAD

const preview=document.getElementById("filePreview")

document.getElementById("fileUpload").addEventListener("change",e=>{

const files=e.target.files

for(let file of files){

const url=URL.createObjectURL(file)

if(file.type.startsWith("image")){
const img=document.createElement("img")
img.src=url
preview.appendChild(img)
}

else if(file.type==="application/pdf"){
const iframe=document.createElement("iframe")
iframe.src=url
iframe.height=300
preview.appendChild(iframe)
}

}

})

// GOOGLE DOC LINKS

document.getElementById("addGdoc").onclick=()=>{

const link=document.getElementById("gdocLink").value

const iframe=document.createElement("iframe")

iframe.src=link
iframe.width="400"
iframe.height="300"

document.getElementById("gdocContainer").appendChild(iframe)

}
