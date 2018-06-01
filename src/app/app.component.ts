import { Component } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { NfcReaderService } from './services/nfc-reader/nfc-reader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(private _nfcReaderService: NfcReaderService) {
    this._nfcReaderService.runTheScan();
  }
}
