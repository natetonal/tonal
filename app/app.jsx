import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import firebase from 'app/firebase';
import * as actions from 'actions';
import configure from './store/configureStore';
import Root from './containers/Root';

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

render(
    <AppContainer>
        <Root store={ store } />
    </AppContainer>,
    document.getElementById('tonal')
);

if (module.hot) {
    module.hot.accept('./containers/Root', () => {
        const RootContainer = require('./containers/Root').default;
        render(
            <AppContainer>
                <RootContainer
                    store={ store }
                />
            </AppContainer>,
            document.getElementById('tonal')
        );
    });
}
