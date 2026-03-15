// --- 1. THEME & BACKGROUND ---
const themeToggle = document.getElementById('theme-toggle');
themeToggle.onclick = () => {
    const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    themeToggle.innerHTML = theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
};

document.getElementById('bg-upload').onchange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (res) => {
        document.getElementById('bg-layer').style.backgroundImage = `url(${res.target.result})`;
        localStorage.setItem('user-bg', res.target.result);
    };
    reader.readAsDataURL(file);
};

// --- 2. POPUP CONTROLS ---
function togglePopup(id) {
    const el = document.getElementById(id);
    const isOpened = el.style.display === 'block';
    document.querySelectorAll('.popup').forEach(p => p.style.display = 'none');
    el.style.display = isOpened ? 'none' : 'block';
}

// --- 3. DRAG & DROP + FILE MANAGEMENT ---
const dropZone = document.getElementById('drop-zone');
const hiddenInput = document.getElementById('file-input-hidden');

dropZone.onclick = () => hiddenInput.click();

['dragover', 'dragleave', 'drop'].forEach(evt => {
    dropZone.addEventListener(evt, (e) => {
        e.preventDefault();
        if(evt === 'dragover') dropZone.classList.add('active');
        else dropZone.classList.remove('active');
        if(evt === 'drop') handleFiles(e.dataTransfer.files);
    });
});

hiddenInput.onchange = (e) => handleFiles(e.target.files);

function handleFiles(files) {
    Array.from(files).forEach(file => {
        addFileToGrid("", file.name, false);
    });
}

function addGoogleAsset() {
    const url = document.getElementById('glink').value;
    if(!url.includes('docs.google.com')) return alert("Please enter a valid Google Docs link.");
    const preview = url.replace(/\/edit.*$/, "/preview");
    addFileToGrid(preview, "Google Resource", true);
}

function addFileToGrid(src, name, isIframe) {
    const grid = document.getElementById('file-grid');
    const div = document.createElement('div');
    div.className = 'file-item';
    div.innerHTML = isIframe 
        ? `<iframe src="${src}"></iframe><p>${name}</p>` 
        : `<div style="font-size:3rem; padding:20px;"><i class="fas fa-file-lines"></i></div><p>${name}</p>`;
    grid.appendChild(div);
}

// --- 4. ANALOG CLOCK ---
setInterval(() => {
    const d = new Date();
    const hr = d.getHours();
    const min = d.getMinutes();
    const sec = d.getSeconds();
    document.getElementById('hour-hand').style.transform = `rotate(${30 * hr + min/2}deg)`;
    document.getElementById('min-hand').style.transform = `rotate(${6 * min}deg)`;
    document.getElementById('sec-hand').style.transform = `rotate(${6 * sec}deg)`;
    document.getElementById('digital-clock').innerText = d.toLocaleTimeString();
}, 1000);

// --- 5. CALENDAR & EVENTS ---
let calDate = new Date();
let events = JSON.parse(localStorage.getItem('user-events') || '{}');
let selectedKey = null;

function renderCalendar() {
    const grid = document.getElementById('calendar-days');
    const monthLabel = document.getElementById('month-name');
    grid.innerHTML = "";
    monthLabel.innerText = calDate.toLocaleString('default', { month: 'long', year: 'numeric' });

    const first = new Date(calDate.getFullYear(), calDate.getMonth(), 1).getDay();
    const last = new Date(calDate.getFullYear(), calDate.getMonth() + 1, 0).getDate();

    for(let i=0; i<first; i++) grid.appendChild(document.createElement('div'));
    for(let d=1; d<=last; d++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'day';
        const key = `${calDate.getFullYear()}-${calDate.getMonth()}-${d}`;
        if(events[key]) dayDiv.classList.add('has-event');
        dayDiv.innerText = d;
        dayDiv.onclick = () => {
            selectedKey = key;
            document.querySelectorAll('.day').forEach(d => d.classList.remove('selected'));
            dayDiv.classList.add('selected');
        };
        grid.appendChild(dayDiv);
    }
}

function moveMonth(dir) { calDate.setMonth(calDate.getMonth() + dir); renderCalendar(); }
function saveEvent() {
    if(!selectedKey) return alert("Select a date first!");
    const txt = document.getElementById('event-input').value;
    events[selectedKey] = txt;
    localStorage.setItem('user-events', JSON.stringify(events));
    renderCalendar();
}

// Initial Load
renderCalendar();
if(localStorage.getItem('user-bg')) {
    document.getElementById('bg-layer').style.backgroundImage = `url(${localStorage.getItem('user-bg')})`;
}
