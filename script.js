async function getCleanWeather() {
    const apiKey = 'YOUR_API_KEY_HERE'; // <--- PUT YOUR KEY HERE
    const city = 'Vitoria-Gasteiz';
    try {
        const response = await fetch(`https://api.openweathermap.org{city}&units=metric&appid=${apiKey}`);
        const data = await response.json();
        
        document.getElementById('temp').innerText = Math.round(data.main.temp) + '°C';
        document.getElementById('desc').innerText = data.weather[0].description;
        // Sets a clean icon based on weather
        const iconCode = data.weather[0].icon;
        document.getElementById('weather-icon').innerHTML = `<img src="http://openweathermap.org{iconCode}@2x.png">`;
    } catch (error) {
        document.getElementById('desc').innerText = "Weather unavailable (Check API Key)";
    }
}

// Call this function when the weather popup is opened
function togglePopup(id) {
    const el = document.getElementById(id);
    const isOpened = el.style.display === 'block';
    document.querySelectorAll('.popup').forEach(p => p.style.display = 'none');
    el.style.display = isOpened ? 'none' : 'block';
    
    if(id === 'weather-pop' && !isOpened) {
        getCleanWeather();
    }
}
