import { Component, OnInit } from '@angular/core';
import { ElectronService } from 'ngx-electron';
@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {

  constructor(private electronService: ElectronService) { }

  //   ngOnInit() {



  //   // Dans le processus renderer.


  //   desktopCapturer.getSources({types: ['window', 'screen']}, (error, sources) => {
  //     if (error) throw error
  //     for (let i = 0; i < sources.length; ++i) {
  //       if (sources[i].name === 'Electron') {
  //         navigator.mediaDevices.getUserMedia({
  //           audio: false,
  //           video: {
  //             mandatory: {
  //               chromeMediaSource: 'desktop',
  //               chromeMediaSourceId: sources[i].id,
  //               minWidth: 1280,
  //               maxWidth: 1280,
  //               minHeight: 720,
  //               maxHeight: 720
  //             }
  //           }
  //         })
  //         .then((stream) => this.handleStream(stream))
  //         .catch((e) => this.handleError(e))
  //         return
  //       }
  //     }
  //   });
  // }

  //    handleStream (stream) {
  //     const video = document.querySelector('video')
  //     video.srcObject = stream
  //     video.onloadedmetadata = (e) => video.play()
  //   }

  //    handleError (e) {
  //     console.log(e)
  //   }

  ngOnInit() {
    let n = <any>navigator;
    let myvid = <HTMLInputElement>document.getElementById('raja');
    this.electronService.desktopCapturer.getSources({ types: ['window', 'screen'] }, (error, sources) => {
      console.log(sources);
      if (error) throw error;
      for (let i = 0; i < sources.length; ++i) {
        if (sources[i].name === 'YvonElectron') {
          n.webkitGetUserMedia({
            audio: false,
            video: {
              mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: sources[i].id,
                minWidth: 1280,
                maxWidth: 1280,
                minHeight: 720,
                maxHeight: 720
              }
            }
          }, gotStream, getUserMediaError);
          return;
        }
      }
    });

    function gotStream(stream) {
      myvid.src = URL.createObjectURL(stream);
    }

    function getUserMediaError(e) {
      console.log('getUserMediaError');
    }
  }

}
