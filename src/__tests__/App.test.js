import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import * as weatherService from '../services/weatherService';

// Mock the weather service
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

    // Should show loader initially
    expect(screen.getByText('Loading weather data...')).toBeInTheDocument();

    // Wait for weather data to load
    await waitFor(() => {
      expect(screen.getByText('Shuzenji')).toBeInTheDocument();
    });

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

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  it('should display error message when weather fetch fails', async () => {
    const errorMessage = 'Network error: Unable to connect';
    weatherService.getCurrentLocation.mockResolvedValueOnce(mockLocation);
    weatherService.fetchWeatherData.mockRejectedValueOnce(
      new Error(errorMessage)
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  it('should refresh weather data when refresh button is clicked', async () => {
    weatherService.getCurrentLocation
      .mockResolvedValueOnce(mockLocation)
      .mockResolvedValueOnce(mockLocation);
    weatherService.fetchWeatherData
      .mockResolvedValueOnce(mockWeatherData)
      .mockResolvedValueOnce(mockWeatherData);

    render(<App />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Shuzenji')).toBeInTheDocument();
    });

    // Click refresh button
    const refreshButton = screen.getByText('Refresh');
    await userEvent.click(refreshButton);

    // Should show loader again
    expect(screen.getByText('Loading weather data...')).toBeInTheDocument();

    // Wait for refreshed data
    await waitFor(() => {
      expect(screen.getByText('Shuzenji')).toBeInTheDocument();
    });

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

    // Wait for error
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    // Click try again
    const tryAgainButton = screen.getByText('Try Again');
    await userEvent.click(tryAgainButton);

    // Should attempt to load again
    await waitFor(() => {
      expect(screen.getByText('Shuzenji')).toBeInTheDocument();
    });

    expect(weatherService.getCurrentLocation).toHaveBeenCalledTimes(2);
  });

  it('should display app title', () => {
    weatherService.getCurrentLocation.mockResolvedValueOnce(mockLocation);
    weatherService.fetchWeatherData.mockResolvedValueOnce(mockWeatherData);

    render(<App />);

    expect(screen.getByText('Weather App')).toBeInTheDocument();
  });
});

