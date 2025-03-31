
import React from 'react';
import { WeatherData } from '@/services/weatherService';
import ForecastItem from './ForecastItem';

interface ForecastProps {
  data: WeatherData[];
}

const Forecast: React.FC<ForecastProps> = ({ data }) => {
  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4">5-Day Forecast</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {data.map((day, index) => (
          <ForecastItem key={index} data={day} />
        ))}
      </div>
    </div>
  );
};

export default Forecast;
