import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoStepVertificationComponent } from './two-step-vertification.component';

describe('TwoStepVertificationComponent', () => {
  let component: TwoStepVertificationComponent;
  let fixture: ComponentFixture<TwoStepVertificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TwoStepVertificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TwoStepVertificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
