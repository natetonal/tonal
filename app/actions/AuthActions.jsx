import firebase, { databaseRef } from 'app/firebase';
import { pushToRoute } from './RouteActions';
import moment from 'moment';

import {
    storeUserDataToState,
    changeStatus
} from './UserActions';

export const login = uid => {
    return {
        type: 'LOGIN',
        uid
    };
};

export const logout = () => {
    return {
        type: 'LOGOUT'
    };
};

export const storeVerifiedEmailCode = oobCode => {
    return {
        type: 'VERIFIED_EMAIL_CODE',
        oobCode
    };
};

export const resetAuthState = () => {
    return {
        type: 'RESET_AUTH_STATE'
    };
};

export const resetErrorMessage = () => {
    return {
        type: 'RESET_LOGIN_ERROR'
    };
};

export const addErrorMessage = error => {
    return {
        type: 'ADD_LOGIN_ERROR',
        error
    };
};

export const startLoginForAuthorizedUser = uid => {
    return dispatch => {
        dispatch(login(uid));
        dispatch(pushToRoute('/connect'));
    };
};

export const startEmailLogin = (email, password) => {
    return dispatch => {
        return firebase.auth().signInWithEmailAndPassword(email, password)
        .then(result => {
            if (!result.emailVerified){
                dispatch(addErrorMessage(
                    'You have not verified your e-mail address. Please check your inbox for a verification e-mail from Tonal.'
                ));
            } else {
                dispatch(startLoginForAuthorizedUser(result.uid));
            }
        }, error => {
            return dispatch(addErrorMessage(error.message));
        });
    };
};

export const logoutAndPushToRootRoute = () => {
    return dispatch => {
        dispatch(logout());
        browserHistory.push('/');
    };
};

export const startLogout = () => {
    return dispatch => {
        firebase.auth().signOut().then(() => {
            dispatch({ type: 'USER_RESET_DATA' });
            dispatch(logoutAndPushToRootRoute());
        }, error => {
            console.log(error);
        });
    };
};

export const verifyEmailWithCode = oobCode => {
    console.log('verifyEmailWithCode / called');
    return ((dispatch, getState) => {
        dispatch(changeStatus('fetching'));
        firebase.auth().applyActionCode(oobCode).then(() => {
            console.log('verifyEmailWithCode / oobCode applied.');
            if (firebase.auth().currentUser){
                dispatch(changeStatus('success'));
                console.log('verifyEmailWithCode / currentUser exists');
                const currentUser = firebase.auth().currentUser;
                const defaultUser = getState().user;
                const uid = currentUser.uid;
                const email = currentUser.email;
                const displayName = '' + email.match(/^[^@]*/g)[0];
                const username = displayName;
                const user = {
                    ...defaultUser,
                    uid,
                    email,
                    displayName,
                    username,
                    updatedAt: moment().format('LLLL'),
                    createdAt: moment().format('LLLL')
                };
                databaseRef.child(`users/${ uid }`).update(user);
                dispatch(storeUserDataToState(user));
                dispatch(startLoginForAuthorizedUser(uid));
            } else {
                console.log('verifyEmailWithCode / no currentUser was found.');
            }
        }, error => {
            console.log('verifyEmailWithCode / error: ', error);
        });
    });
};

export const verifyPasswordResetCode = oobCode => {
    return dispatch => {
        firebase.auth().verifyPasswordResetCode(oobCode).then(email => {
            dispatch(storeUserDataToState({ email }));
            dispatch(storeVerifiedEmailCode(oobCode));
        }, error => {
            console.log(error);
        });
    };
};

export const resetPasswordAndLoginUser = (oobCode, email, password) => {
    return dispatch => {
        return firebase.auth().confirmPasswordReset(oobCode, password)
        .then(() => {
            dispatch(startEmailLogin(email, password));
        }, error => {
            dispatch(addErrorMessage(error.message));
        });
    };
};
