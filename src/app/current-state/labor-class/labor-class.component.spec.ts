import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaborClassComponent } from './labor-class.component';

describe('LaborClassComponent', () => {
  let component: LaborClassComponent;
  let fixture: ComponentFixture<LaborClassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaborClassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaborClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
