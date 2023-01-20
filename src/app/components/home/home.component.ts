import { Component, OnInit } from '@angular/core';
import { timer } from 'rxjs';
import { WeatherService } from '../../services/weather.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  currentHour: number = new Date().getHours();

  constructor(public weatherService: WeatherService) {}

  ngOnInit(): void {
    timer(0, 1000).subscribe(() => {
      this.currentHour = new Date().getHours();
    });
  }
}
