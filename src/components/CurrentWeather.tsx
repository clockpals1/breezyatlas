
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { WeatherData, getWeatherGradientClass, isNightTime, getFormattedDate } from '@/services/weatherService';
import { Cloud, CloudDrizzle, CloudLightning, CloudRain, CloudSun, Sun } from 'lucide-react';

interface CurrentWeatherProps {
  data: WeatherData;
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ data }) => {
  const night = isNightTime(data.icon);
  const gradientClass = getWeatherGradientClass(data.main, night);
  
  const getWeatherIcon = () => {
    switch (data.main.toLowerCase()) {
      case 'clear':
        return <Sun className="h-16 w-16 text-yellow-400" />;
      case 'clouds':
        return <Cloud className="h-16 w-16 text-gray-200" />;
      case 'rain':
        return <CloudRain className="h-16 w-16 text-blue-300" />;
      case 'drizzle':
        return <CloudDrizzle className="h-16 w-16 text-blue-300" />;
      case 'thunderstorm':
        return <CloudLightning className="h-16 w-16 text-yellow-300" />;
      default:
        return <CloudSun className="h-16 w-16 text-yellow-400" />;
    }
  };

  return (
    <Card className={`w-full overflow-hidden border-none shadow-lg ${gradientClass}`}>
      <CardContent className="p-6 text-white">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-2xl font-bold">{data.city}, {data.country}</h2>
            <p className="text-sm opacity-90">{getFormattedDate(data.dt)}</p>
            <p className="text-lg mt-2 capitalize">{data.description}</p>
          </div>
          
          <div className="flex items-center gap-4">
            {getWeatherIcon()}
            <div className="text-center md:text-right">
              <p className="text-5xl font-bold">{Math.round(data.temperature)}°C</p>
              <p className="text-sm">Feels like: {Math.round(data.feelsLike)}°C</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
            <p className="text-sm font-semibold">Humidity</p>
            <p className="text-lg">{data.humidity}%</p>
          </div>
          <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
            <p className="text-sm font-semibold">Wind Speed</p>
            <p className="text-lg">{data.windSpeed} m/s</p>
          </div>
          <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm md:col-span-2">
            <p className="text-sm font-semibold">Weather</p>
            <p className="text-lg capitalize">{data.description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentWeather;
