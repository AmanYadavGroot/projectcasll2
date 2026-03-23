import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TfaSetupComponentComponent } from './tfa-setup-component.component';

describe('TfaSetupComponentComponent', () => {
  let component: TfaSetupComponentComponent;
  let fixture: ComponentFixture<TfaSetupComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TfaSetupComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TfaSetupComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
