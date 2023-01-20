import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../../services/weather.service';
import { timer } from 'rxjs';

@Component({
  selector: 'app-current-weather',
  templateUrl: './current-weather.component.html',
  styleUrls: ['./current-weather.component.scss'],
})
export class CurrentWeatherComponent implements OnInit {
  currentDate: Date = new Date();
  constructor(public weatherService: WeatherService) {}

  ngOnInit(): void {
    timer(0, 1000).subscribe(() => {
      this.currentDate = new Date();
    });
  }
}
