import { TestBed } from '@angular/core/testing';

import { DocFctServiceService } from './doc-fct-service.service';

describe('DocFctServiceService', () => {
  let service: DocFctServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocFctServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
