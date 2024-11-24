import { TestBed } from '@angular/core/testing';

import { ARServiceService } from './arservice.service';

describe('ARServiceService', () => {
  let service: ARServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ARServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
