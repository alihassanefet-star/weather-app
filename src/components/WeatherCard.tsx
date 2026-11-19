import { useEffect, useState } from "react";
import type { CityData } from "../types/CityData";
import type { WeatherDataAPIResponse } from "../types/WeatherData";
import  {getWeatherCodeDescription} from '../utils/WeatherCodeDescription'
import { getWeatherCodeIconc } from "../utils/getWeatherCodeIcons";

type props ={
    city:CityData;
    handRemoveCity: (id: number) => void;
}

function WeatherCard({city , handRemoveCity}: props){
    const [weather , setWeather] = useState<WeatherDataAPIResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

        useEffect(() => {
            const controller = new AbortController();
            const fetchWeather = async () => {
                setLoading(true);
                setError(null);
                try {
                    const params = new URLSearchParams({
                        latitude: String(city.latitude),
                        longitude: String(city.longitude),
                        current_weather: "true",
                    });
                    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, {
                        signal: controller.signal,
                    });
                    if (!response.ok) {
                        throw new Error(`Weather service returned ${response.status}. Please try again.`);
                    }

                    const data: WeatherDataAPIResponse = await response.json();
                    if (!data.current_weather) {
                        throw new Error("Weather data is unavailable for this city.");
                    }
                    setWeather(data);
                } catch (fetchError) {
                    if (fetchError instanceof Error && fetchError.name === "AbortError") return;
                    setWeather(null);
                    setError(fetchError instanceof Error ? fetchError.message : "Could not load weather.");
                } finally {
                    if (!controller.signal.aborted) setLoading(false);
                }
            }
            fetchWeather();
            return () => controller.abort();
        },[city.latitude, city.longitude]);
        
       


    return(
    <div className="border border-gray-300 rounded-md p-2">
        <div className="flex justify-between items-center">
            <h1>{city.name} , {city.country}</h1>
            <div className="cursor-pointer" onClick={()=> handRemoveCity(city.id)}>🗑️</div>
        </div>
        {loading ? (
            <p className="py-3 text-sm text-gray-500">Loading weather…</p>
        ) : error ? (
            <p role="alert" className="py-3 text-sm text-red-600">{error}</p>
        ) : weather?.current_weather ? (
            <>
                <p className="text-4xl font-bold">{Math.round(weather.current_weather.temperature)}{weather.current_weather_units?.temperature}</p>
                <p className="text-sm">{getWeatherCodeDescription(weather.current_weather.weathercode)} {getWeatherCodeIconc(weather.current_weather.weathercode)}</p>
                <p className="text-sm border border-gray-300 rounded-md p-2">wind: {Math.round(weather.current_weather.windspeed)} {weather.current_weather_units?.windspeed}</p>
            </>
        ) : null}
        <p className="text-xs text-gray-700">Last updated at: {city.updatedAt.toLocaleString()}</p>
    </div>
    )
}

export default WeatherCard
