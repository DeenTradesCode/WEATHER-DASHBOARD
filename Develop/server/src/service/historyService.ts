import fs from 'node:fs/promises';
import path from 'node:path';
import { v4 as uuidv4 } from 'uuid';

/**
 * City class representing a searched city
 * with name and unique identifier
 */
class City {
  name: string;
  id: string;

  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }
}

/**
 * Service for managing search history
 */
class HistoryService {
  private filePath: string;

  constructor() {
    // Use path.join to ensure cross-platform compatibility
    this.filePath = path.join(process.cwd(), 'searchHistory.json');
  }
  
  /**
   * Read search history from file
   */
  private async read() {
    try {
      return await fs.readFile(this.filePath, {
        flag: 'a+',
        encoding: 'utf8',
      });
    } catch (error) {
      console.error('Error reading search history:', error);
      return '[]'; // Return empty array as string if file doesn't exist
    }
  }

  /**
   * Write cities to search history file
   */
  private async write(cities: City[]) {
    try {
      return await fs.writeFile(
        this.filePath, 
        JSON.stringify(cities, null, 2)
      );
    } catch (error) {
      console.error('Error writing search history:', error);
      throw error;
    }
  }

  /**
   * Get all cities from search history
   */
  async getCities() {
    return await this.read().then((cities) => {
      let parsedCities: City[];

      try {
        parsedCities = [].concat(JSON.parse(cities));
      } catch (err) {
        parsedCities = [];
      }

      return parsedCities;
    });
  }
  
  /**
   * Add a city to search history
   */
  async addCity(cityName: string) {
    if (!cityName) {
      throw new Error("City name cannot be empty");
    }

    const newCity: City = {
      name: cityName, 
      id: uuidv4()
    };

    return await this.getCities()
      .then((cities) => {
        // Don't add duplicate cities
        if (cities.find((city) => city.name.toLowerCase() === cityName.toLowerCase())) {
          return cities;
        }
        return [...cities, newCity];
      })
      .then((updatedCities) => this.write(updatedCities))
      .then(() => newCity);
  }

  /**
   * Remove a city from search history
   */
  async removeCity(id: string) {
    if (!id) {
      throw new Error("City ID cannot be empty");
    }

    return await this.getCities()
      .then((cities) => cities.filter((city) => city.id !== id))
      .then((filteredCities) => this.write(filteredCities));
  }
}

export default new HistoryService();