import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidayMngmtComponent } from './holiday-mngmt.component';

describe('HolidayMngmtComponent', () => {
  let component: HolidayMngmtComponent;
  let fixture: ComponentFixture<HolidayMngmtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HolidayMngmtComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HolidayMngmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
