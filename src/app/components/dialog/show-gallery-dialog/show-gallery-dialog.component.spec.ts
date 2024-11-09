import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowGalleryDialogComponent } from './show-gallery-dialog.component';

describe('ShowGalleryDialogComponent', () => {
  let component: ShowGalleryDialogComponent;
  let fixture: ComponentFixture<ShowGalleryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowGalleryDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowGalleryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
