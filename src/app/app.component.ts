import { Component } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { NfcReaderService } from './services/nfc-reader/nfc-reader.service';
import { MatIconRegistry } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(
    private _nfcReaderService: NfcReaderService,
    mdIconRegistry: MatIconRegistry) {
    mdIconRegistry.registerFontClassAlias('fontawesome', 'fa');
    if (process && process.versions && process.versions.electron) {
      this._nfcReaderService.runTheScan();
    }
  }
}
