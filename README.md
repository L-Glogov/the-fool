
## Current Status

The project is currently at v.1.0.

## About

This is a multiplayer game not unsimillar to a card game known to some as "Village Idiot". Unfortuantely, as of now there is no AI implemented, so it is only possible to play online multiplayer

### Game Rules

    You start with 13 cards. 4 cards face down which nobody sees. 4 cards face up which everybody can see and 5 cards in your hand which only you can see.
    On your turn you can play any card (or multiple of the same card), as long as it is higher, or equal to, than the top card of the stack.
    As long as you still have cards in your hand you can only play cards from there. You then play the face up cards - one card at a time.
    After finishing your face up cards, you play your face down cards, picking them blindly.
    If you cannot play any card that is higher, or equal to, the top card of the stack you take the entire stack to your hand, and must now get rid of your hand again to be able to play the face up or face down cards.
    There are 4 types of special cards in the game. The bomb card can be played on any other card and removes the stack to the graveyard. The magic card can be played on anything and is invisible, which means only the card underneath is important for the next player. The Bishop card adheres to the standard hierarchy rules, but also resureccts a random card from the graveyard (provided that there are any) and places it at the top of the stack. Finally, the fool card can be played over anything, and any card can be played on it.

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
