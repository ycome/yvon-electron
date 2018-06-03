import { Injectable } from '@angular/core';
import { CalendarService } from '../calendar/calendar.service';
import { DatabaseService } from '../database/database.service';
import { first } from 'rxjs/operators';
import { NfcReaderService } from '../nfc-reader/nfc-reader.service';
import { ChatMessagesService } from '../chat-messages/chat-messages.service';

@Injectable({
  providedIn: 'root'
})
export class YvonService {

  private MIN_CONFIDENCE = 0.78;

  private YVON_ACTIONS = {
    newUser: {
      messages: [{
        author: 'yvon',
        content: 'Bonjour, veuillez selectionner votre formation :'
      }],
      resultMessage: {
        author: 'caroussel',
        content: []
      },
      action: {
        option: {
          callback: 'newUser',
          params: ['id']
        },
        actionFn: () => this.getFormations(),
      }
    },
    formations: {
      messages: [{
        author: 'yvon',
        content: 'Voici les formations du campus :'
      }],
      resultMessage: {
        author: 'caroussel',
        content: []
      },
      action: {
        actionFn: (p) => this.getFormations(p),
        entities: { formation_type: [] }
      }
    },
    cours: {
      messages: [{
        author: 'yvon',
        content: 'Voici les prochains cours : '
      }],
      resultMessage: {
        author: 'caroussel',
        content: []
      },
      action: {
        actionFn: p => this.getNextCours(p),
        entities: { formation_type: [] }
      }
    },
    default: {
      messages: [{
        author: 'yvon',
        content: 'Désolé, je ne sais pas comment vous aidez :('
      }]
    }
  };

  constructor(
    private _calendar: CalendarService,
    private _databaseService: DatabaseService,
    private _nfcService: NfcReaderService,
    private _messagesService: ChatMessagesService
  ) {
    this._nfcService.nfcData.subscribe(cardId => {
      this._messagesService.clearChat();
      if (cardId) {
        this._databaseService.getNfcCardById(cardId).pipe(first()).toPromise().then(user => {
          if (user) {
            this._messagesService.sendMessage({
              author: 'yvon',
              content: 'Bonjour étudiant en '
            });
          } else {
            this.execAction(this.YVON_ACTIONS.newUser).then((action: any) => {
              this.sendMessages(action);
            }).catch(console.error);
          }
        }).catch(console.error);
      }
    });
  }

  sendMessages(action) {
    console.log('YVON.SERVICE SAY', action);
    if (action.messages && action.messages.length > 0) {
      action.messages.forEach(mes => {
        this._messagesService.sendMessage(mes);
      });
    }
    if (action.resultMessage) {
      this._messagesService.sendMessage(action.resultMessage);
    }
  }

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

  getFormations(entities = []) {
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

  execAction(yvonAction) {
    return new Promise((resolve, reject) => {
      if (yvonAction && yvonAction.action && yvonAction.action.actionFn) {
        resolve(yvonAction.action.actionFn(yvonAction.action.entities).then(list => {
          yvonAction.resultMessage.content = list;
          if (yvonAction.action.option) {
            yvonAction.resultMessage.content.map(ct => {
              const params = {
                callback: yvonAction.action.option.callback
              };
              (yvonAction.action.option.params || []).forEach(param => {
                params[param] = ct[param];
              });
              ct.onSelectParam = params;
              return ct;
            });
          }
          return yvonAction;
        }));
      } else {
        resolve(yvonAction);
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
          resolve(this.execAction(this.getAction(intent, witResponse)).then((action: any) => {
            this.sendMessages(action);
          }));
        } else {
          this.sendMessages(this.YVON_ACTIONS.default);
          resolve(this.YVON_ACTIONS.default);
        }
      } else {
        this.sendMessages(this.YVON_ACTIONS.default);
        resolve(this.YVON_ACTIONS.default);
      }
    });
  }

  getAction(intent, witResponse) {
    if (this.YVON_ACTIONS[intent.value]) {
      const yvonAction = this.YVON_ACTIONS[intent.value];
      if (yvonAction.action.entities && witResponse.entities) {
        Object.keys(yvonAction.action.entities).forEach(yvonActionEntity => {
          if (witResponse.entities[yvonActionEntity]) {
            yvonAction.action.entities[yvonActionEntity] = witResponse.entities[yvonActionEntity].map(ent => ent.value);
          }
        });
      }
      return yvonAction;
    } else {
      return this.YVON_ACTIONS.default;
    }
  }

  public callback(params) {
    console.log(params);
  }

}


