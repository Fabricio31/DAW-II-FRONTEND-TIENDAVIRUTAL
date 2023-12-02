import { TestBed } from '@angular/core/testing';

import { GameStoreFormService } from './game-store-form.service';

describe('GameStoreFormService', () => {
  let service: GameStoreFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameStoreFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
