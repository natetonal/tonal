import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import router from 'app/router/';
import firebase from 'app/firebase';
import * as actions from 'actions';

const store = require('store').configure();

// Load foundation
$(document).foundation();

// Loaders for css & sass
require('style!css!sass!applicationStyles')

firebase.auth().onAuthStateChanged((user) => {
    console.log('app.jsx: auth state changed: ', user);

    if(user.providerData[0]){

        const providerData = user.providerData[0];

        switch(providerData.providerId){
            case 'facebook.com':
                console.log('app.jsx: user is facebook verified: logging in.');
                if(providerData.uid){
                    console.log('app.jsx: user has a UID, storing data: ', providerData);
                    store.dispatch(actions.storeFacebookDataToState(providerData));
                    store.dispatch(actions.startLoginForAuthorizedUser(providerData.uid));
                }
                break;
            case 'password':
            case 'firebase':
                console.log('app.jsx: user is firebase/password verified: logging in');
                user.emailVerified && user.uid && store.dispatch(actions.startLoginForAuthorizedUser(user.uid));
                break;
            default:
                console.log('app.jsx: there was a problem logging in.')
                store.dispatch(actions.pushToRoute('/'));
        }

    } else {
        console.log('from app.jsx: pushing back to index since theres no user');
        // There should be a way to check if the user has ever logged in before down the road
        // (i.e. checking our own user data)
        // Dispatch an action to clear any lingering data.
        // Might want to push to a "Goodbye" marketing page.
        store.dispatch(actions.pushToRoute('/'));
    }
});

ReactDOM.render(
    <Provider store={ store }>
        { router }
    </Provider>,
document.getElementById('app')
);
