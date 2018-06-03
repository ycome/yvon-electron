import { Component, OnInit } from '@angular/core';
import { NfcReaderService } from '../../services/nfc-reader/nfc-reader.service';
import { RecorderService } from '../../services/recorder/recorder.service';
import { ChatMessagesService } from '../../services/chat-messages/chat-messages.service';
import { DatabaseService } from '../../services/database/database.service';

@Component({
  selector: 'app-action-bar',
  templateUrl: './action-bar.component.html',
  styleUrls: ['./action-bar.component.css']
})
export class ActionBarComponent implements OnInit {

  public nfcReady = false;
  public recorderReady = false;
  public networkOk = false;

  constructor(
    private _nfcReaderService: NfcReaderService,
    private _recorderService: RecorderService,
    private _chatMessageService: ChatMessagesService,
    private _databaseService: DatabaseService) { }

  ngOnInit() {
    this._nfcReaderService.nfcReady.subscribe(deviceStatus => {
      this.nfcReady = deviceStatus;
    });
    this._recorderService.recorderStatus.subscribe(recordStatus => {
      this.recorderReady = recordStatus !== 'off';
    });
    this._databaseService.networkCheck.subscribe(networkIsOk => {
      this.networkOk = networkIsOk;
    });
  }

  sendMessageYvon() {
    this._chatMessageService.sendMessage({
      author: 'yvon',
      content: 'test fonctionnel bitch -- Yvon'
    });
  }

  sendMessageStudent() {
    this._chatMessageService.sendMessage({
      author: 'student',
      content: 'test fonctionnel bitch -- Student'
    });
  }

  clearChat() {
    this._chatMessageService.clearChat();
  }
}
