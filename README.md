# Weather App

A React single-page application that displays weather conditions based on the user's current GPS location.

## Features

- 🔍 Automatic GPS location detection on app launch
- 🌤️ Real-time weather data from OpenWeatherMap API
- ⏳ Loading indicators while fetching data
- ❌ Comprehensive error handling for location and network issues
- 🔄 Refresh button to update location and weather data
- 📱 Responsive design for mobile, tablet, and desktop
- 🧪 Unit tests with Jest

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd weather-app
```

2. Install dependencies:
```bash
npm install 
or
yarn
```

3. Start the development server:
```bash
npm start
```

The app will open in your browser at `http://localhost:3000`.

### Building for Production

To create a production build:

```bash
npm run build
```

The build artifacts will be stored in the `build/` directory.

## Testing

Run the test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Generate coverage report:

```bash
npm run test:coverage
```

## Usage

1. When the app loads, it will automatically request permission to access your GPS location
2. Once permission is granted, the app will fetch weather data for your current location
3. The weather information includes:
   - Current temperature
   - Feels like temperature
   - Weather conditions and description
   - Humidity
   - Atmospheric pressure
   - Wind speed and direction
   - Visibility
4. Click the "Refresh" button to update your location and fetch fresh weather data

## Error Handling

The app handles various error scenarios:
- Location access denied by user
- Location information unavailable
- Network errors
- API errors

All errors are displayed with user-friendly messages and a "Try Again" button.

## API

This app uses the OpenWeatherMap API:
- API Key: 53f9d8e4213222cf517d86dc406d67fc
- API Documentation: http://openweathermap.org/

## Technologies Used

- React 18
- JavaScript (ES6+)
- Jest & React Testing Library
- CSS3 (Responsive Design)

## Browser Support

The app requires:
- Modern browser with Geolocation API support
- JavaScript enabled

## License

This project is for demonstration purposes.

