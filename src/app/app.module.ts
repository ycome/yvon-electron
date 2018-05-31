import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxElectronModule } from 'ngx-electron';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SearchBarComponent } from './components/search-bar/search-bar.component';

import { WitService } from './services/wit.service';
import { MatInputModule } from '@angular/material/input';
import { AudioFilesComponent } from './components/audio-files/audio-files.component';
import { NfcReaderComponent } from './components/nfc-reader/nfc-reader.component';
import { AngularFireModule } from 'angularfire2';
import { environment } from '../environments/environment';



@NgModule({
  declarations: [
    AppComponent,
    SearchBarComponent,
    AudioFilesComponent,
    NfcReaderComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatInputModule,
    NgxElectronModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase)
  ],
  providers: [
    WitService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
