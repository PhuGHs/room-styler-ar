import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExampleArComponent } from './example-ar.component';

describe('ExampleArComponent', () => {
  let component: ExampleArComponent;
  let fixture: ComponentFixture<ExampleArComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExampleArComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExampleArComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
