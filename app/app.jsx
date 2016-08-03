import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { browserHistory } from 'react-router';

var actions = require('actions');
var store = require('configureStore').configure();

import firebase from 'app/firebase/';
import router from 'app/router/';

firebase.auth().onAuthStateChanged((user) => {
    if(user){
        store.dispatch(actions.login(user.uid));
        // Dispatch an action to collect the user's stream for "connect"
        browserHistory.push('connect');
    } else {
        store.dispatch(actions.logout());
        // Dispatch an action to clear any lingering data
        browserHistory.push('/');
    }
});

// Load foundation
$(document).foundation();

// App css
require('style!css!sass!applicationStyles')

ReactDOM.render(
    <Provider store={store}>
        { router }
    </Provider>,
document.getElementById('app')
);
