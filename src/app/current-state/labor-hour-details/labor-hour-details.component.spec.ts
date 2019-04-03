import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaborHourDetailsComponent } from './labor-hour-details.component';

describe('LaborHourDetailsComponent', () => {
  let component: LaborHourDetailsComponent;
  let fixture: ComponentFixture<LaborHourDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaborHourDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaborHourDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
