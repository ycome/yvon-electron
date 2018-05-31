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


  public recorderStatus: BehaviorSubject<String> = new BehaviorSubject('off');
  public WaveRecorded: Subject<any> = new Subject();
  public recordingTime: BehaviorSubject<Number> = new BehaviorSubject(0);

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
      this.recorder.record();
      this.recorderStatus.next('recording');
      this.stopOnTimeout();
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
    this.currentTime++;
    if (this.currentTime >= 5) {
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
    this.currentSetInterval = setInterval(() => { this.stopAtEndTime(); }, 1000);
  }

  // private handleError(error: HttpErrorResponse) {
  //   if (error.error instanceof ErrorEvent) {
  //     // A client-side or network error occurred. Handle it accordingly.
  //     console.error('An error occurred:', error.error.message);
  //   } else {
  //     // The backend returned an unsuccessful response code.
  //     // The response body may contain clues as to what went wrong,
  //     console.error(
  //       `Backend returned code ${error.status}, ` +
  //       `body was: ${error.error}`);
  //   }
  //   // return an observable with a user-facing error message
  //   return throwError(
  //     'Something bad happened; please try again later.');
  // }



  record() {
    this.speechEvents.resume();
    this.recorderStatus.next('wait');
  }

  stop() {
    this.speechEvents.suspend();

    // const witToken = 'LQBKVXRJFSQW56FQTY7ONNJMJGMHWPKR'; // get one from wit.ai!

    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     'Accept': 'application/vnd.wit.20160202+json',
    //     'Authorization': 'Bearer ' + witToken,
    //     'Content-Type': 'audio/wav'
    //   })
    // };


    this.recorder.exportWAV((s) => {
      this.WaveRecorded.next(s);
      this.recorderStatus.next('ready');

      // this.http.post('https://api.wit.ai/speech?v=20170307', s, httpOptions)
      //   .pipe(
      //     catchError(this.handleError)
      //   ).subscribe(res => {
      //     console.log(res);
      //     this.recorder.clear();
      //   });
    });
  }

}
