// WINDOW OPENING

function toggleWindow(id){

const win=document.getElementById(id)

win.style.display= win.style.display==="block" ? "none":"block"

}

document.getElementById("openCalendar").onclick=()=>toggleWindow("calendarWindow")

document.getElementById("openFiles").onclick=()=>toggleWindow("fileWindow")

document.getElementById("openSettings").onclick=()=>toggleWindow("settingsWindow")

// DRAG WINDOWS

document.querySelectorAll(".window").forEach(win=>{

const bar=win.querySelector(".titleBar")

let offsetX,offsetY

bar.onmousedown=e=>{

offsetX=e.clientX-win.offsetLeft
offsetY=e.clientY-win.offsetTop

document.onmousemove=e2=>{

win.style.left=e2.clientX-offsetX+"px"
win.style.top=e2.clientY-offsetY+"px"

}

document.onmouseup=()=>{

document.onmousemove=null

}

}

})

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

ctx.clearRect(0,0,220,220)

ctx.beginPath()
ctx.arc(110,110,100,0,Math.PI*2)
ctx.stroke()

function hand(angle,length){

ctx.beginPath()
ctx.moveTo(110,110)

ctx.lineTo(
110+length*Math.sin(angle),
110-length*Math.cos(angle)
)

ctx.stroke()

}

hand(hr*Math.PI/6,60)
hand(min*Math.PI/30,80)
hand(sec*Math.PI/30,90)

}

setInterval(drawClock,1000)

// CALENDAR

let current=new Date()

let events=JSON.parse(localStorage.getItem("events")||"{}")

function renderCalendar(){

const cal=document.getElementById("calendar")

cal.innerHTML=""

const month=current.getMonth()
const year=current.getFullYear()

document.getElementById("monthYear").textContent=
current.toLocaleString("default",{month:"long",year:"numeric"})

const first=new Date(year,month,1).getDay()

const days=new Date(year,month+1,0).getDate()

for(let i=0;i<first;i++) cal.innerHTML+="<div></div>"

for(let d=1;d<=days;d++){

const cell=document.createElement("div")

cell.className="day"

cell.textContent=d

const dateKey=`${year}-${month+1}-${d}`

if(events[dateKey]){

cell.classList.add("event")
cell.title=events[dateKey]

}

const today=new Date()

if(d===today.getDate() && month===today.getMonth() && year===today.getFullYear()){

cell.classList.add("today")

}

cal.appendChild(cell)

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

if(!date || !text) return

events[date]=text

localStorage.setItem("events",JSON.stringify(events))

renderCalendar()

}

// FILE MANAGER

const preview=document.getElementById("filePreview")

function addFileCard(name,url,type){

const card=document.createElement("div")
card.className="fileCard"

if(type.startsWith("image")){

card.innerHTML=`<img src="${url}"><p>${name}</p>`

}else{

card.innerHTML=`<p>📄</p><p>${name}</p>`

}

const btn=document.createElement("button")

btn.textContent="Open"

btn.onclick=()=>window.open(url)

card.appendChild(btn)

preview.appendChild(card)

}

function handleFiles(files){

for(let file of files){

const url=URL.createObjectURL(file)

addFileCard(file.name,url,file.type)

}

}

document.getElementById("fileUpload").onchange=e=>{
handleFiles(e.target.files)
}

const dropZone=document.getElementById("dropZone")

dropZone.ondragover=e=>e.preventDefault()

dropZone.ondrop=e=>{

e.preventDefault()

handleFiles(e.dataTransfer.files)

}

// DOC VIEWER

document.getElementById("addDoc").onclick=()=>{

const link=document.getElementById("docLink").value

const iframe=document.createElement("iframe")

iframe.src=link
iframe.width="100%"
iframe.height="300"

document.getElementById("docViewer").appendChild(iframe)

}

// SETTINGS

document.getElementById("themeToggle").onclick=()=>{

document.body.classList.toggle("dark")

}

document.getElementById("bgUpload").onchange=e=>{

const file=e.target.files[0]

const reader=new FileReader()

reader.onload=()=>{

document.body.style.backgroundImage=`url(${reader.result})`

}

reader.readAsDataURL(file)

}
