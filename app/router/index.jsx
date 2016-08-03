import React from 'react';
import { Route, Router, IndexRoute, browserHistory } from 'react-router';

// Components
import TonalApp from 'TonalApp';
import Login from 'auth/Login.jsx';
import Connect from 'connect/Connect.jsx';
import Discover from 'discover/Discover.jsx';
import MyMusic from 'mymusic/MyMusic.jsx';
import TonalStore from 'tonalstore/TonalStore.jsx';

// Database
import firebase from 'app/firebase';

// React-Router middleware (next allows async actions)
const requireLogin = (nextState, replace, next) => {
    if(!firebase.auth().currentUser){
        // replace is similar to browserHistory.push()
        replace('/');
    }
    next();
};

const redirectIfLoggedIn = (nextState, replace, next) => {
    if(firebase.auth().currentUser){
        replace('connect');
    }
    next();
};

export default (
    <Router history={ browserHistory }>
        <Route path="/" component={ TonalApp }>
            <IndexRoute component={ Login } onEnter={ redirectIfLoggedIn } />
            <Route path="connect" component = { Connect } onEnter = { requireLogin } />
            <Route path="discover" component = { Discover } onEnter = { requireLogin } />
            <Route path="mymusic" component = { MyMusic } onEnter = { requireLogin } />
            <Route path="store" component = { TonalStore } onEnter = { requireLogin } />
        </Route>
    </Router>
);
