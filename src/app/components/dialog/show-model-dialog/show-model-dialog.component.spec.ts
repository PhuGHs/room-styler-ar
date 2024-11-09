import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowModelDialogComponent } from './show-model-dialog.component';

describe('ShowModelDialogComponent', () => {
  let component: ShowModelDialogComponent;
  let fixture: ComponentFixture<ShowModelDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowModelDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowModelDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
