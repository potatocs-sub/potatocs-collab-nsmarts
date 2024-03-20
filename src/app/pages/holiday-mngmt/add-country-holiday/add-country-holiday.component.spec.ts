import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCountryHolidayComponent } from './add-country-holiday.component';

describe('AddCountryHolidayComponent', () => {
  let component: AddCountryHolidayComponent;
  let fixture: ComponentFixture<AddCountryHolidayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCountryHolidayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddCountryHolidayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
