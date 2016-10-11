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

    if(user.providerData[0]){

        const providerData = user.providerData[0];

        switch(providerData.providerId){
            case 'facebook.com':
                if(providerData.uid){
                    store.dispatch(actions.storeFacebookDataToState(providerData));
                    store.dispatch(actions.startLoginForAuthorizedUser(providerData.uid));
                }
                break;
            case 'password':
            case 'firebase':
                user.emailVerified && user.uid && store.dispatch(actions.startLoginForAuthorizedUser(user.uid));
                break;
            default:
                store.dispatch(actions.pushToRoute('/'));
        }

    } else {
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
