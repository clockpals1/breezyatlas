
let API_KEY = ""; // Will be set by the app
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export type WeatherData = {
  city: string;
  country: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
  main: string;
  dt: number;
};

export type ForecastData = {
  list: WeatherData[];
  city: {
    name: string;
    country: string;
  };
};

export const setApiKey = (apiKey: string) => {
  API_KEY = apiKey;
};

export const getCurrentWeather = async (city: string): Promise<WeatherData> => {
  try {
    if (!API_KEY) {
      throw new Error("API key not set");
    }
    
    console.log(`Attempting to fetch weather for ${city} with API key: ${API_KEY.substring(0, 3)}...${API_KEY.substring(API_KEY.length - 3)}`);
    
    const response = await fetch(
      `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    
    const responseText = await response.text();
    let errorData;
    
    try {
      errorData = JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse response as JSON:", responseText);
      errorData = { message: "Unknown error occurred" };
    }
    
    if (!response.ok) {
      console.error("Error response:", errorData);
      
      if (response.status === 401) {
        throw new Error("Invalid API key. Please check your API key and try again.");
      } else if (response.status === 404) {
        throw new Error(`City '${city}' not found. Please check the spelling and try again.`);
      } else if (errorData && errorData.message) {
        throw new Error(`Error: ${errorData.message}`);
      } else {
        throw new Error(`Weather data not found for ${city}. Server returned status ${response.status}`);
      }
    }
    
    const data = errorData;
    
    return {
      city: data.name,
      country: data.sys.country,
      temperature: data.main.temp,
      feelsLike: data.main.feels_like,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      main: data.weather[0].main,
      dt: data.dt,
    };
  } catch (error) {
    console.error("Error fetching current weather:", error);
    throw error;
  }
};

export const getForecast = async (city: string): Promise<ForecastData> => {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 401) {
        throw new Error("Invalid API key. Please check your API key and try again.");
      } else if (response.status === 404) {
        throw new Error(`City '${city}' not found. Please check the spelling and try again.`);
      } else {
        throw new Error(errorData.message || `Forecast data not found for ${city}`);
      }
    }
    
    const data = await response.json();
    
    // Process the forecast data
    const processedData = {
      list: data.list.map((item: any) => ({
        temperature: item.main.temp,
        feelsLike: item.main.feels_like,
        humidity: item.main.humidity,
        windSpeed: item.wind.speed,
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        main: item.weather[0].main,
        dt: item.dt,
        city: data.city.name,
        country: data.city.country
      })),
      city: {
        name: data.city.name,
        country: data.city.country
      }
    };
    
    return processedData;
  } catch (error) {
    console.error("Error fetching forecast:", error);
    throw error;
  }
};

export const getWeatherGradientClass = (weatherMain: string, isNight: boolean = false): string => {
  if (isNight) return "weather-gradient-night";
  
  switch (weatherMain.toLowerCase()) {
    case "clear":
      return "weather-gradient-clear";
    case "clouds":
      return "weather-gradient-clouds";
    case "rain":
    case "drizzle":
      return "weather-gradient-rain";
    case "thunderstorm":
      return "weather-gradient-thunderstorm";
    case "snow":
      return "weather-gradient-snow";
    case "mist":
    case "fog":
    case "haze":
      return "weather-gradient-mist";
    default:
      return "weather-gradient-clear";
  }
};

export const isNightTime = (iconCode: string): boolean => {
  return iconCode.includes("n");
};

export const getFormattedDate = (timestamp: number, format: 'full' | 'day' | 'time' = 'full'): string => {
  const date = new Date(timestamp * 1000);
  
  if (format === 'day') {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  } else if (format === 'time') {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }
  
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
};

export const getDailyForecast = (forecastList: WeatherData[]): WeatherData[] => {
  const dailyData: WeatherData[] = [];
  const today = new Date().setHours(0, 0, 0, 0);
  
  // Group by day and take the noon forecast for each day
  const days = new Set<string>();
  
  forecastList.forEach(item => {
    const date = new Date(item.dt * 1000);
    const day = date.toISOString().split('T')[0];
    
    // Skip today
    if (date.setHours(0, 0, 0, 0) === today) {
      return;
    }
    
    if (!days.has(day) && dailyData.length < 5) {
      // Find forecasts for this day
      const dayForecasts = forecastList.filter(forecast => {
        const forecastDate = new Date(forecast.dt * 1000);
        return forecastDate.toISOString().split('T')[0] === day;
      });
      
      // Try to get the noon forecast
      const noonForecast = dayForecasts.find(forecast => {
        const forecastHour = new Date(forecast.dt * 1000).getHours();
        return forecastHour >= 12 && forecastHour <= 15;
      });
      
      if (noonForecast) {
        dailyData.push(noonForecast);
        days.add(day);
      } else if (dayForecasts.length > 0) {
        // If no noon forecast, use the first one for the day
        dailyData.push(dayForecasts[0]);
        days.add(day);
      }
    }
  });
  
  return dailyData;
};
