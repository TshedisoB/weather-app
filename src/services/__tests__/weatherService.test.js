import { fetchWeatherData, getCurrentLocation } from '../weatherService';

global.fetch = jest.fn();

describe('weatherService', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  describe('fetchWeatherData', () => {
    it('should fetch weather data successfully', async () => {
      const mockWeatherData = {
        coord: { lon: 139, lat: 35 },
        weather: [{ id: 804, main: 'clouds', description: 'overcast clouds', icon: '04n' }],
        main: { temp: 289.5, humidity: 89, pressure: 1013 },
        wind: { speed: 7.31, deg: 187.002 },
        name: 'Shuzenji',
        cod: 200,
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockWeatherData,
      });

      const result = await fetchWeatherData(35, 139);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('api.openweathermap.org/data/2.5/weather')
      );
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('lat=35')
      );
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('lon=139')
      );
      expect(result).toEqual(mockWeatherData);
    });

    it('should handle API errors', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ message: 'city not found' }),
      });

      await expect(fetchWeatherData(35, 139)).rejects.toThrow('city not found');
    });

    it('should handle network errors', async () => {
      fetch.mockRejectedValueOnce(new TypeError('Failed to fetch'));

      await expect(fetchWeatherData(35, 139)).rejects.toThrow(
        'Network error: Unable to connect to the weather service'
      );
    });
  });

  describe('getCurrentLocation', () => {
    beforeEach(() => {
      delete navigator.geolocation;
    });

    it('should get current location successfully', async () => {
      const mockPosition = {
        coords: {
          latitude: 35.123,
          longitude: 139.456,
        },
      };

      navigator.geolocation = {
        getCurrentPosition: jest.fn((success) => {
          success(mockPosition);
        }),
      };

      const location = await getCurrentLocation();

      expect(navigator.geolocation.getCurrentPosition).toHaveBeenCalled();
      expect(location).toEqual({
        lat: 35.123,
        lon: 139.456,
      });
    });

    it('should handle permission denied error', async () => {
      const mockError = {
        code: 1,
        PERMISSION_DENIED: 1,
        message: 'User denied the request for Geolocation',
      };

      navigator.geolocation = {
        getCurrentPosition: jest.fn((success, error) => {
          error(mockError);
        }),
      };

      await expect(getCurrentLocation()).rejects.toThrow(
        'Location access denied by user'
      );
    });

    it('should handle position unavailable error', async () => {
      const mockError = {
        code: 2,
        POSITION_UNAVAILABLE: 2,
        message: 'Position unavailable',
      };

      navigator.geolocation = {
        getCurrentPosition: jest.fn((success, error) => {
          error(mockError);
        }),
      };

      await expect(getCurrentLocation()).rejects.toThrow(
        'Location information unavailable'
      );
    });

    it('should handle timeout error', async () => {
      const mockError = {
        code: 3,
        TIMEOUT: 3,
        message: 'Timeout',
      };

      navigator.geolocation = {
        getCurrentPosition: jest.fn((success, error) => {
          error(mockError);
        }),
      };

      await expect(getCurrentLocation()).rejects.toThrow(
        'Location request timeout'
      );
    });

    it('should handle geolocation not supported', async () => {
      delete navigator.geolocation;

      await expect(getCurrentLocation()).rejects.toThrow(
        'Geolocation is not supported by your browser'
      );
    });

    it('should handle unknown error', async () => {
      const mockError = {
        code: 999,
        message: 'Unknown error',
      };

      navigator.geolocation = {
        getCurrentPosition: jest.fn((success, error) => {
          error(mockError);
        }),
      };

      await expect(getCurrentLocation()).rejects.toThrow(
        'An unknown error occurred'
      );
    });
  });
});

