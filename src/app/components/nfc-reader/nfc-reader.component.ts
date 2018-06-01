import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { ElectronService } from 'ngx-electron';
// import { NFC } from 'nfc-pcsc';

@Component({
  selector: 'app-nfc-reader',
  templateUrl: './nfc-reader.component.html',
  styleUrls: ['./nfc-reader.component.css']
})
export class NfcReaderComponent implements OnInit {

  public status: string;
  public listId = [];

  // nfc = new NFC();

  constructor(
    private _electronService: ElectronService,
    private _ngZone: NgZone,
    private _changeDetectorRef: ChangeDetectorRef) {
    this.runTheScan();

    // this.readerCar();

    // this._electronService.ipcRenderer.on('reader', (event, message) => {
    //   this._ngZone.run(() => {
    //     console.log(`Asynchronous message reply: ${message}`);
    //     this.status = message;
    //   });
    // });
  }

  ngOnInit() {

  }

  runTheScan() {
    console.log('Reader Scan launched');
    this._electronService.ipcRenderer.on('reader', (event, message) => {
      this.status = message;
      this._changeDetectorRef.detectChanges();
    });
    this._electronService.ipcRenderer.on('card', (event, message) => {
      console.log(`Asynchronous message reply: ${message}`);
      this.listId.push(message);
      this._changeDetectorRef.detectChanges();
    });
    this._electronService.ipcRenderer.on('error', (event, message) => {
      console.log(`Asynchronous message reply: ${message}`);
      this.status = message;
      this._changeDetectorRef.detectChanges();
    });
    this._electronService.ipcRenderer.on('end', (event, message) => {
      console.log(`Asynchronous message reply: ${message}`);
      this.status = message;
      this._changeDetectorRef.detectChanges();
    });
  }

  readerCar() {
    console.log('Reader launched');
    // this.nfc.on('reader', reader => {

    //   // disable auto processing
    //   reader.autoProcessing = false;

    //   console.log(`${reader.reader.name}  device attached`);

    //   // needed for reading tags emulated with Android HCE
    //   // custom AID, change according to your Android for tag emulation
    //   // see https://developer.android.com/guide/topics/connectivity/nfc/hce.html
    //   // reader.aid = 'F222222222';

    //   reader.on('card', card => {

    //     // card is object containing following data
    //     // String standard: TAG_ISO_14443_3 (standard nfc tags like Mifare) or TAG_ISO_14443_4 (Android HCE and others)
    //     // String type: same as standard
    //     // Buffer atr

    //     console.log(`${reader.reader.name}  card inserted`, card);

    //     // you can use reader.transmit to send commands and retrieve data
    //     // see https://github.com/pokusew/nfc-pcsc/blob/master/src/Reader.js#L291

    //   });

    //   reader.on('card.off', card => {
    //     console.log(`${reader.reader.name}  card removed`, card);
    //   });

    //   reader.on('error', err => {
    //     console.log(`${reader.reader.name}  an error occurred`, err);
    //   });

    //   reader.on('end', () => {
    //     console.log(`${reader.reader.name}  device removed`);
    //   });

    // });

    // this.nfc.on('error', err => {
    //   console.log('an error occurred', err);
    // });
  }
}
