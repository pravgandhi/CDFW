import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaborClassInputsComponent } from './labor-class-inputs.component';

describe('LaborClassInputsComponent', () => {
  let component: LaborClassInputsComponent;
  let fixture: ComponentFixture<LaborClassInputsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaborClassInputsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaborClassInputsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
