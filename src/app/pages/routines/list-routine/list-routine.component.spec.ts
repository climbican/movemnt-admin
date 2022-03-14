import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRoutineComponent } from './list-routine.component';

describe('ListRoutineComponent', () => {
  let component: ListRoutineComponent;
  let fixture: ComponentFixture<ListRoutineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListRoutineComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListRoutineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
