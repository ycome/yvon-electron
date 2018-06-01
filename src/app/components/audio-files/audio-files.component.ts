import { Component, OnInit } from '@angular/core';
import { RecorderService } from '../../services/recorder/recorder.service';
import { mergeMap } from 'rxjs/operators';
import { WitService } from '../../services/wit/wit.service';



@Component({
  selector: 'app-audio-files',
  templateUrl: './audio-files.component.html',
  styleUrls: ['./audio-files.component.css']
})
export class AudioFilesComponent implements OnInit {


  public loaderPercent = 0;
  public status = '';

  constructor(private recorderService: RecorderService, private witService: WitService) { }



  ngOnInit() {

    this.recorderService.recorderStatus.subscribe(recordStatus => {
      this.status = recordStatus;
    });
    this.recorderService.WaveRecorded.pipe(
      mergeMap(wav => this.witService.getIntentsByWav(wav))
    ).subscribe(witResponse => {
      console.log(witResponse);
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
