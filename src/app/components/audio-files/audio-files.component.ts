import { Component, OnInit } from '@angular/core';
declare const navigator: any;
declare const MediaRecorder: any;
declare const Recorder: any;
declare const webkitAudioContext: any;
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, retry } from 'rxjs/operators';
import { throwError } from 'rxjs';
import * as bufToWav from 'audiobuffer-to-wav';


@Component({
  selector: 'app-audio-files',
  templateUrl: './audio-files.component.html',
  styleUrls: ['./audio-files.component.css']
})
export class AudioFilesComponent implements OnInit {

  public isRecording = false;
  private chunks: any = [];
  private mediaRecorder: any;
  public recorder: any;


  constructor(private http: HttpClient) { }

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

  ngOnInit() {

    const witToken = 'LQBKVXRJFSQW56FQTY7ONNJMJGMHWPKR'; // get one from wit.ai!

    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/vnd.wit.20160202+json',
        'Authorization': 'Bearer ' + witToken,
        'Content-Type': 'audio/wav'
      })
    };


    const onSuccess = stream => {
      this.mediaRecorder = new MediaRecorder(stream);
      this.mediaRecorder.onstop = e => {
        const audio = new Audio();
        const blob = new Blob(this.chunks, { 'type': 'audio/raw; encoding=unsigned-integer; bits=16; rate=8000; endian=big' });
        const fileReader = new FileReader();

        fileReader.onloadend = () => {
          const test = bufToWav(fileReader.result);
          this.http.post('https://api.wit.ai/speech?v=20170307', test, httpOptions)
            .pipe(
              catchError(this.handleError)
            ).subscribe(console.log);
        };

        fileReader.readAsArrayBuffer(blob);

        this.chunks.length = 0;
        audio.src = window.URL.createObjectURL(blob);
        console.log(audio.src);
        audio.load();
        audio.play();
        // this.http.post('https://api.wit.ai/speech?v=20170307', blob, httpOptions)
        //   .pipe(
        //     catchError(this.handleError)
        //   ).subscribe(console.log);


      };

      this.mediaRecorder.ondataavailable = e => this.chunks.push(e.data);
    };

    navigator.getUserMedia = (navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia);

    navigator.getUserMedia({ audio: true }, onSuccess, e => console.log(e));
  }



  // public record() {
  //   this.isRecording = true;
  //   this.mediaRecorder.start();
  //   navigator.getUserMedia({ audio: true }, onSuccess, onFail);
  // }

  // public stop() {
  //   this.isRecording = false;
  //   this.mediaRecorder.stop();
  // }














  onFail2(e) {
    console.log('Rejected!', e);
  }

  onSuccess2 = (s) => {
    const context = new AudioContext();
    const mediaStreamSource = context.createMediaStreamSource(s);
    this.recorder = new Recorder(mediaStreamSource);
    this.recorder.record();
    // audio loopback
    // mediaStreamSource.connect(context.destination);
  }


  record() {
    this.isRecording = true;
    if (navigator.getUserMedia) {
      navigator.getUserMedia({ audio: true }, this.onSuccess2, this.onFail2);
    } else {
      console.log('navigator.getUserMedia not present');
    }
  }
  stop = () => {
    this.isRecording = false;
    const witToken = 'LQBKVXRJFSQW56FQTY7ONNJMJGMHWPKR'; // get one from wit.ai!

    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/vnd.wit.20160202+json',
        'Authorization': 'Bearer ' + witToken,
        'Content-Type': 'audio/wav'
      })
    };
    this.recorder.stop();
    this.recorder.exportWAV((s) => {
      this.http.post('https://api.wit.ai/speech?v=20170307', s, httpOptions)
        .pipe(
          catchError(this.handleError)
        ).subscribe(console.log);
    });
  }


}
