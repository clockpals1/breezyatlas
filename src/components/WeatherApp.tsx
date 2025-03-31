
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SearchBar from './SearchBar';
import CurrentWeather from './CurrentWeather';
import Forecast from './Forecast';
import { Card, CardContent } from '@/components/ui/card';
import { WeatherData, getCurrentWeather, getForecast, getDailyForecast, setApiKey } from '@/services/weatherService';
import { ExternalLink } from 'lucide-react';

const WeatherApp: React.FC = () => {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<WeatherData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [apiKey, setLocalApiKey] = useState('');
  const [showApiInput, setShowApiInput] = useState(false);
  const [storedApiKey, setStoredApiKey] = useState<string | null>(null);
  const [validationInProgress, setValidationInProgress] = useState(false);
  
  const { toast } = useToast();

  useEffect(() => {
    const savedApiKey = localStorage.getItem('weatherApiKey');
    if (savedApiKey) {
      setStoredApiKey(savedApiKey);
      setApiKey(savedApiKey);
    } else {
      setShowApiInput(true);
    }
  }, []);

  const handleSaveApiKey = async () => {
    const trimmedApiKey = apiKey.trim();
    
    if (!trimmedApiKey) {
      toast({
        title: "Error",
        description: "API key cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    setValidationInProgress(true);
    setApiKey(trimmedApiKey);

    try {
      // Test the API key with a known city
      await getCurrentWeather('London');
      
      localStorage.setItem('weatherApiKey', trimmedApiKey);
      setStoredApiKey(trimmedApiKey);
      setShowApiInput(false);
      
      toast({
        title: "API Key Validated",
        description: "Your OpenWeatherMap API key has been successfully saved and tested.",
      });
    } catch (error) {
      console.error('API key validation failed:', error);
      let errorMessage = "The provided API key could not be validated.";
      
      if (error instanceof Error) {
        if (error.message.includes("Invalid API key")) {
          errorMessage = "The API key is invalid. Please check the key and try again.";
        } else if (error.message.includes("not found")) {
          errorMessage = "There was an issue connecting to the weather service. Please try again later.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "API Key Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setValidationInProgress(false);
    }
  };

  const handleClearApiKey = () => {
    localStorage.removeItem('weatherApiKey');
    setStoredApiKey(null);
    setShowApiInput(true);
    toast({
      title: "API Key Removed",
      description: "Your API key has been removed.",
    });
  };

  const handleSearch = async (city: string) => {
    if (!storedApiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your OpenWeatherMap API key first.",
        variant: "destructive",
      });
      setShowApiInput(true);
      return;
    }
    
    setIsLoading(true);
    try {
      const weatherData = await getCurrentWeather(city);
      setCurrentWeather(weatherData);
      
      const forecastData = await getForecast(city);
      const dailyForecast = getDailyForecast(forecastData.list);
      setForecast(dailyForecast);
      
      setHasSearched(true);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      let errorMessage = `Could not find weather data for "${city}". Please check the city name and try again.`;
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Search Error",
        description: errorMessage,
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
      
      {showApiInput && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-2">Enter OpenWeatherMap API Key</h3>
            <p className="text-sm text-muted-foreground mb-4">
              To use this app, you need an API key from{' '}
              <a 
                href="https://openweathermap.org/api" 
                target="_blank" 
                rel="noopener" 
                className="text-blue-500 hover:underline inline-flex items-center"
              >
                OpenWeatherMap <ExternalLink className="h-3 w-3 ml-1" />
              </a>. 
              Sign up for free and enter your key below.
            </p>
            <Alert className="mb-4 bg-yellow-50 border-yellow-200">
              <AlertTitle>Important Notes About API Keys</AlertTitle>
              <AlertDescription className="space-y-2">
                <p>1. <strong>New API keys may take up to 2 hours to activate.</strong> If you just created your key, please wait before trying again.</p>
                <p>2. Make sure you're copying the entire key without any extra spaces.</p>
                <p>3. Verify you're using the correct key. There are different types of API keys for different OpenWeatherMap services.</p>
                <p>4. The free tier API key works with this app. You don't need a paid subscription.</p>
              </AlertDescription>
            </Alert>
            <div className="flex gap-2">
              <Input 
                type="text" 
                placeholder="Enter your API key" 
                value={apiKey} 
                onChange={(e) => setLocalApiKey(e.target.value)}
                className="flex-1"
                disabled={validationInProgress}
              />
              <Button onClick={handleSaveApiKey} disabled={validationInProgress}>
                {validationInProgress ? (
                  <>
                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                    Validating...
                  </>
                ) : "Save Key"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {storedApiKey && (
        <div className="mb-6 flex justify-end">
          <Button variant="outline" size="sm" onClick={() => setShowApiInput(!showApiInput)}>
            {showApiInput ? 'Hide API Settings' : 'Show API Settings'}
          </Button>
          {showApiInput && (
            <Button variant="destructive" size="sm" className="ml-2" onClick={handleClearApiKey}>
              Clear API Key
            </Button>
          )}
        </div>
      )}
      
      <div className="flex justify-center mb-8">
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />
      </div>
      
      {!storedApiKey && (
        <Alert className="mb-6">
          <AlertDescription>
            Please enter your OpenWeatherMap API key above to use the weather app.
          </AlertDescription>
        </Alert>
      )}
      
      {!hasSearched && !isLoading && storedApiKey && (
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
