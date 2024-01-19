import { TestBed } from '@angular/core/testing';

import { ApiCentralService } from './api-central.service';

describe('ApiCentralService', () => {
  let service: ApiCentralService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiCentralService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
