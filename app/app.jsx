import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { browserHistory } from 'react-router';

import * as actions from 'actions';
import store from 'store';

import firebase from 'app/firebase/';
import router from 'app/router/';

firebase.auth().onAuthStateChanged((user) => {
    console.log("app.jsx: authState has changed!", user);
    if(user){
        console.log('app.jsx: there is a user.');
        if(user.providerId == 'facebook.com'){
            browserHistory.push('connect');
        } else {
            console.log('app.jsx: the user is logging in with a password');
            if(user.emailVerified && user.uid){
                console.log("app.jsx: user.providerId: ", user.providerData[0].providerId);
                console.log("app.jsx: email is verified, logging in user and pushing them to connect.");
                store.dispatch(login(user.uid));
                // Dispatch an action to collect the user's stream for "connect"
                browserHistory.push('connect');
            }
        }
    } else {
        console.log('app.jsx: pushing back to index since theres no user');
        // There should be a way to check if the user has ever logged in before down the road
        // (i.e. checking our own user data)
        // Dispatch an action to clear any lingering data.
        // Might want to push to a "Goodbye" marketing page.
        browserHistory.push('/');
    }
});

// Load foundation
$(document).foundation();

// App css
require('style!css!sass!applicationStyles')

ReactDOM.render(
    <Provider store={ store }>
        { router }
    </Provider>,
document.getElementById('app')
);
