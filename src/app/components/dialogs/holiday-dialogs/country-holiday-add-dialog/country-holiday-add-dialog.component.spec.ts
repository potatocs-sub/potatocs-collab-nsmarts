import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryHolidayAddComponent } from './country-holiday-add-dialog.component';

describe('CountryHolidayAddComponent', () => {
  let component: CountryHolidayAddComponent;
  let fixture: ComponentFixture<CountryHolidayAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CountryHolidayAddComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CountryHolidayAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
