import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyConnectDialogComponent } from './company-connect-dialog.component';

describe('CompanyConnectDialogComponent', () => {
  let component: CompanyConnectDialogComponent;
  let fixture: ComponentFixture<CompanyConnectDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyConnectDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompanyConnectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
