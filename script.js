/* =========================
   FIREBASE SETUP (YOUR CONFIG)
========================= */

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDhOR8ONBR3Tt01tY05Uxx6TZVXS-uJsOs",
  authDomain: "shoolpub.firebaseapp.com",
  projectId: "shoolpub",
  storageBucket: "shoolpub.firebasestorage.app",
  messagingSenderId: "906607131740",
  appId: "1:906607131740:web:16385bcd22a40501b7fa99",
  measurementId: "G-XD7E1T8KTJ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* =========================
   LOGIN
========================= */

const loginScreen = document.getElementById("loginScreen");
const enterBtn = document.getElementById("enterBtn");
const iconBar = document.getElementById("iconBar");

enterBtn.addEventListener("click", () => {
  const name = document.getElementById("usernameInput").value.trim();
  if (!name) return alert("Enter your name");

  localStorage.setItem("username", name);
  loginScreen.style.display = "none";
  iconBar.classList.remove("hidden");
});

/* =========================
   ICON TOGGLES
========================= */

document.getElementById("weatherIcon").onclick = () =>
  document.getElementById("weather").classList.toggle("hidden");

document.getElementById("calendarIcon").onclick = () =>
  document.getElementById("calendar").classList.toggle("hidden");

/* =========================
   SHARED CALENDAR (FIRESTORE)
========================= */

const notesList = document.getElementById("notes");
const notesRef = collection(db, "calendar");

document.getElementById("addNoteBtn").addEventListener("click", async () => {
  const text = document.getElementById("noteInput").value.trim();
  if (!text) return;

  await addDoc(notesRef, {
    text,
    user: localStorage.getItem("username"),
    time: Date.now()
  });

  document.getElementById("noteInput").value = "";
});

const q = query(notesRef, orderBy("time"));

onSnapshot(q, snapshot => {
  notesList.innerHTML = "";
  snapshot.forEach(doc => {
    const li = document.createElement("li");
    li.textContent = `${doc.data().user}: ${doc.data().text}`;
    notesList.appendChild(li);
  });
});

/* =========================
   DRAGGABLE POPUPS
========================= */

document.querySelectorAll(".popup").forEach(popup => {
  const header = popup.querySelector(".popupHeader");
  let isDragging = false, offsetX, offsetY;

  header.addEventListener("mousedown", e => {
    isDragging = true;
    offsetX = e.clientX - popup.offsetLeft;
    offsetY = e.clientY - popup.offsetTop;
  });

  document.addEventListener("mouseup", () => isDragging = false);

  document.addEventListener("mousemove", e => {
    if (!isDragging) return;
    popup.style.left = e.clientX - offsetX + "px";
    popup.style.top = e.clientY - offsetY + "px";
  });
});
