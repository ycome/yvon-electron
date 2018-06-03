import { Injectable } from '@angular/core';
import { CalendarService } from '../calendar/calendar.service';
import { DatabaseService } from '../database/database.service';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class YvonService {

  private MIN_CONFIDENCE = 0.78;

  private YVON_ACTIONS = {
    cours: {
      author: 'yvon',
      content: 'Voici les prochains cours : ',
      actionFn: p => this.getNextCours(p),
      entities: { formation_type: [] },
      listType: 'calendarList',
      list: { next: [], now: [] }
    },
    formations: {
      author: 'yvon',
      content: 'Voici les formations du campus :',
      actionFn: (p) => this.getFormations(p),
      entities: { formation_type: [] },
      listType: 'simpleList',
      list: []
    },
    default: {
      author: 'yvon',
      content: 'Désolé, je ne sais pas comment vous aidez :('
    }
  };

  constructor(private _calendar: CalendarService, private _databaseService: DatabaseService) { }

  getNextCours(entities) {
    return Promise.resolve(this._calendar.getCurrentEventOfFormation('ingesup_b2'));
    // if (entities.length > 0) {
    //   return this._calendar.getCurrentEventOfFormation('');
    // } else {
    //   return this._calendar.getCurrentEventOfFormation()
    // }
  }

  formationIsInEntities(formation, entities) {
    let exist = false;
    formation.keywords.forEach(keyword => {
      if (entities.includes(keyword)) {
        exist = true;
      }
    });
    return exist;
  }

  getFormations(entities) {
    return this._databaseService.getFormations().pipe(first()).toPromise().then(formations => {
      console.log('FORMATIONS : ', formations);
      if (entities && entities.length > 0) {
        const filteredFormations = formations.filter(formation => this.formationIsInEntities(formation, entities));
        if (filteredFormations.length > 0) {
          return filteredFormations;
        } else {
          return formations;
        }
      } else {
        return formations;
      }
    });
  }

  execAction(action) {
    return new Promise((resolve, reject) => {
      if (action && action.actionFn) {
        resolve(action.actionFn(action.entities).then(list => {
          action.list = list;
          return action;
        }));
      } else {
        resolve(action);
      }
    });
  }

  filterConfidence(intent) {
    return intent.confidence >= this.MIN_CONFIDENCE;
  }
  sortByConfidence(intent1, intent2) {
    return intent2.confidence - intent1.confidence;
  }

  witResponseToMessage(witResponse) {
    return new Promise((resolve, reject) => {
      if (witResponse && witResponse.entities && witResponse.entities.intent && witResponse.entities.intent.length > 0) {
        const intents = witResponse.entities.intent.filter(int => this.filterConfidence(int));
        if (intents.length > 0) {
          const intent = intents.sort((int1, int2) => this.sortByConfidence(int1, int2))[0];
          const action = this.getAction(intent, witResponse);
          resolve(this.execAction(action));

        } else {
          resolve(this.YVON_ACTIONS.default);
        }
      } else {
        resolve(this.YVON_ACTIONS.default);
      }
    });
  }

  getAction(intent, witResponse) {
    if (this.YVON_ACTIONS[intent.value]) {
      const yvonAction = this.YVON_ACTIONS[intent.value];
      if (yvonAction.entities && witResponse.entities) {
        Object.keys(yvonAction.entities).forEach(yvonActionEntity => {
          if (witResponse.entities[yvonActionEntity]) {
            yvonAction.entities[yvonActionEntity] = witResponse.entities[yvonActionEntity].map(ent => ent.value);
          }
        });
      }
      return yvonAction;
    } else {
      return this.YVON_ACTIONS.default;
    }
  }

}


