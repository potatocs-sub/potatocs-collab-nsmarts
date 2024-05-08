import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidaysAddDialogComponent } from './holidays-add-dialog.component';

describe('HolidaysAddDialogComponent', () => {
  let component: HolidaysAddDialogComponent;
  let fixture: ComponentFixture<HolidaysAddDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HolidaysAddDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HolidaysAddDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
