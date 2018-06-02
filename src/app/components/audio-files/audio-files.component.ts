import { ChatMessagesService } from './../../services/chat-messages/chat-messages.service';
import { Component, OnInit } from '@angular/core';
import { RecorderService } from '../../services/recorder/recorder.service';
import { mergeMap } from 'rxjs/operators';
import { WitService } from '../../services/wit/wit.service';
import { YvonService } from '../../services/yvon/yvon.service';



@Component({
  selector: 'app-audio-files',
  templateUrl: './audio-files.component.html',
  styleUrls: ['./audio-files.component.css']
})
export class AudioFilesComponent implements OnInit {


  public loaderPercent = 0;
  public status = '';
  public loading = 0;

  constructor(
    private recorderService: RecorderService,
    private witService: WitService,
    private _chatMessagesService: ChatMessagesService,
    private _yvonService: YvonService) { }



  ngOnInit() {

    this.recorderService.recorderStatus.subscribe(recordStatus => {
      this.status = recordStatus;
    });
    this.recorderService.WaveRecorded.pipe(
      mergeMap(wav => {
        this.loading += 1;
        return this.witService.getIntentsByWav(wav);
      })
    ).subscribe(
      (witResponse: any) => {
        this.loading -= 1;
        console.log(witResponse);
        this._chatMessagesService.sendMessage({
          author: witResponse.author || 'student',
          content: witResponse._text
        });
        if (!witResponse.noReturn) {
          this._yvonService.witResponseToMessage(witResponse).then((res: any) => {
            this._chatMessagesService.sendMessage({
              author: 'yvon',
              content: res.message
            });
          }).catch(console.error);
        } else {
          console.warn('pas de  reponse à donner par yvon');
        }
      },
      err => {
        this.loading -= 1;
        console.error('error from record or wit : ', err);
      },
      () => {
        this.loading -= 1;
        console.error('fin from record or wit ');
      });
    this.recorderService.recordingTime.subscribe((t) => {
      // console.log('time : ', t);
      this.loaderPercent = t > 0 ? ((t / this.recorderService.recordingMaxTime) * 100) : t;
    });

  }

  public start() {
    this.recorderService.record();
  }

  public stop() {
    this.recorderService.stop();
  }


















}
