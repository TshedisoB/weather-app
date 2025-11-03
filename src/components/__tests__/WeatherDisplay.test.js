import React from 'react';
import { render, screen } from '@testing-library/react';
import WeatherDisplay from '../WeatherDisplay';

describe('WeatherDisplay', () => {
  const mockWeatherData = {
    coord: { lon: 139, lat: 35 },
    sys: {
      country: 'JP',
      sunrise: 1369769524,
      sunset: 1369821049,
    },
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
      temp_min: 14.0,
      temp_max: 18.5,
      sea_level: 1015,
      grnd_level: 1010,
    },
    wind: {
      speed: 7.31,
      deg: 187.002,
    },
    visibility: 10000,
    clouds: { all: 92 },
    timezone: 32400,
    dt: 1369824698,
    id: 1851632,
    name: 'Shuzenji',
    cod: 200,
  };

  it('should render weather information correctly', () => {
    render(<WeatherDisplay data={mockWeatherData} />);

    expect(screen.getByText('Shuzenji')).toBeInTheDocument();
    expect(screen.getByText('JP')).toBeInTheDocument();
    expect(screen.getByText(/Lat: 35\.0000°/i)).toBeInTheDocument();
    expect(screen.getByText(/Lon: 139\.0000°/i)).toBeInTheDocument();
    expect(screen.getByText('17°C')).toBeInTheDocument();
    expect(screen.getByText(/clouds/i)).toBeInTheDocument();
    expect(screen.getByText(/overcast clouds/i)).toBeInTheDocument();
    expect(screen.getByText('15°C')).toBeInTheDocument();
    expect(screen.getByText('89%')).toBeInTheDocument();
    expect(screen.getByText('1013 hPa')).toBeInTheDocument();
    expect(screen.getByText('7.31 m/s')).toBeInTheDocument();
    expect(screen.getByText('10.0 km')).toBeInTheDocument();
    expect(screen.getByText('92%')).toBeInTheDocument();
  });

  it('should render without country if not available', () => {
    const dataWithoutCountry = { ...mockWeatherData };
    delete dataWithoutCountry.sys;

    render(<WeatherDisplay data={dataWithoutCountry} />);

    expect(screen.getByText('Shuzenji')).toBeInTheDocument();
    expect(screen.queryByText('JP')).not.toBeInTheDocument();
  });

  it('should render without visibility if not available', () => {
    const dataWithoutVisibility = { ...mockWeatherData };
    delete dataWithoutVisibility.visibility;

    render(<WeatherDisplay data={dataWithoutVisibility} />);

    expect(screen.queryByText(/visibility/i)).not.toBeInTheDocument();
  });

  it('should render without wind direction if not available', () => {
    const dataWithoutWindDeg = { ...mockWeatherData };
    delete dataWithoutWindDeg.wind.deg;

    render(<WeatherDisplay data={dataWithoutWindDeg} />);

    expect(screen.queryByText(/wind direction/i)).not.toBeInTheDocument();
  });

  it('should display weather icon with correct URL', () => {
    render(<WeatherDisplay data={mockWeatherData} />);

    const icon = screen.getByAltText('overcast clouds');
    expect(icon).toHaveAttribute(
      'src',
      'https://openweathermap.org/img/wn/04n@2x.png'
    );
  });

  it('should handle different temperature values correctly', () => {
    const coldWeather = {
      ...mockWeatherData,
      main: { ...mockWeatherData.main, temp: -5.3, feels_like: -8.1 },
    };

    render(<WeatherDisplay data={coldWeather} />);

    expect(screen.getByText('-5°C')).toBeInTheDocument();
    expect(screen.getByText('-8°C')).toBeInTheDocument();
  });

  it('should render wind direction correctly', () => {
    render(<WeatherDisplay data={mockWeatherData} />);

    // Wind direction 187 degrees should be South
    expect(screen.getByText(/SW/i)).toBeInTheDocument();
    expect(screen.getByText(/187/i)).toBeInTheDocument();
  });

  it('should not render anything if data is null', () => {
    const { container } = render(<WeatherDisplay data={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('should display coordinates correctly', () => {
    render(<WeatherDisplay data={mockWeatherData} />);

    expect(screen.getByText(/Lat: 35\.0000°/i)).toBeInTheDocument();
    expect(screen.getByText(/Lon: 139\.0000°/i)).toBeInTheDocument();
  });

  it('should display sunrise and sunset times', () => {
    render(<WeatherDisplay data={mockWeatherData} />);

    expect(screen.getByText(/sunrise/i)).toBeInTheDocument();
    expect(screen.getByText(/sunset/i)).toBeInTheDocument();
  });

  it('should display temp range when available', () => {
    render(<WeatherDisplay data={mockWeatherData} />);

    expect(screen.getByText(/temp range/i)).toBeInTheDocument();
    expect(screen.getByText(/14°C - 19°C/i)).toBeInTheDocument();
  });

  it('should display clouds percentage', () => {
    render(<WeatherDisplay data={mockWeatherData} />);

    expect(screen.getByText(/clouds/i)).toBeInTheDocument();
    expect(screen.getByText('92%')).toBeInTheDocument();
  });

  it('should display timezone', () => {
    render(<WeatherDisplay data={mockWeatherData} />);

    expect(screen.getByText(/timezone/i)).toBeInTheDocument();
    expect(screen.getByText(/UTC\+9/i)).toBeInTheDocument();
  });

  it('should display sea level and ground level when available', () => {
    render(<WeatherDisplay data={mockWeatherData} />);

    expect(screen.getByText(/sea level/i)).toBeInTheDocument();
    expect(screen.getByText('1015 hPa')).toBeInTheDocument();
    expect(screen.getByText(/ground level/i)).toBeInTheDocument();
    expect(screen.getByText('1010 hPa')).toBeInTheDocument();
  });

  it('should not display coordinates if coord is missing', () => {
    const dataWithoutCoord = { ...mockWeatherData };
    delete dataWithoutCoord.coord;

    render(<WeatherDisplay data={dataWithoutCoord} />);

    expect(screen.queryByText(/Lat:/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Lon:/i)).not.toBeInTheDocument();
  });

  it('should not display sunrise/sunset if not available', () => {
    const dataWithoutSunTimes = {
      ...mockWeatherData,
      sys: { country: 'JP' },
    };

    render(<WeatherDisplay data={dataWithoutSunTimes} />);

    expect(screen.queryByText(/sunrise/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/sunset/i)).not.toBeInTheDocument();
  });
});

