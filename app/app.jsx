import 'applicationStyles';

import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import $ from 'jquery';
import firebase from 'app/firebase';
import { fetchUserData } from 'actions/UserActions';

import {
    startLoginForAuthorizedUser,
    startLogout
} from 'actions/AuthActions';
import configure from './store/configureStore';
import Root from './containers/Root';

const store = configure();

$(document).foundation();

firebase.auth().onAuthStateChanged(user => {

    // We only want the observer to initiate auth if the app isn't.
    const userStatus = store.getState().user.status;

    console.log('onAuthStateChanged / state changed: ', user);
    console.log('onAuthStateChanged / user status?: ', userStatus);

    if (!userStatus){

        console.log('onAuthStateChanged / user status is false.');
        if (user) {
            console.log('onAuthStateChanged / but there is a user.');
            const providerId = user.providerData[0].providerId;
            if (providerId === 'facebook.com' ||
            (providerId === 'password' && user.emailVerified)) {
                console.log('onAuthStateChanged / uid: ', user.uid);
                store.dispatch(fetchUserData(user.uid));
                store.dispatch(startLoginForAuthorizedUser(user.uid));
            }
        } else {
            console.log('no user object: logging user out.');
            // There should be a way to check if the user has ever logged in before down the road
            // (i.e. checking our own user data)
            // Dispatch an action to clear any lingering data.
            // Might want to push to a "Goodbye" marketing page.
            store.dispatch(startLogout());
        }
    }
});

const renderWithHMR = () => {
    render(
        <AppContainer>
            <Root store={ store } />
        </AppContainer>,
        document.getElementById('tonal')
    );
};

renderWithHMR();

console.log('Module hot? ', module.hot);
if (module.hot) {
    module.hot.accept('./containers/Root', () => { renderWithHMR(); });
}
