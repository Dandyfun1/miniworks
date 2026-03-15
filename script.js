// --- Theme & Background ---
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    themeToggle.innerHTML = newTheme === 'light' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
});

document.getElementById('bg-upload').addEventListener('change', function(e) {
    const reader = new FileReader();
    reader.onload = function() {
        document.body.style.backgroundImage = `url(${reader.result})`;
        localStorage.setItem('user-bg', reader.result);
    }
    reader.readAsDataURL(e.target.files[0]);
});

// Load saved BG
if(localStorage.getItem('user-bg')) {
    document.body.style.backgroundImage = `url(${localStorage.getItem('user-bg')})`;
}

// --- Modal Logic ---
const overlay = document.getElementById('modal-overlay');
const content = document.getElementById('modal-content');

function openModal(templateId) {
    const temp = document.getElementById(templateId).content.cloneNode(true);
    content.innerHTML = '';
    content.appendChild(temp);
    overlay.classList.remove('modal-hide');
    if(templateId === 'temp-clock') startClock();
    if(templateId === 'temp-calendar') renderCalendar();
}

document.querySelectorAll('.icon-btn').forEach(btn => {
    btn.onclick = () => openModal(btn.id.replace('open-', 'temp-'));
});

overlay.onclick = (e) => { if(e.target === overlay || e.target.className === 'close-modal') overlay.classList.add('modal-hide'); };

// --- Clock ---
function startClock() {
    setInterval(() => {
        const now = new Date();
        const hr = now.getHours();
        const min = now.getMinutes();
        const sec = now.getSeconds();
        
        document.getElementById('hour').style.transform = `rotate(${30 * hr + min / 2}deg)`;
        document.getElementById('minute').style.transform = `rotate(${6 * min}deg)`;
        document.getElementById('second').style.transform = `rotate(${6 * sec}deg)`;
        
        const digital = document.getElementById('digital-time');
        if(digital) digital.innerText = now.toLocaleTimeString();
    }, 1000);
}

// --- Calendar & Events ---
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let selectedDateStr = null;
let events = JSON.parse(localStorage.getItem('cal-events')) || {};

function renderCalendar() {
    const daysContainer = document.getElementById('calendar-days');
    const monthDisplay = document.getElementById('month-display');
    daysContainer.innerHTML = '';
    
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    monthDisplay.innerText = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(currentYear, currentMonth));

    for (let i = 0; i < firstDay; i++) daysContainer.appendChild(document.createElement('div'));

    for (let d = 1; d <= daysInMonth; d++) {
        const dayEl = document.createElement('div');
        dayEl.className = 'day';
        const dateStr = `${currentYear}-${currentMonth}-${d}`;
        if(events[dateStr]) dayEl.classList.add('has-event');
        dayEl.innerText = d;
        dayEl.onclick = () => {
            selectedDateStr = dateStr;
            document.querySelectorAll('.day').forEach(el => el.classList.remove('selected-day'));
            dayEl.classList.add('selected-day');
        };
        daysContainer.appendChild(dayEl);
    }
}

function saveEvent() {
    const text = document.getElementById('event-text').value;
    if(!selectedDateStr) return alert("Select a day first!");
    events[selectedDateStr] = text;
    localStorage.setItem('cal-events', JSON.stringify(events));
    renderCalendar();
}

// --- File & Google Docs Management ---
function addGoogleDoc() {
    const url = document.getElementById('gdoc-link').value;
    if(!url.includes('docs.google.com')) return alert("Invalid Google Link");
    
    // Convert sharing link to preview link
    let previewUrl = url.replace(/\/edit.*$/, '/preview');
    addFileCard(previewUrl, "Google Doc/Slide", true);
}

function addFileCard(src, name, isIframe = false) {
    const grid = document.getElementById('file-list');
    const card = document.createElement('div');
    card.className = 'file-card';
    card.innerHTML = isIframe 
        ? `<iframe></iframe><p>${name}</p>` 
        : `<i class="fas fa-file-alt fa-3x"></i><p>${name}</p>`;
    if(isIframe) card.querySelector('iframe').src = src;
    grid.appendChild(card);
}

document.getElementById('file-input').addEventListener('change', (e) => {
    Array.from(e.target.files).forEach(file => {
        addFileCard("", file.name, false);
    });
});
