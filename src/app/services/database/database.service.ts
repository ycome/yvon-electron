import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable, throwError } from 'rxjs';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private GROUPS_COLLECTION_NAME = 'groups';
  private USERS_COLLECTION_NAME = 'users';
  private FORMATIONS_COLLECTION_NAME = 'formations';

  users: AngularFirestoreCollection<any>;
  groups: AngularFirestoreCollection<any>;
  formations: AngularFirestoreCollection<any>;

  constructor(db: AngularFirestore) {
    this.users = db.collection(this.USERS_COLLECTION_NAME);
    this.groups = db.collection(this.GROUPS_COLLECTION_NAME);
    this.formations = db.collection(this.FORMATIONS_COLLECTION_NAME);
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
