import {Component, Input, OnInit} from '@angular/core';
import {WeatherService} from "../../services/weather.service";

@Component({
  selector: 'app-weather-data-card',
  templateUrl: './weather-data-card.component.html',
  styleUrls: ['./weather-data-card.component.scss']
})
export class WeatherDataCardComponent implements OnInit {
  @Input() item: any;
  constructor(public weatherService: WeatherService) { }

  ngOnInit(): void {
  }

}
