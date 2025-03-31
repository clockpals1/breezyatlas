
import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import SearchBar from './SearchBar';
import CurrentWeather from './CurrentWeather';
import Forecast from './Forecast';
import { Card, CardContent } from '@/components/ui/card';
import { WeatherData, getCurrentWeather, getForecast, getDailyForecast } from '@/services/weatherService';

const WeatherApp: React.FC = () => {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<WeatherData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (city: string) => {
    setIsLoading(true);
    try {
      // Fetch current weather
      const weatherData = await getCurrentWeather(city);
      setCurrentWeather(weatherData);
      
      // Fetch forecast
      const forecastData = await getForecast(city);
      const dailyForecast = getDailyForecast(forecastData.list);
      setForecast(dailyForecast);
      
      setHasSearched(true);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      toast({
        title: "Error",
        description: `Could not find weather data for "${city}". Please check the city name and try again.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-primary">Weather Forecast</h1>
        <p className="text-muted-foreground">
          Search for a city to get the current weather and 5-day forecast
        </p>
      </div>
      
      <div className="flex justify-center mb-8">
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />
      </div>
      
      {!hasSearched && !isLoading && (
        <Card className="bg-accent border-none">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-medium mb-2">Welcome to the Weather App</h3>
            <p className="text-muted-foreground">
              Enter a city name above to see the current weather and forecast.
            </p>
          </CardContent>
        </Card>
      )}
      
      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      )}
      
      {currentWeather && !isLoading && (
        <>
          <CurrentWeather data={currentWeather} />
          {forecast.length > 0 && <Forecast data={forecast} />}
        </>
      )}
    </div>
  );
};

export default WeatherApp;
