import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import {
  ForecastDetailsInterface,
  WeatherDetailsInterface,
} from '../ts/interfaces';

const API_URL = environment.API_URL;
const API_KEY = environment.API_KEY;

@Injectable({
  providedIn: 'root',
})
export class WeatherService implements OnDestroy {
  weatherData: any;
  weatherTemperature: string = '';
  weatherTempFeel: string = '';
  weatherCity: string = '';
  subscription1: any;
  subscription2: any;
  weatherInfo: WeatherDetailsInterface[] | undefined;
  loaded: boolean = false;
  scale: number = 273.15;
  disableC: boolean = true;
  disableK: boolean = false;
  forecastIcon: string[] = [];
  forecastTemperature: number[] = [];
  forecastTempDetails: string[] = [];
  date: string[] = [];
  forecastData: ForecastDetailsInterface[] = [];
  weekday: string[] = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  constructor(public httpClient: HttpClient) {}

  ngOnDestroy(): void {
    this.subscription1.unsubscribe;
    this.subscription2.unsubscribe;
  }

  loadData() {
    this.forecastData = [];

    this.subscription1 = this.httpClient
      .get(`${API_URL}weather?`, {
        params: { q: this.weatherCity, appid: API_KEY },
      })
      .subscribe((response: any) => {
        this.loaded = true;
        this.weatherData = response;
        this.weatherTemperature = (response.main.temp - this.scale).toFixed(0);
        this.weatherTempFeel = (response.main.feels_like - this.scale).toFixed(
          0
        );

        this.weatherInfo = [
          {
            detail: 'Humidity',
            img: 'assets/icons8-humidity-64.png',
            data: `${response.main.humidity}%`,
          },
          {
            detail: 'Wind Speed',
            img: 'assets/icons8-wind-47.png',
            data: `${response.wind.speed}m/s`,
          },
          {
            detail: 'Visibility',
            img: 'assets/icons8-cloud-80.png',
            data: `${(response.visibility / 100).toFixed(0)}%`,
          },
          {
            detail: 'Pressure',
            img: 'assets/icons8-pressure-48.png',
            data: `${response.main.pressure}hPa`,
          },
          {
            detail: 'Max Temperature',
            img: 'assets/icons8-high-temperature-64.png',
            data: `${(response.main.temp_max - this.scale).toFixed(0)}`,
            dataChange: response.main.temp_max.toFixed(0),
          },
          {
            detail: 'Min Temperature',
            img: 'assets/icons8-low-temperature-64.png',
            data: `${(response.main.temp_min - this.scale).toFixed(0)}`,
            dataChange: response.main.temp_min.toFixed(0),
          },
        ];
      });

    this.subscription2 = this.httpClient
      .get(`${API_URL}forecast?`, {
        params: { q: this.weatherCity, appid: API_KEY },
      })
      .subscribe((response: any) => {
        for (const elem of response.list) {
          this.date.push(elem.dt_txt.substring(0, elem.dt_txt.indexOf(' ')));
        }

        this.date = [...new Set(this.date)].slice(1);

        for (const data of this.date) {
          for (const elem of response.list) {
            if (elem.dt_txt.substring(0, elem.dt_txt.indexOf(' ')) === data) {
              this.forecastTemperature.push(
                Number((Number(elem.main.temp) - this.scale).toFixed(0))
              );
              this.forecastIcon.push(elem.weather[0].icon);
              this.forecastTempDetails.push(
                `${elem.weather[0].description
                  .slice(0, 1)
                  .toUpperCase()}${elem.weather[0].description.slice(1)}`
              );
            }
          }

          this.forecastData.push({
            date: new Date(data),
            weekDay: this.weekday[new Date(data).getDay()],
            max: Math.max(...this.forecastTemperature),
            min: Math.min(...this.forecastTemperature),
            maxChange: (
              Math.max(...this.forecastTemperature) + 273.15
            ).toFixed(),
            minChange: (
              Math.min(...this.forecastTemperature) + 273.15
            ).toFixed(),
            icon: `http://openweathermap.org/img/wn/${this.forecastIcon[0]}@2x.png`,
            details: this.forecastTempDetails[0],
          });

          this.forecastTemperature = [];
          this.forecastIcon = [];
          this.forecastTempDetails = [];
          this.date = [];
        }
      });
  }

  updateK() {
    this.scale = 0;
    this.weatherTemperature = (
      Number(this.weatherTemperature) + 273.15
    ).toFixed(0);
    this.weatherTempFeel = (Number(this.weatherTempFeel) + 273.15).toFixed(0);
    this.disableK = true;
    this.disableC = false;
  }

  updateC() {
    this.scale = 273.15;
    this.weatherTemperature = (
      Number(this.weatherTemperature) - 273.15
    ).toFixed(0);
    this.weatherTempFeel = (Number(this.weatherTempFeel) - 273.15).toFixed(0);
    this.disableK = false;
    this.disableC = true;
  }
}
