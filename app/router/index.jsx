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
import * as store from 'store';

// React-Router middleware (next allows async actions)
const requireLogin = (nextState, replace, next) => {
    const currentUser = firebase.auth().currentUser;
    if(!currentUser){
        // replace is similar to browserHistory.push()
        console.log('router: redirecting to / since user is not valid');
        replace('/');
    }
    next();
};

const redirectIfLoggedIn = (nextState, replace, next) => {
    const currentUser = firebase.auth().currentUser;
    if(currentUser){
        console.log(`from redirectIfLoggedIn: currentUser.providerId: ${currentUser.providerId}, currentUser.emailVerified: ${currentUser.emailVerified}`);
        if(currentUser.providerId == 'password' && currentUser.emailVerified ||
           currentUser.providerId == 'firebase' && currentUser){
            console.log('router: redirecting to connect since user is valid');
            replace('connect');
        }
    }
    next();
};

const verifyUserEmail = (nextState, replace, next) => {
    const { mode, oobCode } = nextState.location.query;
    console.log("router: mode & oobCode from verifyUserEmail: ", mode, oobCode);
        if(mode == 'verifyEmail' && oobCode){
            store.dispatch(actions.verifyEmailWithCode(oobCode)).then((success) => {
                browserHistory.push('connect');
            }, (error) => {
                browserHistory.push('/');
            });
        } else {
            replace('/');
        }
    next();
}

export default (
    <Router history={ browserHistory }>
        <Route path="/" component={ TonalApp }>
            <IndexRoute component={ Landing } onEnter={ redirectIfLoggedIn } />
            <Route path="verify" component={ Verify } onEnter={ verifyUserEmail } />
            <Route path="connect" component = { Connect } onEnter = { requireLogin } />
            <Route path="discover" component = { Discover } onEnter = { requireLogin } />
            <Route path="mymusic" component = { MyMusic } onEnter = { requireLogin } />
            <Route path="store" component = { TonalStore } onEnter = { requireLogin } />
        </Route>
    </Router>
);
