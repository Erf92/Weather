const app = {
  apiUrl: "https://api.weatherapi.com/v1/current.json",
  apiKey: "ba0b69047d3849c499f170743260106",
  searchForm: document.getElementById("searchForm"),
  cityInput: document.getElementById("cityInput"),
  weatherInfo: document.getElementById("weatherInfo"),
  searchBtn: document.getElementById("searchBtn"),
};

async function fetchWeather(city) {
  app.weatherInfo.innerHTML = "<p>درحال دریافت اطلاعات...</p>";

  try {
    const response = await fetch(
      `${app.apiUrl}?key=${app.apiKey}&q=${city}&aqi=no`
    );

    if (!response.ok) throw new Error(`خطا! وضعیت: ${response.status}`);

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);

    const variables = {
      locationName: data.location.name,
      conditionIcon: data.current.condition.icon,
      tempCelsius: data.current.temp_c,
      condition: data.current.condition.text,
      humidity: data.current.humidity,
    };

    displayWeather(variables);
    app.searchBtn.disabled = false;
  } catch (error) {
    console.error("خطا در دریافت اطلاعات: ", error);
    displayError(error.message);
    app.searchBtn.disabled = false;
  }
}

function displayError(message) {
  app.weatherInfo.innerHTML = `<p class="error-text">خطا: ${message}. لطفا دوباره تلاش کنید.</p>`;
}

function displayWeather(result) {
  app.weatherInfo.innerHTML = `
    <article class="weather__cart">
      <img class="cart__icon" src="https:${result.conditionIcon}" alt="آیکون آب و هوا" />
      <h2 class="cart__location">${result.locationName}</h2>
      <span class="cart__temp">${result.tempCelsius} درجه سانتی گراد</span>
      <span class="cart__condition">${result.condition}</span>
      <span class="cart__humidity">رطوبت: ${result.humidity}</span>
    </article>
  `;
}

if (app.searchForm) {
  app.searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const city = app.cityInput.value.trim();
    if (!city) return;
    app.searchBtn.disabled = true;
    app.cityInput.value = "";
    fetchWeather(city);
  });
}

fetchWeather("Tehran");
