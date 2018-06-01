import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxElectronModule } from 'ngx-electron';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SearchBarComponent } from './components/search-bar/search-bar.component';

import { WitService } from './services/wit/wit.service';
import { MatInputModule } from '@angular/material/input';
import { AudioFilesComponent } from './components/audio-files/audio-files.component';
import { NfcReaderComponent } from './components/nfc-reader/nfc-reader.component';
import { AngularFireModule } from 'angularfire2';
import { environment } from '../environments/environment';
import { RecorderService } from './services/recorder/recorder.service';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { ActionBarComponent } from './components/action-bar/action-bar.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ChatuiComponent } from './components/chatui/chatui.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchBarComponent,
    AudioFilesComponent,
    NfcReaderComponent,
    ActionBarComponent,
    ChatuiComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatInputModule,
    NgxElectronModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    FlexLayoutModule,
    MatCardModule
  ],
  providers: [
    WitService,
    RecorderService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
