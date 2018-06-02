import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class YvonService {

  private yvonActions = {
    cours: {
      message: 'voici vos prochain cours : ',
      actionType: 'calendar'
    },
    formations: {
      message: 'voici les formations du campus :',
      actionType: 'simpleList'
    },
    default: {
      message: 'Désolé, je ne sait pas comment vous aidez :('
    }
  };

  constructor() { }

  witResponseToMessage(witResponse) {
    return new Promise((resolve, reject) => {
      if (witResponse && witResponse.entities) {
        if (witResponse.entities.formations) {
          resolve(this.yvonActions.formations);
        } else if (witResponse.entities.salle) {
          resolve(this.yvonActions.cours);
        } else {
          resolve(this.yvonActions.default);
        }
      } else {
        resolve(this.yvonActions.default);
      }
    });
  }
}
