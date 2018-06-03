import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private GROUPS_COLLECTION_NAME = 'groups';
  private USERS_COLLECTION_NAME = 'users';
  private FORMATIONS_COLLECTION_NAME = 'formations';
  private NETWORK_COLLECTION_NAME = 'network';
  public networkCheck: BehaviorSubject<boolean> = new BehaviorSubject(false);


  users: AngularFirestoreCollection<any>;
  groups: AngularFirestoreCollection<any>;
  formations: AngularFirestoreCollection<any>;
  networktest: AngularFirestoreCollection<any>;

  constructor(db: AngularFirestore) {
    this.users = db.collection(this.USERS_COLLECTION_NAME);
    this.groups = db.collection(this.GROUPS_COLLECTION_NAME);
    this.formations = db.collection(this.FORMATIONS_COLLECTION_NAME);
    this.networktest = db.collection(this.NETWORK_COLLECTION_NAME);

    setInterval(() => {
      this.networktest.doc('test').valueChanges().pipe(first()).toPromise()
        .then(() => {
          this.networkCheck.next(true);
        }).catch(err => {
          this.networkCheck.next(false);
        });
    }, 4000);
  }

  getFormations() {
    return this.formations.valueChanges();
  }

  getGroups() {
    return this.groups.valueChanges();
  }

  getGroupById(groupId) {
    return this.groups.doc(groupId).valueChanges();
  }

  getNfcCardById(nfcId) {
    return this.users.doc(nfcId).valueChanges();
  }

  addNfcCard(id, groupId) {
    return new Promise((resolve, reject) => {
      if (id && groupId) {
        this.getGroupById(groupId).pipe(first()).toPromise()
          .then(group => {
            return this.users.add({
              id: id,
              group: group
            });
          }).then(user => {
            resolve(user);
          }).catch(err => {
            reject(err);
          });
      } else {
        reject('id and group id must be defined');
      }
    });
  }

}
