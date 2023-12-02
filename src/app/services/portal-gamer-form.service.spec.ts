import { TestBed } from '@angular/core/testing';

import { PortalGamerFormService } from './portal-gamer-form.service';

describe('PortalGamerFormService', () => {
  let service: PortalGamerFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PortalGamerFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
