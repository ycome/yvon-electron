import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Messages } from '../../models/messages.model';

@Injectable({
  providedIn: 'root'
})
export class ChatMessagesService {

  public messages$: Subject<Messages[]> = new Subject();
  public messages: Messages[] = [];

  constructor() { }

  sendMessage(message: Messages) {
    this.messages.push(message);
    this.messages$.next(this.messages);
  }

  clearChat() {
    this.messages.length = 0;
    this.messages$.next(this.messages);
  }

  getMessages() {
    return this.messages$;
  }
}
