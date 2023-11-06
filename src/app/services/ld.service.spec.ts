import { TestBed } from '@angular/core/testing';

import { LdService } from './ld.service';

describe('LdService', () => {
  let service: LdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
