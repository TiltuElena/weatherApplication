import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  weatherTemp: string = '';
  weatherTempFeel: string = '';
  weatherIcon: string = '';
  weatherDescription: string = '';
  weatherCity: string = '';
  subscription1: any;
  subscription2: any;
  weatherInfo: WeatherDetailsInterface[] | undefined;
  loaded: boolean = false;
  scale: number = 273.15;
  forecastIcon: string[] = [];
  forecastTemp: number[] = [];
  forecastTempDetails: string[] = []
  data: string[] = [];
  forecastData: ForecastDetailsInterface[] = [];


  constructor(public httpClient: HttpClient) {}

  ngOnDestroy(): void {
    this.subscription1.unsubscribe;
    this.subscription2.unsubscribe;
  }

  loadData() {
    this.forecastData = []
    this.subscription1 = this.httpClient
      .get(`${API_URL}weather?q=${this.weatherCity}&appid=${API_KEY}`)
      .subscribe((res: any) => {
        this.loaded = true;
        this.weatherData = res;
        this.weatherTemp = (res.main.temp - this.scale).toFixed(0);
        this.weatherTempFeel = (res.main.feels_like - this.scale).toFixed(0);
        this.weatherIcon = `http://openweathermap.org/img/wn/${res.weather[0].icon}@4x.png`;
        this.weatherDescription = `${res.weather[0].description
          .slice(0, 1)
          .toUpperCase()}${res.weather[0].description.slice(1)}`;

        this.weatherInfo = [
          {
            detail: 'Humidity',
            img: 'assets/icons8-humidity-64.png',
            data: `${res.main.humidity}%`,
          },
          {
            detail: 'Wind Speed',
            img: 'assets/icons8-wind-47.png',
            data: `${res.wind.speed}m/s`,
          },
          {
            detail: 'Visibility',
            img: 'assets/icons8-cloud-80.png',
            data: `${(res.visibility / 100).toFixed(0)}%`,
          },
          {
            detail: 'Pressure',
            img: 'assets/icons8-pressure-48.png',
            data: `${res.main.pressure}hPa`,
          },
          {
            detail: 'Max Temperature',
            img: 'assets/icons8-high-temperature-64.png',
            data: `${(res.main.temp_max - this.scale).toFixed(0)}`,
          },
          {
            detail: 'Min Temperature',
            img: 'assets/icons8-low-temperature-64.png',
            data: `${(res.main.temp_min - this.scale).toFixed(0)}`,
          },
        ];
      });

    this.subscription2 = this.httpClient
      .get(`${API_URL}forecast?q=${this.weatherCity}&appid=${API_KEY}`)
      .subscribe((res: any) => {

        for (const elem of res.list) {
          this.data.push(elem.dt_txt.substring(0, elem.dt_txt.indexOf(' ')));
        }

        this.data = [...new Set(this.data)].slice(1);

        for (const data of this.data) {

          for (const elem of res.list) {
            if (elem.dt_txt.substring(0, elem.dt_txt.indexOf(' ')) === data) {
              this.forecastTemp.push(
                Number((Number(elem.main.temp) - this.scale).toFixed(0))
              );
              this.forecastIcon.push(elem.weather[0].icon);
              this.forecastTempDetails.push(`${elem.weather[0].description
                .slice(0, 1)
                .toUpperCase()}${elem.weather[0].description.slice(1)}`)
            }
          }

          this.forecastData.push({
            data: data,
            max: Math.max(...this.forecastTemp),
            min: Math.min(...this.forecastTemp),
            icon: `http://openweathermap.org/img/wn/${this.forecastIcon[0]}@2x.png`,
            details: this.forecastTempDetails[0]
          });

          this.forecastTemp = [];
          this.forecastIcon = [];
          this.forecastTempDetails = [];
        }

        console.log(this.forecastData);
      });
  }

}
