import { TestBed } from '@angular/core/testing';

import { ServiceMatrixService } from './service-matrix.service';

describe('ServiceMatrixService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ServiceMatrixService = TestBed.get(ServiceMatrixService);
    expect(service).toBeTruthy();
  });
});
