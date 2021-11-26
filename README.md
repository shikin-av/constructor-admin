### Constructor Admin Panel

#### local
http://localhost:5001/constructor-2de11/us-central1/api

http://localhost:3000/

#### production
https://us-central1-constructor-2de11.cloudfunctions.net/api

https://constructor-admin.web.app/

#### artifact bucket
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
#### deploy Admin
````
firebas deploy --only hosting:constructor-admin
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
