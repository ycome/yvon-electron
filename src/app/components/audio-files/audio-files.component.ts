import { Component, OnInit } from '@angular/core';
import { RecorderService } from '../../services/recorder/recorder.service';



@Component({
  selector: 'app-audio-files',
  templateUrl: './audio-files.component.html',
  styleUrls: ['./audio-files.component.css']
})
export class AudioFilesComponent implements OnInit {




  constructor(private recorderService: RecorderService) { }



  ngOnInit() {

    this.recorderService.recorderStatus.subscribe(console.log);
    this.recorderService.WaveRecorded.subscribe(() => {
      console.log('WAVE_FOR_SEND');
    });
    this.recorderService.recordingTime.subscribe((t) => {
      console.log('time : ', t);
    });

  }

  public start() {
    this.recorderService.record();
  }

  public stop() {
    this.recorderService.stop();
  }


















}
