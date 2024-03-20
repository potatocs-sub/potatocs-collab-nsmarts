import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyMngmtComponent } from './company-mngmt.component';

describe('CompanyMngmtComponent', () => {
  let component: CompanyMngmtComponent;
  let fixture: ComponentFixture<CompanyMngmtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyMngmtComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompanyMngmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
