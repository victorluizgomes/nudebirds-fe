import { TestBed } from '@angular/core/testing';

import { MoonbirdsService } from './moonbirds.service';

describe('MoonbirdsService', () => {
  let service: MoonbirdsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MoonbirdsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
