import React from 'react';
import { Route, Router, IndexRoute, browserHistory } from 'react-router';
import * as actions from 'actions';

// Components
import TonalApp from 'TonalApp';
import Landing from 'landing/Landing.jsx';
import Verify from 'landing/Verify.jsx';
import Connect from 'connect/Connect.jsx';
import Discover from 'discover/Discover.jsx';
import MyMusic from 'mymusic/MyMusic.jsx';
import TonalStore from 'tonalstore/TonalStore.jsx';

import firebase from 'app/firebase';

const store = require('store').configure();

// React-Router middleware (next allows async actions)
const requireLogin = (nextState, replace, next) => {
    const currentUser = firebase.auth().currentUser;
    if(!currentUser){
        replace('/');
    }
    next();
};

const redirectIfLoggedIn = (nextState, replace, next) => {
    const currentUser = firebase.auth().currentUser;
    if(currentUser){
        console.log(`from router/redirectIfLoggedIn: currentUser.providerId: ${currentUser.providerId}, currentUser.emailVerified: ${currentUser.emailVerified}`);
        if(currentUser.providerId == 'password' && currentUser.emailVerified ||
           currentUser.providerId == 'firebase' && currentUser){
            console.log('router: redirecting to connect since user is valid');
            replace('connect');
        }
    } else {
        console.log('router: not redirecting for some reason.', currentUser);
    }
    next();
};

export default (
    <Router history={ browserHistory }>
        <Route path="/" component={ TonalApp }>
            <IndexRoute component={ Landing } onEnter={ redirectIfLoggedIn } />
            <Route path="verify" component={ Verify } />
            <Route path="connect" component = { Connect } onEnter = { requireLogin } />
            <Route path="discover" component = { Discover } onEnter = { requireLogin } />
            <Route path="mymusic" component = { MyMusic } onEnter = { requireLogin } />
            <Route path="store" component = { TonalStore } onEnter = { requireLogin } />
        </Route>
    </Router>
);
