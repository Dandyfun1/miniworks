let hoverTimer;

const loginScreen = document.getElementById("loginScreen");
const app = document.getElementById("app");
const widgets = document.getElementById("widgets");
const welcomeText = document.getElementById("welcomeText");
const globalSettings = document.getElementById("globalSettings");
const userSettings = document.getElementById("userSettings");

/* ENTER SITE */
function enterSite() {
  const name = document.getElementById("usernameInput").value.trim();
  if (!name) {
    alert("Please enter your name");
    return;
  }

  localStorage.setItem("username", name);

  loginScreen.classList.add("hidden");
  app.classList.remove("hidden");
  widgets.classList.remove("hidden");

  welcomeText.textContent = `Welcome, ${name}`;

  const bg = localStorage.getItem(name + "_bg");
  if (bg) {
    document.body.style.backgroundImage = `url(${bg})`;
  }
}

/* SETTINGS ICON (3s hover) */
globalSettings.addEventListener("mouseenter", () => {
  hoverTimer = setTimeout(() => {
    userSettings.classList.toggle("hidden");
  }, 3000);
});

globalSettings.addEventListener("mouseleave", () => {
  clearTimeout(hoverTimer);
});

/* SAVE BACKGROUND */
function saveBackground() {
  const bg = document.getElementById("bgInput").value;
  const name = localStorage.getItem("username");
  if (!bg) return;

  localStorage.setItem(name + "_bg", bg);
  document.body.style.backgroundImage = `url(${bg})`;
}

/* LIVE CLOCK — SPAIN (VITORIA-GASTEIZ) */
function updateClock() {
  const now = new Date();
  const time = now.toLocaleTimeString("es-ES", {
    timeZone: "Europe/Madrid",
    hour: "2-digit",
    minute: "2-digit"
  });
  document.getElementById("clock").textContent = time;
}

setInterval(updateClock, 1000);
updateClock();
