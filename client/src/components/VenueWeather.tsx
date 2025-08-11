import React, { useEffect, useState } from "react";
import axios from "axios";

interface WeatherData {
  location: {
    name: string;
    region: string;
    country: string;
  };
  current: {
    temp_c: number;
    condition: {
      text: string;
      icon: string;
    };
    wind_kph: number;
    humidity: number;
  };
}

interface VenueWeatherProps {
  lat: number;
  lon: number;
}

const VenueWeather: React.FC<VenueWeatherProps> = ({ lat, lon }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!lat || !lon) return;

    setLoading(true);
    setError(null);

    axios
      .get(`/api/weather?lat=${lat}&lon=${lon}`)
      .then((res) => {
        setWeather(res.data);
      })
      .catch(() => {
        setError("Failed to load weather data.");
        setWeather(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [lat, lon]);

  if (loading) return <div>Loading weather...</div>;
  if (error) return <div>{error}</div>;
  if (!weather) return null;

  return (
    <div className="venue-weather" style={{ border: "1px solid #ccc", padding: "1rem", marginTop: "1rem" }}>
      <h4>Current Weather in {weather.location.name}</h4>
      <p>
        <img
          src={weather.current.condition.icon}
          alt={weather.current.condition.text}
          style={{ verticalAlign: "middle", marginRight: "0.5rem" }}
        />
        {weather.current.condition.text}
      </p>
      <p>Temperature: {weather.current.temp_c} °C</p>
      <p>Humidity: {weather.current.humidity}%</p>
      <p>Wind Speed: {weather.current.wind_kph} km/h</p>
    </div>
  );
};

export default VenueWeather;
