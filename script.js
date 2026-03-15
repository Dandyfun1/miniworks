// ===== Window toggles =====
function toggleWindow(id){
  const win = document.getElementById(id);
  win.style.display = (win.style.display === "block") ? "none" : "block";
}

document.getElementById("btnCalendar").onclick = () => toggleWindow("calendarWindow");
document.getElementById("btnNotes").onclick = () => toggleWindow("notesWindow");
document.getElementById("btnSettings").onclick = () => toggleWindow("settingsWindow");

document.getElementById("dockCalendar").onclick = () => toggleWindow("calendarWindow");
document.getElementById("dockNotes").onclick = () => toggleWindow("notesWindow");
document.getElementById("dockSettings").onclick = () => toggleWindow("settingsWindow");

// ===== Drag windows =====
document.querySelectorAll(".window").forEach(win=>{
  const bar = win.querySelector(".titleBar");
  let offsetX, offsetY;
  bar.onmousedown = e => {
    offsetX = e.clientX - win.offsetLeft;
    offsetY = e.clientY - win.offsetTop;
    document.onmousemove = e2 => {
      win.style.left = e2.clientX - offsetX + "px";
      win.style.top = e2.clientY - offsetY + "px";
    };
    document.onmouseup = () => { document.onmousemove = null; }
  };
});

// ===== Clock =====
function updateClock(){
  const now = new Date();
  document.getElementById("digitalClock").textContent = now.toLocaleTimeString();
}
setInterval(updateClock, 1000);

const canvas = document.getElementById("clockCanvas");
const ctx = canvas.getContext("2d");
function drawClock(){
  const now = new Date();
  const sec = now.getSeconds(), min = now.getMinutes(), hr = now.getHours();
  ctx.clearRect(0,0,220,220);
  ctx.beginPath(); ctx.arc(110,110,100,0,Math.PI*2); ctx.stroke();
  function hand(angle,length){
    ctx.beginPath(); ctx.moveTo(110,110);
    ctx.lineTo(110 + length*Math.sin(angle), 110 - length*Math.cos(angle));
    ctx.stroke();
  }
  hand(hr*Math.PI/6,60); hand(min*Math.PI/30,80); hand(sec*Math.PI/30,90);
}
setInterval(drawClock,1000);

// ===== Calendar =====
let current = new Date();
let events = JSON.parse(localStorage.getItem("events") || "{}");

function renderCalendar(){
  const cal = document.getElementById("calendar");
  cal.innerHTML = "";
  const month = current.getMonth(), year = current.getFullYear();
  document.getElementById("monthYear").textContent = current.toLocaleString("default",{month:"long",year:"numeric"});
  const first = new Date(year, month, 1).getDay();
  const days = new Date(year, month+1, 0).getDate();
  for(let i=0;i<first;i++) cal.innerHTML+="<div></div>";
  for(let d=1; d<=days; d++){
    const cell = document.createElement("div"); cell.className="day"; cell.textContent=d;
    const key = `${year}-${month+1}-${d}`;
    if(events[key]){ cell.classList.add("event"); cell.title=events[key]; }
    const today = new Date();
    if(d===today.getDate() && month===today.getMonth() && year===today.getFullYear()) cell.classList.add("today");
    cal.appendChild(cell);
  }
}
renderCalendar();

document.getElementById("prevMonth").onclick = () => { current.setMonth(current.getMonth()-1); renderCalendar(); };
document.getElementById("nextMonth").onclick = () => { current.setMonth(current.getMonth()+1); renderCalendar(); };
document.getElementById("addEvent").onclick = () => {
  const date = document.getElementById("eventDate").value;
  const text = document.getElementById("eventText").value;
  if(!date || !text) return;
  events[date] = text;
  localStorage.setItem("events", JSON.stringify(events));
  renderCalendar();
}

// ===== Notes =====
let notes = JSON.parse(localStorage.getItem("notes") || "[]");
const noteText = document.getElementById("noteText");
const noteList = document.getElementById("noteList");

function renderNotes(){
  noteList.innerHTML="";
  notes.forEach((n,i)=>{
    const div = document.createElement("div"); div.className="noteCard"; div.textContent=n;
    const del = document.createElement("button"); del.textContent="X"; del.onclick=()=>{notes.splice(i,1); saveNotes();}
    div.appendChild(del); noteList.appendChild(div);
  });
}
function saveNotes(){ localStorage.setItem("notes",JSON.stringify(notes)); renderNotes(); }

document.getElementById("saveNote").onclick = () => {
  if(noteText.value){ notes.push(noteText.value); noteText.value=""; saveNotes(); }
}
renderNotes();

// ===== Settings =====
document.getElementById("themeToggle").onclick = () => document.body.classList.toggle("dark");
document.getElementById("bgUpload").onchange = e => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = () => document.body.style.backgroundImage = `url(${reader.result})`;
  reader.readAsDataURL(file);
}
