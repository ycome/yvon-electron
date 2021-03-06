// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  wit: {
    public_token: 'LQBKVXRJFSQW56FQTY7ONNJMJGMHWPKR',
    api_version: '20170307',
    url: 'https://api.wit.ai/'
  },
  firebase: {
    apiKey: 'AIzaSyAmJ2CaFGUatBUI0L-84K8lB4rLdJ3WKIg',
    authDomain: 'ynov-yvon.firebaseapp.com',
    databaseURL: 'https://ynov-yvon.firebaseio.com',
    projectId: 'ynov-yvon',
    storageBucket: 'ynov-yvon.appspot.com',
    messagingSenderId: '231764147130'
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
