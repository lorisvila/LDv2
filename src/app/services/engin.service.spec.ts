import { TestBed } from '@angular/core/testing';

import { EnginService } from './engin.service';

describe('EnginService', () => {
  let service: EnginService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
