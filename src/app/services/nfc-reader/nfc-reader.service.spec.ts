/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { NfcReaderService } from './nfc-reader.service';

describe('Service: NfcReader', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NfcReaderService]
    });
  });

  it('should ...', inject([NfcReaderService], (service: NfcReaderService) => {
    expect(service).toBeTruthy();
  }));
});
