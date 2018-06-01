import { Injectable } from '@angular/core';
import { environment } from './../../../environments/environment';
import { HttpErrorResponse, HttpHeaders, HttpClient } from '@angular/common/http';
import { throwError, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WitService {

  constructor(private _http: HttpClient) { }


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
    return of('Désolé, je n\'ai pas compris');
  }

  getIntentsByWav(wav): Observable<Object> {
    if (wav) {
      const httpOptions = {
        headers: new HttpHeaders({
          'Accept': 'application/vnd.wit.20160202+json',
          'Authorization': 'Bearer ' + environment.wit.public_token,
          'Content-Type': 'audio/wav'
        })
      };


      return this._http.post(environment.wit.url + 'speech?v=' + environment.wit.api_version, wav, httpOptions)
        .pipe(
          catchError(this.handleError)
        );
    } else {
      return of();
    }
  }
}
