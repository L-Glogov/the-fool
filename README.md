
## Current Status

The project is currently still in development and has not yet had a stable release. The actual user authentication/authorization, as well as the actual game mechanics are more or less finished, but the visual aspect of the game, including the css layout has not yet been touched.

## About

The aim of the project is to create a React based multiplayer card game not unsimiliar to a standard playing card game known to some as "Village Idiot". The plan is to host the app once finished and enable real time play via the internet.

### Firebase

The project makes use of Firebase authentication as well as the Firebase realtime database. In order for the source files to work properly and to enable multiplayer it is necessary to connect the project to Firebase. After creating an account and firebase project on https://firebase.google.com/, one should create an .env file in the main project folder of "the-fool" and set the following variables to the data acquired from Firebase:
```
REACT_APP_API_KEY=#################
REACT_APP_AUTH_DOMAIN=#################
REACT_APP_DATABASE_URL=#################
REACT_APP_PROJECT_ID=#################
REACT_APP_STORAGE_BUCKET=#################
REACT_APP_MESSAGING_SENDER_ID=#################
REACT_APP_APP_ID="#################
REACT_APP_MEASUREMENT_ID=#################
```

### Create React App

The project was initialized using the standard Create React App environment. For more information visit https://reactjs.org/docs/create-a-new-react-app.html .
