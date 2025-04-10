import express from 'express';
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// Create router (use express.Router directly)
const router = express.Router();

// /api/weather - Get weather data for a city and add to history
router.post('/', (req, res) => {
  try {
    const { cityName } = req.body;

    if (!cityName) {
      res.status(400).json({ error: 'City name is required' });
      return;
    }

    WeatherService.getWeatherForCity(cityName)
      .then((data) => {
        HistoryService.addCity(cityName)
          .then(() => {
            res.json(data);
          });
      })
      .catch((err) => {
        console.error('Weather service error:', err);
        res.status(500).json({ error: 'Error fetching weather data' });
      });
  } catch (err) {
    console.error('Route handler error:', err);
    res.status(500).json({ error: 'Server error processing request' });
  }
});

// /api/weather/history - Get search history
router.get('/history', (_req, res) => {
  HistoryService.getCities()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.error('History service error:', err);
      res.status(500).json({ error: 'Error retrieving search history' });
    });
});

// /api/weather/history/:id - Delete city from search history
router.delete('/history/:id', (req, res) => {
  const cityId = req.params.id;

  if (!cityId) {
    res.status(400).json({ error: 'City ID is required' });
    return;
  }

  HistoryService.removeCity(cityId)
    .then(() => {
      res.json({ success: true, message: "City removed from history" });
    })
    .catch((err) => {
      console.error('Delete city error:', err);
      res.status(500).json({ error: 'Failed to remove city' });
    });
});

export default router;