import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaborClassTasksComponent } from './labor-class-tasks.component';

describe('LaborClassTasksComponent', () => {
  let component: LaborClassTasksComponent;
  let fixture: ComponentFixture<LaborClassTasksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaborClassTasksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaborClassTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
