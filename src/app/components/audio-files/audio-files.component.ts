import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
declare const navigator: any;
declare const MediaRecorder: any;
declare const Recorder: any;
declare const webkitAudioContext: any;
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, retry } from 'rxjs/operators';
import { throwError } from 'rxjs';
import * as bufToWav from 'audiobuffer-to-wav';
import * as hark from 'hark';


@Component({
  selector: 'app-audio-files',
  templateUrl: './audio-files.component.html',
  styleUrls: ['./audio-files.component.css']
})
export class AudioFilesComponent implements OnInit {

  public recordStatus: { recording: boolean } = { recording: false };
  private chunks: any = [];
  private mediaRecorder: any;
  private speechEvents: any;
  public recorder: any;


  constructor(private http: HttpClient, private changeDetectorRef: ChangeDetectorRef) { }



  ngOnInit() {



    navigator.getUserMedia = (navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia);

    if (navigator.getUserMedia) {
      navigator.getUserMedia({ audio: true }, stream => {
        const context = new AudioContext();
        const mediaStreamSource = context.createMediaStreamSource(stream);
        this.recorder = new Recorder(mediaStreamSource);
        this.speechEvents = hark(stream);
        this.speechEvents.suspend();


        this.speechEvents.on('speaking', () => {
          console.log('speaking');
          this.recorder.record();
        });

        this.speechEvents.on('volume_change', (volume, threshold) => {
          // console.log('volume_change');
        });

        this.speechEvents.on('stopped_speaking', () => {
          console.log('stopped_speaking');
          this.recorder.stop();
          this.stop();
        });

      }, err => {
        console.log('Rejected!', err);
      });
    } else {
      console.log('navigator.getUserMedia not present');
    }

  }















  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }



  public record() {
    this.recordStatus.recording = true;
    this.speechEvents.resume();
  }

  public stop() {
    this.recordStatus.recording = false;
    this.speechEvents.suspend();
    const witToken = 'LQBKVXRJFSQW56FQTY7ONNJMJGMHWPKR'; // get one from wit.ai!

    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/vnd.wit.20160202+json',
        'Authorization': 'Bearer ' + witToken,
        'Content-Type': 'audio/wav'
      })
    };

    this.changeDetectorRef.detectChanges();

    this.recorder.exportWAV((s) => {
      this.http.post('https://api.wit.ai/speech?v=20170307', s, httpOptions)
        .pipe(
          catchError(this.handleError)
        ).subscribe(res => {
          console.log(res);
          this.recorder.clear();
        });
    });
  }


}
