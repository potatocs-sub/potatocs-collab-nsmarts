import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountriesAddDialogComponent } from './countries-add-dialog.component';

describe('CountriesAddDialogComponent', () => {
  let component: CountriesAddDialogComponent;
  let fixture: ComponentFixture<CountriesAddDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CountriesAddDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CountriesAddDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
