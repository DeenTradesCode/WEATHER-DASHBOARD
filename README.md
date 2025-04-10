Weather Dashboard
A modern weather application that provides current conditions and 5-day forecasts using the OpenWeather API.

<img alt="Weather Dashboard" src="https://via.placeholder.com/800x400?text=Weather+Dashboard+Screenshot">

Table of Contents
Features
Technologies Used
Installation
Usage
API Key Setup
Deployment
Contact
Features
Search for weather by city name
View current weather conditions including:
Temperature
Wind speed
Humidity
Weather icon and description
5-day weather forecast
Search history management
Responsive design for all devices
Technologies Used
Frontend: HTML, CSS, JavaScript, Vite
Backend: Node.js, Express
APIs: OpenWeather API
Other: TypeScript, UUID, dotenv
Installation
Clone the Repository

# Clone the repository
git clone https://github.com/DeenTradesCode/weather-dashboard.git

# Navigate to the project directory
cd weather-dashboard/Develop

# Install dependencies for server and client
npm install

API Key Setup
Sign up for a free API key at OpenWeatherMap
Create a .env file in the server directory:

cd server
touch .env

Add your API key to the .env file:


Usage
Development Mode
Run the application in development mode with hot-reloading

npm run start:dev
This will start both the client and server with automatic reloading on code changes.

Production Mode
Build and run the application in production mode:
npm start


The application will be available at http://localhost:3001

Deployment
The application can be deployed to Render by connecting your GitHub repository.

Use these settings:

Build command: npm run render-build
Start command: npm start
Root Directory: Develop
Add environment variables for your API credentials

Contact
If you have any questions or would like to contribute, please feel free to reach out:

GitHub: DeenTradesCode
Email: saifshihadeh1229@gmail.com