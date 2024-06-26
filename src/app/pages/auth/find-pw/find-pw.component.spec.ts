import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindPwComponent } from './find-pw.component';

describe('FindPwComponent', () => {
  let component: FindPwComponent;
  let fixture: ComponentFixture<FindPwComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindPwComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FindPwComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
