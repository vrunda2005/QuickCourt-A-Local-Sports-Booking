import React, { useState, useEffect } from "react";
import axios from "axios";

const avatarUrl =
  "https://upload.wikimedia.org/wikipedia/en/7/7b/Minion_Icon.png"; // Free Minion icon PNG

const getSuggestion = (condition: string) => {
  // Friendly suggestions based on weather condition text (simple examples)
  condition = condition.toLowerCase();
  if (condition.includes("rain") || condition.includes("storm")) {
    return "Looks like rain! How about an indoor badminton or basketball game today?";
  }
  if (condition.includes("cloud") || condition.includes("fog")) {
    return "A bit cloudy — perfect for indoor sports or a cozy tennis match.";
  }
  if (condition.includes("sun") || condition.includes("clear")) {
    return "It's sunny out today, would be fun swimming or playing football outside!";
  }
  if (condition.includes("snow")) {
    return "Snowy weather! Stay warm with some indoor basketball or badminton.";
  }
  return "Enjoy your day! Whether indoor or outdoor, sports are always fun!";
};

const WeatherAvatarDialog: React.FC = () => {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    if (!showDialog) return;

    setLoading(true);
    setError(null);

    axios
      .get("/api/weather?lat=23.0225&lon=72.5714") // Ahmedabad lat/lon example
      .then((res) => setWeather(res.data))
      .catch(() => setError("Failed to fetch weather."))
      .finally(() => setLoading(false));
  }, [showDialog]);

  return (
    <div
      style={{
        position: "relative",
        width: 150,
        margin: "20px auto",
        cursor: "pointer",
        userSelect: "none",
      }}
      onClick={() => setShowDialog((prev) => !prev)}
      title="Click me for weather info!"
    >
      {/* Avatar Image */}
      <img
        src={avatarUrl}
        alt="Avatar"
        style={{ width: "150px", height: "auto", borderRadius: 20 }}
      />

      {/* Speech bubble */}
      {showDialog && (
        <div
          style={{
            position: "absolute",
            top: "-120px",
            left: "50%",
            transform: "translateX(-50%)",
            maxWidth: 280,
            backgroundColor: "#fff",
            borderRadius: 15,
            padding: "12px 16px",
            boxShadow: "0 6px 12px rgba(0,0,0,0.2)",
            fontSize: 14,
            color: "#333",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            zIndex: 1000,
          }}
        >
          {/* Triangle pointer */}
          <div
            style={{
              position: "absolute",
              bottom: "-15px",
              left: "50%",
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: "12px solid transparent",
              borderRight: "12px solid transparent",
              borderTop: "15px solid #fff",
            }}
          />

          {loading && <p>Loading weather info...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
          {weather && (
            <>
              <p style={{ fontWeight: "bold", marginBottom: 8 }}>
                {weather.location.name} Weather
              </p>
              <p style={{ margin: "4px 0" }}>
                {weather.current.temp_c}°C, {weather.current.condition.text}
              </p>
              <p style={{ marginTop: 8, fontStyle: "italic" }}>
                {getSuggestion(weather.current.condition.text)}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default WeatherAvatarDialog;
