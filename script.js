// THEME

const toggle=document.getElementById("themeToggle")

toggle.onclick=()=>{

document.body.classList.toggle("dark")

localStorage.setItem("theme",document.body.classList.contains("dark"))

}

if(localStorage.getItem("theme")==="true"){

document.body.classList.add("dark")

}

// BACKGROUND

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

const canvas=document.getElementById("clockCanvas")

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

function hand(angle,length){

ctx.beginPath()

ctx.moveTo(100,100)

ctx.lineTo(

100+length*Math.sin(angle),

100-length*Math.cos(angle)

)

ctx.stroke()

}

hand(hr*Math.PI/6,50)

hand(min*Math.PI/30,70)

hand(sec*Math.PI/30,80)

}

setInterval(drawClock,1000)

// WEATHER

async function loadWeather(){

const url="https://api.open-meteo.com/v1/forecast?latitude=42.8467&longitude=-2.6716&daily=temperature_2m_max&timezone=auto"

const res=await fetch(url)

const data=await res.json()

const container=document.getElementById("weather")

container.innerHTML=""

for(let i=0;i<7;i++){

const day=document.createElement("div")

day.className="weatherDay"

day.innerHTML=

`${data.daily.time[i]}<br>${data.daily.temperature_2m_max[i]}°C`

container.appendChild(day)

}

}

loadWeather()

// CALENDAR

let current=new Date()

const events=JSON.parse(localStorage.getItem("events")||"{}")

function renderCalendar(){

const calendar=document.getElementById("calendar")

calendar.innerHTML=""

const month=current.getMonth()

const year=current.getFullYear()

document.getElementById("monthYear").textContent=

current.toLocaleString("default",{month:"long",year:"numeric"})

const firstDay=new Date(year,month,1).getDay()

const days=new Date(year,month+1,0).getDate()

for(let i=0;i<firstDay;i++){

calendar.innerHTML+="<div></div>"

}

for(let d=1;d<=days;d++){

const cell=document.createElement("div")

cell.className="day"

cell.textContent=d

const key=`${year}-${month}-${d}`

if(events[key]) cell.classList.add("event")

calendar.appendChild(cell)

}

}

renderCalendar()

document.getElementById("prevMonth").onclick=()=>{

current.setMonth(current.getMonth()-1)

renderCalendar()

}

document.getElementById("nextMonth").onclick=()=>{

current.setMonth(current.getMonth()+1)

renderCalendar()

}

document.getElementById("addEvent").onclick=()=>{

const date=document.getElementById("eventDate").value

const text=document.getElementById("eventText").value

events[date]=text

localStorage.setItem("events",JSON.stringify(events))

renderCalendar()

}

// FILE MANAGER

const preview=document.getElementById("filePreview")

function handleFiles(files){

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

}

document.getElementById("fileUpload").addEventListener("change",e=>{

handleFiles(e.target.files)

})

const dropZone=document.getElementById("dropZone")

dropZone.ondragover=e=>e.preventDefault()

dropZone.ondrop=e=>{

e.preventDefault()

handleFiles(e.dataTransfer.files)

}

// GOOGLE DOC VIEWER

document.getElementById("addDoc").onclick=()=>{

const link=document.getElementById("docLink").value

const iframe=document.createElement("iframe")

iframe.src=link

iframe.width="100%"

iframe.height="300"

document.getElementById("docViewer").appendChild(iframe)

}

// PWA

if("serviceWorker" in navigator){

navigator.serviceWorker.register("sw.js")

}
