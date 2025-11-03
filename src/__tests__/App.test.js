import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import * as weatherService from '../services/weatherService';

jest.mock('../services/weatherService');

describe('App', () => {
  const mockLocation = { lat: 35.123, lon: 139.456 };
  const mockWeatherData = {
    coord: { lon: 139, lat: 35 },
    sys: { country: 'JP' },
    weather: [
      {
        id: 804,
        main: 'clouds',
        description: 'overcast clouds',
        icon: '04n',
      },
    ],
    main: {
      temp: 16.5,
      feels_like: 15.2,
      humidity: 89,
      pressure: 1013,
    },
    wind: {
      speed: 7.31,
      deg: 187.002,
    },
    name: 'Shuzenji',
    cod: 200,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should request location and fetch weather on mount', async () => {
    weatherService.getCurrentLocation.mockResolvedValueOnce(mockLocation);
    weatherService.fetchWeatherData.mockResolvedValueOnce(mockWeatherData);

    render(<App />);

    expect(await screen.findByText('Shuzenji', {}, { timeout: 500 })).toBeInTheDocument();

    expect(weatherService.getCurrentLocation).toHaveBeenCalledTimes(1);
    expect(weatherService.fetchWeatherData).toHaveBeenCalledWith(
      mockLocation.lat,
      mockLocation.lon
    );
  });

  it('should display error message when location is denied', async () => {
    const errorMessage = 'Location access denied by user';
    weatherService.getCurrentLocation.mockRejectedValueOnce(
      new Error(errorMessage)
    );

    render(<App />);

    expect(await screen.findByText(errorMessage, {}, { timeout: 500 })).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  it('should display error message when weather fetch fails', async () => {
    const errorMessage = 'Network error: Unable to connect';
    weatherService.getCurrentLocation.mockResolvedValueOnce(mockLocation);
    weatherService.fetchWeatherData.mockRejectedValueOnce(
      new Error(errorMessage)
    );

    render(<App />);

    expect(await screen.findByText(errorMessage, {}, { timeout: 500 })).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  it('should refresh weather data when refresh button is clicked', async () => {
    const delayedLocation = () => 
      new Promise(resolve => setTimeout(() => resolve(mockLocation), 50));
    const delayedWeather = () => 
      new Promise(resolve => setTimeout(() => resolve(mockWeatherData), 50));

    weatherService.getCurrentLocation
      .mockResolvedValueOnce(mockLocation)
      .mockImplementationOnce(delayedLocation);
    weatherService.fetchWeatherData
      .mockResolvedValueOnce(mockWeatherData)
      .mockImplementationOnce(delayedWeather);

    render(<App />);

    expect(await screen.findByText('Shuzenji', {}, { timeout: 500 })).toBeInTheDocument();

    const refreshButton = screen.getByText('Refresh');
    await userEvent.click(refreshButton);

    expect(await screen.findByText('Loading weather data...', {}, { timeout: 200 })).toBeInTheDocument();
    expect(await screen.findByText('Shuzenji', {}, { timeout: 500 })).toBeInTheDocument();

    expect(weatherService.getCurrentLocation).toHaveBeenCalledTimes(2);
    expect(weatherService.fetchWeatherData).toHaveBeenCalledTimes(2);
  });

  it('should show try again button on error and retry on click', async () => {
    const errorMessage = 'Location access denied by user';
    weatherService.getCurrentLocation
      .mockRejectedValueOnce(new Error(errorMessage))
      .mockResolvedValueOnce(mockLocation);
    weatherService.fetchWeatherData.mockResolvedValueOnce(mockWeatherData);

    render(<App />);

    expect(await screen.findByText(errorMessage, {}, { timeout: 500 })).toBeInTheDocument();

    const tryAgainButton = screen.getByText('Try Again');
    await userEvent.click(tryAgainButton);

    expect(await screen.findByText('Shuzenji', {}, { timeout: 500 })).toBeInTheDocument();

    expect(weatherService.getCurrentLocation).toHaveBeenCalledTimes(2);
  });

  it('should display app title', async () => {
    weatherService.getCurrentLocation.mockResolvedValueOnce(mockLocation);
    weatherService.fetchWeatherData.mockResolvedValueOnce(mockWeatherData);

    render(<App />);

    expect(screen.getByText('Weather App')).toBeInTheDocument();
    expect(await screen.findByText('Shuzenji', {}, { timeout: 500 })).toBeInTheDocument();
  });
});
