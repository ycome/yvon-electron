import { Injectable } from '@angular/core';
declare const navigator: any;
declare const MediaRecorder: any;
declare const Recorder: any;
declare const webkitAudioContext: any;
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, retry } from 'rxjs/operators';
import { throwError, Subject, BehaviorSubject } from 'rxjs';
import * as bufToWav from 'audiobuffer-to-wav';
import * as hark from 'hark';

@Injectable({
  providedIn: 'root'
})
export class RecorderService {


  public recorderStatus: BehaviorSubject<string> = new BehaviorSubject('off');
  public WaveRecorded: Subject<any> = new Subject();
  public recordingTime: BehaviorSubject<number> = new BehaviorSubject(0);
  public recordingMaxTime = 5000;
  private chunks: any = [];
  private mediaRecorder: any;
  private speechEvents: any;
  private recorder: any;

  // for timer
  private currentTime = 0;
  private currentSetInterval: any = null;


  constructor() {

    this.navGetUserMedia().then(stream => {
      this.streamSetter(stream);
    }).catch(console.error);

  }

  navGetUserMedia() {
    navigator.getUserMedia = (navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia);
    return new Promise((resolve, reject) => {
      if (navigator.getUserMedia) {
        navigator.getUserMedia(
          { audio: true },
          resolve,
          reject
        );
      } else {
        reject('navigator.getUserMedia not present');
      }
    });
  }

  streamSetter(stream) {
    const context = new AudioContext();
    const mediaStreamSource = context.createMediaStreamSource(stream);
    this.recorder = new Recorder(mediaStreamSource);
    this.speechEvents = hark(stream);
    this.speechEvents.suspend();


    this.speechEvents.on('speaking', () => {
      // console.log('speaking');
      if (this.recorderStatus.value === 'wait') {
        this.recorder.record();
        this.recorderStatus.next('recording');
        this.stopOnTimeout();
      }
    });

    // this.speechEvents.on('volume_change', (volume, threshold) => {
    // console.log('volume_change');
    // });

    this.speechEvents.on('stopped_speaking', () => {
      if (this.recorderStatus.value === 'recording') {
        console.log('hark_stopped_speaking_automaticaly');
        this.stopRecord();
      }
    });

    this.recorderStatus.next('ready');

  }

  stopRecord() {
    this.stopTimeout();
    this.recorder.stop();
    this.recorderStatus.next('recorded');
    this.stop();
  }

  stopAtEndTime() {
    this.recordingTime.next(this.currentTime);
    this.currentTime += 100;
    if (this.currentTime >= this.recordingMaxTime) {
      console.log('time_stopped_speaking_automaticaly');
      this.stopRecord();
    }
  }

  stopTimeout() {
    if (this.currentSetInterval) {
      clearInterval(this.currentSetInterval);
    }
    this.currentTime = 0;
    this.recordingTime.next(this.currentTime);
    this.currentSetInterval = null;
  }

  stopOnTimeout() {
    this.stopTimeout();
    this.currentSetInterval = setInterval(() => { this.stopAtEndTime(); }, 100);
  }





  record() {
    this.speechEvents.resume();
    this.recorderStatus.next('wait');
  }

  stop() {

    this.speechEvents.suspend();
    this.recorder.exportWAV((s) => {
      this.WaveRecorded.next(s);
      this.recorder.clear();
      this.recorderStatus.next('ready');
    });

  }

}
