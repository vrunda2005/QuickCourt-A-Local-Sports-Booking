import React, { useEffect, useState } from "react";

const API_KEY = "27a8a08661404473bd6210053251108"; // your WeatherAPI key
const LOCATION = "Ahmedabad"; // change as needed

const AVATAR_GIF_URL = "https://i.pinimg.com/originals/fb/e4/2f/fbe42f6da526b9da82ddba860e5700bf.gif";

interface WeatherData {
  temp_c: number;
  humidity: number;
  condition: { text: string; icon: string };
}

function getSuggestion(weather: WeatherData) {
  const temp = weather.temp_c;
  const humidity = weather.humidity;
  const conditionText = weather.condition.text.toLowerCase();

  if (conditionText.includes("rain") || conditionText.includes("drizzle") || conditionText.includes("storm")) {
    return {
      sport: "Indoor Badminton or Tennis",
      message: "It's rainy outside, indoor badminton or tennis courts are best today!",
    };
  }
  if (conditionText.includes("snow")) {
    return {
      sport: "Indoor sports",
      message: "Snow outside, better to play indoor sports for safety.",
    };
  }
  if (conditionText.includes("fog") || conditionText.includes("mist")) {
    return {
      sport: "Indoor or low-intensity sports",
      message: "It's misty, consider indoor sports or light activities for safety.",
    };
  }
  if (temp >= 30) {
    if (humidity >= 70) {
      return {
        sport: "Indoor Swimming or Air-conditioned Gym",
        message: `It's hot and humid (${temp}°C, humidity ${humidity}%), swimming indoors or gym workouts are ideal.`,
      };
    }
    return {
      sport: "Swimming or Evening Basketball",
      message: `It's quite hot (${temp}°C), swimming or playing basketball in the evening is recommended.`,
    };
  }
  if (temp >= 20 && temp < 30) {
    return {
      sport: "Outdoor Tennis or Badminton",
      message: `Nice weather (${temp}°C)! Perfect for outdoor tennis or badminton.`,
    };
  }
  if (temp >= 10 && temp < 20) {
    return {
      sport: "Indoor Basketball or Tennis",
      message: `Cool weather (${temp}°C). Indoor basketball or tennis would be comfortable.`,
    };
  }
  if (temp < 10) {
    return {
      sport: "Indoor sports or Gym",
      message: `It's cold (${temp}°C). Indoor sports or gym sessions are better today.`,
    };
  }
  return {
    sport: "Any sport you like!",
    message: `Weather looks good! (${temp}°C, humidity ${humidity}%) Play whatever you prefer.`,
  };
}

const WeatherAvatar = () => {
  const [weather, setWeather] = useState<null | WeatherData>(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(
      `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${LOCATION}&aqi=no`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch weather");
        return res.json();
      })
      .then((data) => {
        setWeather(data.current);
        setError("");
      })
      .catch((e) => {
        setError(e.message);
        setWeather(null);
      });
  }, []);

  const suggestion = weather ? getSuggestion(weather) : null;

  return (
    <>
      <div
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          width: 150,
          cursor: "pointer",
          zIndex: 1000,
          userSelect: "none",
          textAlign: "center",
          fontFamily: "'Comic Sans MS', cursive, sans-serif",
          color: "#333",
          fontWeight: "bold",
          textShadow: "1px 1px 2px #fff",
          userSelect: "none",
        }}
        onClick={() => setOpen(!open)}
        aria-label="Toggle weather advice"
        title="Click for weather advice"
      >
        <img
          src={AVATAR_GIF_URL}
          alt="Minion avatar"
          style={{
            width: 150,
            borderRadius: 20,
            boxShadow: "0 0 10px rgba(0,0,0,0.3)",
            animation: "bounce 1s infinite alternate",
          }}
        />
        <div style={{ marginTop: 5, fontSize: 14 }}>
          Hey! I want to suggest something
        </div>
        {open && (
          <div
            style={{
              position: "absolute",
              bottom: 140,
              right: 0,
              width: 280,
              background: "rgba(255,255,224,0.95)",
              borderRadius: 10,
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
              padding: 15,
              fontSize: 14,
              color: "#333",
              fontFamily: "'Comic Sans MS', cursive, sans-serif",
              lineHeight: 1.4,
              textAlign: "left",
            }}
          >
            {error && (
              <div style={{ color: "red", fontWeight: "bold" }}>
                Error fetching weather: {error}
              </div>
            )}
            {weather && !error && (
              <>
                <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                  <img
                    src={"https:" + weather.condition.icon}
                    alt={weather.condition.text}
                    style={{ width: 32, marginRight: 10 }}
                  />
                  <div>
                    <strong>{LOCATION}</strong> <br />
                    {weather.condition.text}, {weather.temp_c}°C, Humidity: {weather.humidity}%
                  </div>
                </div>
                <hr style={{ margin: "8px 0" }} />
                <div>
                
                  {suggestion?.message}
                </div>
              </>
            )}
            {!weather && !error && <div>Loading weather...</div>}
          </div>
        )}
      </div>
    </>
  );
};

export default WeatherAvatar;
