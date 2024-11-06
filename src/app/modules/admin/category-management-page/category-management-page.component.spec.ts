import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryManagementPageComponent } from './category-management-page.component';

describe('CategoryManagementPageComponent', () => {
  let component: CategoryManagementPageComponent;
  let fixture: ComponentFixture<CategoryManagementPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryManagementPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryManagementPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
