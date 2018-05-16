import { TestBed, inject } from '@angular/core/testing';

import { WitService } from './wit.service';

describe('WitService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WitService]
    });
  });

  it('should be created', inject([WitService], (service: WitService) => {
    expect(service).toBeTruthy();
  }));
});
