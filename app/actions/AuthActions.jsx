import firebase, { databaseRef } from 'app/firebase';
import { browserHistory } from 'react-router';
import moment from 'moment';

import {
    storeUserDataToState
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
        browserHistory.push('connect');
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
            dispatch({ type: 'RESET_USER_DATA' });
            dispatch(logoutAndPushToRootRoute());
        }, error => {
            console.log(error);
        });
    };
};

export const verifyEmailWithCode = oobCode => {
    return ((dispatch, getState) => {
        firebase.auth().applyActionCode(oobCode).then(() => {
            if (firebase.auth().currentUser){
                const currentUser = firebase.auth().currentUser;
                const defaultUser = getState().user;
                const uid = currentUser.uid;
                const email = currentUser.email;
                const displayName = '' + email.match(/^[^@]*/g)[0];
                const user = {
                    ...defaultUser,
                    uid,
                    email,
                    displayName,
                    updatedAt: moment().format('LLLL'),
                    createdAt: moment().format('LLLL')
                };
                databaseRef.child(`users/${ uid }`).update(user);
                dispatch(storeUserDataToState(user));
                dispatch(startLoginForAuthorizedUser(uid));
            }
        }, error => {
            console.log(error);
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
