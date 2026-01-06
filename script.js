// Smooth scroll

document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector(link.getAttribute('href'))
      .scrollIntoView({ behavior: 'smooth' });
  });
});

// Simple animation on scroll
const cards = document.querySelectorAll('.card');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
}, { threshold: 0.15 });

cards.forEach(card => {
  card.classList.add('hidden');
  observer.observe(card);
});
btn.classList.add('btn-loading');
setTimeout(() => btn.classList.remove('btn-loading'), 2000);

const API_KEY = "1930172265085f1a866f2928cc336da9";

const card = document.querySelector(".weather-card");
const tempEl = document.querySelector(".temp");
const locationEl = document.querySelector(".location");
const dateEl = document.querySelector(".date");

function setDate() {
  const now = new Date();
  dateEl.textContent = now.toDateString();
}

function setWeatherUI(weather) {
  card.classList.remove(
    "weather-clear",
    "weather-clouds",
    "weather-rain",
    "weather-night"
  );

  if (weather === "Clear") card.classList.add("weather-clear");
  if (weather === "Clouds") card.classList.add("weather-clouds");
  if (weather === "Rain" || weather === "Drizzle")
    card.classList.add("weather-rain");
}

function checkNight(sunrise, sunset) {
  const now = Math.floor(Date.now() / 1000);
  if (now < sunrise || now > sunset) {
    card.classList.add("weather-night");
  }
}

navigator.geolocation.getCurrentPosition(
  pos => {
    const { latitude, longitude } = pos.coords;

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
    )
      .then(res => res.json())
      .then(data => {
        tempEl.textContent = Math.round(data.main.temp) + "°";
        locationEl.innerHTML = `${data.name}<br>${data.sys.country}`;

        setDate();
        setWeatherUI(data.weather[0].main);
        checkNight(data.sys.sunrise, data.sys.sunset);
      });
  },
  () => {
    locationEl.textContent = "Location denied";
  }
);


