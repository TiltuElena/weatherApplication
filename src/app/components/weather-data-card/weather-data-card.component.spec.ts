import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeatherDataCardComponent } from './weather-data-card.component';

describe('WeatherDataCardComponent', () => {
  let component: WeatherDataCardComponent;
  let fixture: ComponentFixture<WeatherDataCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeatherDataCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeatherDataCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
