import dayjs from 'dayjs';
import dotenv from 'dotenv';
dotenv.config();

// Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// Define a class for the Weather object
class Weather {
  city: string;
  date: string;
  tempF: number;
  windSpeed: number;
  humidity: number;
  icon: string;
  iconDescription: string;
  
  constructor(city: string, date: string, tempF: number, windSpeed: number, humidity: number, icon: string, iconDescription: string) {
    this.city = city;
    this.date = date;
    this.tempF = tempF;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
    this.icon = icon;
    this.iconDescription = iconDescription;
  }
}

// Complete the WeatherService class
class WeatherService {
  private baseURL?: string;
  private apiKey?: string;
  private city = '';

  constructor() {
    this.baseURL = process.env.API_BASE_URL || '';
    this.apiKey = process.env.API_KEY || '';
  }

  private async fetchLocationData(query: string) {
    try {
      if (!this.baseURL || !this.apiKey) {
        throw new Error('API base URL or API key not found');
      }

      const response: Coordinates[] = await fetch(query).then((res) =>
        res.json()
      );
      
      if (!response || response.length === 0) {
        throw new Error('City not found');
      }
      
      return response[0];
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  private buildGeocodeQuery(): string {
    const geocodeQuery = `${this.baseURL}/geo/1.0/direct?q=${this.city}&limit=1&appid=${this.apiKey}`;
    return geocodeQuery;
  }

  // Build weather query using the 5-day forecast API as specified in README
  private buildWeatherQuery(coordinates: Coordinates): string {
    const weatherQuery = `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&units=imperial&appid=${this.apiKey}`;
    return weatherQuery;
  }

  private async fetchAndDestructureLocationData() {
    return await this.fetchLocationData(this.buildGeocodeQuery());
  }

  private async fetchWeatherData(coordinates: Coordinates) {
    try {
      const response = await fetch(this.buildWeatherQuery(coordinates)).then(
        (res) => res.json()
      );
      
      if (!response || !response.list || response.list.length === 0) {
        throw new Error('Weather data not found');
      }

      const currentWeather: Weather = this.parseCurrentWeather(
        response.list[0]
      );

      const forecast: Weather[] = this.buildForecastArray(
        currentWeather,
        response.list
      );
      
      return forecast;
    } catch (error: any) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  }

  private parseCurrentWeather(response: any) {
    const parsedDate = dayjs.unix(response.dt).format('M/D/YYYY');

    const currentWeather = new Weather(
      this.city,
      parsedDate,
      response.main.temp,
      response.wind.speed,
      response.main.humidity,
      response.weather[0].icon,
      response.weather[0].description || response.weather[0].main
    );

    return currentWeather;
  }

  // Build 5-day forecast array as required in README
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    const weatherForecast: Weather[] = [currentWeather];

    // Filter to get one forecast per day (noon readings)
    const filteredWeatherData = weatherData.filter((data: any) => {
      return data.dt_txt.includes('12:00:00');
    });

    // Only take the next 5 days for the forecast
    const fiveDayForecast = filteredWeatherData.slice(0, 5);

    for (const day of fiveDayForecast) {
      weatherForecast.push(
        new Weather(
          this.city,
          dayjs.unix(day.dt).format('M/D/YYYY'),
          day.main.temp,
          day.wind.speed,
          day.main.humidity,
          day.weather[0].icon,
          day.weather[0].description || day.weather[0].main
        )
      );
    }

    return weatherForecast;
  }

  async getWeatherForCity(city: string) {
    try {
      this.city = city;
      const coordinates = await this.fetchAndDestructureLocationData();
      const weather = await this.fetchWeatherData(coordinates);
      return weather;
    } catch (error) {
      console.error('Error in getWeatherForCity:', error);
      throw error;
    }
  }
}

export default new WeatherService();