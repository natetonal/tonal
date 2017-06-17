import React from 'react';
import { Route, Router, IndexRoute, browserHistory } from 'react-router';

// Components
import TonalApp from 'TonalApp';
import Verify from 'pages/Verify';
import Landing from 'pages/Landing';
import Connect from 'pages/Connect';
import Discover from 'pages/Discover';
import MyMusic from 'pages/MyMusic';
import TonalStore from 'pages/TonalStore';
import NotFound from 'pages/NotFound';

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

const requireLogin = () => {

};

const redirectIfLoggedIn = () => {

};

export default (
    <Router history={ browserHistory }>
        <Route path="/" component={ TonalApp }>
            <IndexRoute component={ Landing } onEnter={ redirectIfLoggedIn } />
            <Route path="auth" component={ Verify } />
            <Route path="connect" component={ Connect } onEnter={ requireLogin } />
            <Route path="discover" component={ Discover } onEnter={ requireLogin } />
            <Route path="mymusic" component={ MyMusic } onEnter={ requireLogin } />
            <Route path="store" component={ TonalStore } onEnter={ requireLogin } />
            <Route path="*" component={ NotFound } />
        </Route>
    </Router>
);
