import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { ChatMessagesService } from '../../services/chat-messages/chat-messages.service';
import { Subject } from 'rxjs';
import { Messages } from '../../models/messages.model';
import { YvonService } from '../../services/yvon/yvon.service';

@Component({
  selector: 'app-chatui',
  templateUrl: './chatui.component.html',
  styleUrls: ['./chatui.component.css']
})
export class ChatuiComponent implements OnInit, AfterViewChecked {

  messages: Subject<Messages[]>;
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  constructor(private _chatMessagesService: ChatMessagesService, private _yvonService: YvonService) { }

  ngOnInit() {
    this.messages = this._chatMessagesService.getMessages();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
  }

  onClickOnCard(option) {
    if (option && option.onSelectParam) {
      this._yvonService.callback(option.onSelectParam);
    }
  }

}
