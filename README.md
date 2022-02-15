### Constructor Admin Panel

#### local
http://localhost:5001/constructor-2de11/us-central1/api

http://localhost:3000/

#### production
Admin API
https://us-central1-constructor-2de11.cloudfunctions.net/api

Admin APP
constructor-admin.firebaseapp.com

#### artifacts bucket
https://console.cloud.google.com/storage/browser?project=constructor-2de11

#### ------------------------------------------

#### preparing
````
cd functions

npm i firebase-tools -g

firebase login

firebase use constructor-2de11
````
#### ------------------------------------------

#### deploy Functions
````
firebase deploy --only functions:FUNCTION_NAME
````
#### deploy API
````
firebase deploy --only functions:api
````
#### deploy Admin Panel
````
firebase deploy --only hosting:constructor-admin
````
#### deploy .rules file
````
firebase deploy --only storage
firebase deploy --only firestore:rules
````
#### ------------------------------------------

#### Local API
````
firebase emulators:start --only functions
````

#### Local APP
````
npm run app
````

#### Build
````
npm run build
````

#### ------------------------------------------

#### config
##### API: firebase/.env
````
FIRE_API_KEY
FIRE_AUTH_DOMAIN
FIRE_DATABASE_URL
FIRE_PROJECT_ID
FIRE_STORAGE_BUCKET
FIRE_MESSAGING_SENDER_ID
FIRE_APP_ID
FIRE_MEASUREMENT_ID
````
##### APP: firebase/admin/app/.anv
````
SKIP_PREFLIGHT_CHECK=true

REACT_APP_API_URL_LOCAL=http://localhost:5001/constructor-2de11/us-central1/api
REACT_APP_API_URL=https://us-central1-constructor-2de11.cloudfunctions.net/api

REACT_APP_FIRE_API_KEY
REACT_APP_FIRE_AUTH_DOMAIN
REACT_APP_FIRE_PROJECT_ID
REACT_APP_FIRE_STORAGE_BUCKET
REACT_APP_FIRE_MESSAGING_SENDER_ID
REACT_APP_FIRE_APP_ID
REACT_APP_FIRE_MEASUREMENT_ID
````
#### ------------------------------------------

#### default storage.rules
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth!=null;
    }
  }
}
```

#### PowerShell allow script execution (as Administrator)
````
Set-ExecutionPolicy Unrestricted
````
