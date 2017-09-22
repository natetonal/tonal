import React from 'react';
import {
    Switch,
    Route
} from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';

// Components
import TonalApp from 'TonalApp';
import Verify from 'pages/Verify';
import Landing from 'pages/Landing';
import Connect from 'pages/Connect';
import Discover from 'pages/Discover';
import MyMusic from 'pages/MyMusic';
import TonalStore from 'pages/TonalStore';
import NotFound from 'pages/NotFound';

import history from './history';

// React-Router middleware (next allows async actions)
// const requireLogin = (nextState, replace, next) => {
//     const currentUser = firebase.auth().currentUser;
//     if (!currentUser) {
//         replace('/');
//     }
//     next();
// };
//
// const redirectIfLoggedIn = (nextState, replace, next) => {
//     const currentUser = firebase.auth().currentUser;
//     if (currentUser) {
//         if ((currentUser.providerId === 'password' &&
//         currentUser.emailVerified) ||
//         (currentUser.providerId === 'firebase' && currentUser)) {
//             replace('connect');
//         }
//     }
//     next();
// };

// If needed again, add this to each route that needs it:
// onEnter={ requireLogin }

export default (
    <ConnectedRouter history={ history }>
        <Switch>
            <Route path="/" component={ TonalApp } />
            <Route exact path="/" component={ Landing } />
            <Route path="auth" component={ Verify } />
            <Route exact path="connect" component={ Connect } />
            <Route path="discover" component={ Discover } />
            <Route path="mymusic" component={ MyMusic } />
            <Route path="store" component={ TonalStore } />
            <Route component={ NotFound } />
        </Switch>
    </ConnectedRouter>
);
