
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { WeatherData, getFormattedDate, getWeatherGradientClass, isNightTime } from '@/services/weatherService';
import { Cloud, CloudDrizzle, CloudLightning, CloudRain, CloudSun, Sun } from 'lucide-react';

interface ForecastItemProps {
  data: WeatherData;
}

const ForecastItem: React.FC<ForecastItemProps> = ({ data }) => {
  const night = isNightTime(data.icon);
  const gradientClass = getWeatherGradientClass(data.main, night);

  const getWeatherIcon = () => {
    switch (data.main.toLowerCase()) {
      case 'clear':
        return <Sun className="h-8 w-8 text-yellow-400" />;
      case 'clouds':
        return <Cloud className="h-8 w-8 text-gray-200" />;
      case 'rain':
        return <CloudRain className="h-8 w-8 text-blue-300" />;
      case 'drizzle':
        return <CloudDrizzle className="h-8 w-8 text-blue-300" />;
      case 'thunderstorm':
        return <CloudLightning className="h-8 w-8 text-yellow-300" />;
      default:
        return <CloudSun className="h-8 w-8 text-yellow-400" />;
    }
  };

  return (
    <Card className={`overflow-hidden border-none shadow-md ${gradientClass}`}>
      <CardContent className="p-4 text-white">
        <div className="flex flex-col items-center">
          <p className="font-semibold">{getFormattedDate(data.dt, 'day')}</p>
          {getWeatherIcon()}
          <p className="mt-1 text-2xl font-bold">{Math.round(data.temperature)}°C</p>
          <p className="text-xs font-medium mt-1 capitalize">{data.description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ForecastItem;
