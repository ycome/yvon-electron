import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { ElectronService } from 'ngx-electron';

@Injectable({
  providedIn: 'root'
})
export class NfcReaderService {

  public nfcData: BehaviorSubject<any> = new BehaviorSubject(null);
  public nfcReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private _electronService: ElectronService) { }


  runTheScan() {
    console.log('Reader Scan launched');

    this.nfcCheckStatus();
    this.nfcCardDetected();
    this.nfcError();
    this.nfcEnd();
  }

  nfcCheckStatus() {
    this._electronService.ipcRenderer.on('reader', (event, message) => {
      console.log(`Device status : ${message}`);
      this.nfcReady.next(true);
    });
  }

  nfcCardDetected() {
    this._electronService.ipcRenderer.on('card', (event, message) => {
      console.log(`Card ID : ${message}`);
      this.nfcData.next(message);
    });
  }

  nfcError() {
    this._electronService.ipcRenderer.on('error', (event, message) => {
      console.log(`Error : ${message}`);
      this.nfcData.next(message);
    });
  }

  nfcEnd() {
    this._electronService.ipcRenderer.on('end', (event, message) => {
      console.log(`Device status : ${message}`);
      this.nfcReady.next(false);
    });
  }

  public nfcCardRemove() {
    this.nfcData.next(null);
  }
}
