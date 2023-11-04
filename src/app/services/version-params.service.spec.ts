import { TestBed } from '@angular/core/testing';

import { VersionParamsService } from './version-params.service';

describe('VersionParamsService', () => {
  let service: VersionParamsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VersionParamsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
