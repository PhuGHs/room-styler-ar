import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FurnitureVirtualRoomComponent } from './furniture-virtual-room.component';

describe('FurnitureVirtualRoomComponent', () => {
  let component: FurnitureVirtualRoomComponent;
  let fixture: ComponentFixture<FurnitureVirtualRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FurnitureVirtualRoomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FurnitureVirtualRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
