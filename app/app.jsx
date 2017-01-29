import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import router from 'app/router/';
import firebase from 'app/firebase';
import * as actions from 'actions';
import configure from './store/configureStore';
import DevTools from './containers/DevTools';

let DevToolsC = null;
if (process.env.NODE_ENV === 'development') {
  DevToolsC = DevTools;
}

const store = configure();

// Load foundation
$(document).foundation(); // eslint-disable-line

// Loaders for css & sass
require('style!css!sass!applicationStyles'); // eslint-disable-line

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    const providerId = user.providerData[0].providerId;
    if ((providerId === 'facebook.com' ||
       providerId === 'password') && user.emailVerified) {
      store.dispatch(actions.fetchUserData(user.uid));
      store.dispatch(actions.startLoginForAuthorizedUser(user.uid));
    }
  }
  // } else {
  //     // There should be a way to check if the user has ever logged in before down the road
  //     // (i.e. checking our own user data)
  //     // Dispatch an action to clear any lingering data.
  //     // Might want to push to a "Goodbye" marketing page.
  //     store.dispatch(actions.pushToRoute('/'));
  // }
});

ReactDOM.render(
  <Provider store={store}>
    <div>
      {router}
      {process.env.NODE_ENV === 'development' &&
        <DevToolsC />
      }
    </div>
    <h2> Hola</h2>
  </Provider>,
  document.getElementById('tonal')
);
