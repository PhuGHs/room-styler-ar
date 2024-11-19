import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailsArComponent } from './product-details-ar.component';

describe('ProductDetailsArComponent', () => {
  let component: ProductDetailsArComponent;
  let fixture: ComponentFixture<ProductDetailsArComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetailsArComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductDetailsArComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
