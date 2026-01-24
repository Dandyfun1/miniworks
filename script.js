import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

/* =========================
   FIREBASE CONFIG
========================= */
const firebaseConfig = {
  apiKey: "AIzaSyDhOR8ONBR3Tt01tY05Uxx6TZVXS-uJsOs",
  authDomain: "shoolpub.firebaseapp.com",
  projectId: "shoolpub",
  storageBucket: "shoolpub.firebasestorage.app",
  messagingSenderId: "906607131740",
  appId: "1:906607131740:web:16385bcd22a40501b7fa99"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* =========================
   LOGIN
========================= */
const loginScreen = document.getElementById("loginScreen");
const topBar = document.getElementById("topBar");
const feed = document.getElementById("feed");
const welcomeText = document.getElementById("welcomeText");

document.getElementById("enterBtn").onclick = () => {
  const name = document.getElementById("usernameInput").value.trim();
  if (!name) return alert("Enter your name");
  localStorage.setItem("username", name);

  loginScreen.style.display = "none";
  topBar.classList.remove("hidden");
  feed.classList.remove("hidden");
  welcomeText.textContent = `Hi, ${name}`;

  // Load user background
  const bg = localStorage.getItem(name+"_bg");
  if(bg) document.body.style.backgroundImage = `url(${bg})`;
};

/* =========================
   CLOCK
========================= */
function updateClock(){
  const now = new Date();
  document.getElementById("clock").textContent = now.toLocaleTimeString("es-ES", {timeZone:"Europe/Madrid",hour:"2-digit",minute:"2-digit"});
}
setInterval(updateClock,1000);
updateClock();

/* =========================
   ICON TOGGLES
========================= */
document.getElementById("weatherIcon").onclick = () =>
  document.getElementById("weather").classList.toggle("hidden");

document.getElementById("calendarIcon").onclick = () =>
  document.getElementById("calendar").classList.toggle("hidden");

/* SETTINGS ICON (hover 3s) */
let hoverTimer;
const settingsIcon = document.getElementById("settingsIcon");
const userSettings = document.getElementById("userSettings");

settingsIcon.addEventListener("mouseenter",()=>{hoverTimer=setTimeout(()=>{userSettings.classList.toggle("hidden")},3000);});
settingsIcon.addEventListener("mouseleave",()=>{clearTimeout(hoverTimer);});

/* SAVE BACKGROUND */
document.getElementById("saveBgBtn").onclick = ()=>{
  const url = document.getElementById("bgInput").value.trim();
  if(!url) return;
  const user = localStorage.getItem("username");
  localStorage.setItem(user+"_bg",url);
  document.body.style.backgroundImage=`url(${url})`;
};

/* =========================
   SHARED CALENDAR
========================= */
const notesRef = collection(db,"calendar");
const notesList = document.getElementById("notes");

document.getElementById("addNoteBtn").onclick = async()=>{
  const text = document.getElementById("noteInput").value.trim();
  if(!text) return;
  await addDoc(notesRef,{text,user:localStorage.getItem("username"),time:Date.now()});
  document.getElementById("noteInput").value="";
};

onSnapshot(query(notesRef,orderBy("time")),snap=>{
  notesList.innerHTML="";
  snap.forEach(doc=>{
    const li=document.createElement("li");
    li.textContent=`${doc.data().user}: ${doc.data().text}`;
    notesList.appendChild(li);
  });
});

/* =========================
   POST FEED (Videos/Images/Docs)
========================= */
const postsRef = collection(db,"posts");

document.getElementById("uploadPostBtn")?.addEventListener("click",async()=>{
  const text = document.getElementById("postText").value.trim();
  const url = document.getElementById("postUrl").value.trim();
  if(!text && !url) return alert("Enter text or link");
  await addDoc(postsRef,{text,url,user:localStorage.getItem("username"),time:Date.now()});
  document.getElementById("postText").value="";
  document.getElementById("postUrl").value="";
});

onSnapshot(query(postsRef,orderBy("time")),(snap)=>{
  feed.innerHTML="";
  snap.forEach(doc=>{
    const div=document.createElement("div");
    div.className="post";
    const data=doc.data();
    div.innerHTML=`<b>${data.user}:</b> ${data.text || ""}`;
    if(data.url){
      if(data.url.includes("youtube.com") || data.url.includes("youtu.be")){
        div.innerHTML+=`<iframe width="100%" height="200" src="${data.url.replace("watch?v=","embed/")}" frameborder="0" allowfullscreen></iframe>`;
      } else if(data.url.match(/\.(jpg|jpeg|png|gif)$/i)){
        div.innerHTML+=`<img src="${data.url}" style="width:100%;margin-top:5px;border-radius:8px;">`;
      } else {
        div.innerHTML+=`<a href="${data.url}" target="_blank" style="color:#0af;display:block;margin-top:5px;">Open file</a>`;
      }
    }
    feed.appendChild(div);
  });
});

/* =========================
   DRAGGABLE WINDOWS
========================= */
document.querySelectorAll(".popup").forEach(popup=>{
  const header=popup.querySelector(".popupHeader");
  let dragging=false,x,y;
  header.onmousedown=e=>{dragging=true;x=e.clientX-popup.offsetLeft;y=e.clientY-popup.offsetTop;};
  document.onmouseup=()=>dragging=false;
  document.onmousemove=e=>{if(!dragging)return;popup.style.left=e.clientX-x+"px";popup.style.top=e.clientY-y+"px";};
});
