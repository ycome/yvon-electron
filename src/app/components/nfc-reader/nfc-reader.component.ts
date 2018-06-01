import { Component, OnInit, NgZone } from '@angular/core';
import { NfcReaderService } from '../../services/nfc-reader/nfc-reader.service';

@Component({
  selector: 'app-nfc-reader',
  templateUrl: './nfc-reader.component.html',
  styleUrls: ['./nfc-reader.component.css']
})
export class NfcReaderComponent implements OnInit {

  public isReady: boolean;
  public listId = [];

  constructor(private _nfcReaderService: NfcReaderService) {
    this._nfcReaderService.nfcReady.subscribe(deviceStatus => {
      this.isReady = deviceStatus;
    });

    this._nfcReaderService.nfcData.subscribe(cardData => {
      this.listId.push(cardData);
    });
  }

  ngOnInit() {

  }

}
