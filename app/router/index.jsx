import React from 'react';
import { Route, Router, IndexRoute, browserHistory } from 'react-router';

// Components
import TonalApp from 'TonalApp';
import Landing from 'landing/Landing.jsx';
import Connect from 'connect/Connect.jsx';
import Discover from 'discover/Discover.jsx';
import MyMusic from 'mymusic/MyMusic.jsx';
import TonalStore from 'tonalstore/TonalStore.jsx';

import firebase from 'app/firebase';

// React-Router middleware (next allows async actions)
const requireLogin = (nextState, replace, next) => {
  const currentUser = firebase.auth().currentUser;
  if (!currentUser) {
    replace('/');
  }
  next();
};

const redirectIfLoggedIn = (nextState, replace, next) => {
  const currentUser = firebase.auth().currentUser;
  if (currentUser) {
    if ((currentUser.providerId === 'password' &&
        currentUser.emailVerified) ||
       (currentUser.providerId === 'firebase' && currentUser)) {
      replace('connect');
    }
  }
  next();
};

export default (
  <Router history={browserHistory}>
    <Route path="/" component={TonalApp}>
      <IndexRoute component={Landing} onEnter={redirectIfLoggedIn} />
      <Route path="auth" component={Landing} />
      <Route path="connect" component={Connect} onEnter={requireLogin} />
      <Route path="discover" component={Discover} onEnter={requireLogin} />
      <Route path="mymusic" component={MyMusic} onEnter={requireLogin} />
      <Route path="store" component={TonalStore} onEnter={requireLogin} />
    </Route>
  </Router>
);
