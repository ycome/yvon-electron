import { Component, OnInit } from '@angular/core';
import { NfcReaderService } from '../../services/nfc-reader/nfc-reader.service';
import { RecorderService } from '../../services/recorder/recorder.service';

@Component({
  selector: 'app-action-bar',
  templateUrl: './action-bar.component.html',
  styleUrls: ['./action-bar.component.css']
})
export class ActionBarComponent implements OnInit {

  public nfcReady = false;
  public recorderReady = false;

  constructor(private _nfcReaderService: NfcReaderService, private _recorderService: RecorderService) { }

  ngOnInit() {
    this._nfcReaderService.nfcReady.subscribe(deviceStatus => {
      this.nfcReady = deviceStatus;
    });
    this._recorderService.recorderStatus.subscribe(recordStatus => {
      this.recorderReady = recordStatus !== 'off';
    });
  }

}
