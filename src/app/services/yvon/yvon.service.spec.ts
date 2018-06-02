import { TestBed, inject } from '@angular/core/testing';

import { YvonService } from './yvon.service';

describe('YvonService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [YvonService]
    });
  });

  it('should be created', inject([YvonService], (service: YvonService) => {
    expect(service).toBeTruthy();
  }));
});
