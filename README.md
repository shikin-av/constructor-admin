### Constructor Admin Panel

#### https://us-central1-constructor-2de11.cloudfunctions.net/api

#### preparing
````
cd functions

npm i firebase-tools -g

firebase login

firebase use constructor-2de11
````
#### deploy Functions
````
firebase deploy --only functions:FUNCTION_NAME
````
#### deploy API
````
firebase deploy --only functions:api
````
#### deploy Admin
````
firebas deploy --only hosting
````
#### deploy .rules file
````
firebase deploy --only storage
````
#### ------------------------------------------

#### local
````
firebase emulators:start
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
#### artifact bucket
https://console.cloud.google.com/storage/browser?project=constructor-2de11