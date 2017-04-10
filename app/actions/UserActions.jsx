import firebase, { databaseRef, facebookAuthProvider } from 'app/firebase';
import moment from 'moment';
import axios from 'axios';

import {
    switchLoginModalUI
} from './UIStateActions';

import {
    addErrorMessage,
    startLoginForAuthorizedUser
} from './AuthActions';

const facebookRootURI = 'https://graph.facebook.com';

export const storeUserDataToState = data => {
    return {
        type: 'ADD_USER_DATA',
        data
    };
};

export const sendVerificationEmail = user => {
    return dispatch => {
        return user.sendEmailVerification()
        .then(() => {
            dispatch(switchLoginModalUI('email-sent-verify'));
        }, error => {
            console.log(error);
        });
    };
};

export const sendPasswordResetEmail = email => {
    return dispatch => {
        return firebase.auth().sendPasswordResetEmail(email)
        .then(() => {
            dispatch(switchLoginModalUI('email-sent-password'));
        }, error => {
            return dispatch(addErrorMessage(error.message));
        });
    };
};

export const createUserWithEmailAndPassword = (email, password) => {
    return dispatch => {
        return firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(user => {
            return dispatch(sendVerificationEmail(user));
        }, error => {
            return dispatch(addErrorMessage(error.message));
        });
    };
};

export const fetchUserData = uid => {
    return dispatch => {
        databaseRef.child(`users/${ uid }`).once('value')
        .then(snapshot => {
            if (snapshot.val()){
                const user = {
                    uid: snapshot.val().uid,
                    fbToken: snapshot.val().fbToken,
                    email: snapshot.val().email,
                    firstName: snapshot.val().firstName,
                    lastName: snapshot.val().lastName,
                    displayName: snapshot.val().displayName,
                    timeZone: snapshot.val().timeZone,
                    avatar: snapshot.val().avatar,
                    updatedAt: snapshot.val().updatedAt
                };
                dispatch(storeUserDataToState(user));
            }
        }, error => {
            console.log(error);
        });
    };
};

// split create and login into two separate actions.
export const createUserWithFacebookAuth = () => {
    return (dispatch, getState) => {
        firebase.auth().signInWithPopup(facebookAuthProvider)
        .then(result => {
            if (result.credential){
                console.log('result: ', result);
                const token = result.credential.accessToken;
                const firebaseUser = result.user;
                const uid = firebaseUser.uid;

                const blankUser = getState().user;
                const user = {
                    ...blankUser,
                    uid,
                    fbToken: token,
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName,
                    avatar: firebaseUser.photoURL,
                };

                databaseRef.child('users')
                    .orderByChild('email')
                    .equalTo(firebaseUser.email)
                    .once('value', snap => {
                        console.log('snapshot val: ', snap.val());
                    });

                console.log('user: ', user);
                databaseRef.child(`users/${ uid }`).update(user);
                dispatch(storeUserDataToState(user));
                dispatch(startLoginForAuthorizedUser(uid));

                axios.get(`${ facebookRootURI }/me`, {
                    params: {
                        access_token: token,
                        fields: 'first_name, last_name, email, timezone, picture.width(300), location'
                    }
                })
                .then(response => {

                    console.log('response.data: ', response.data);
                    const updatedUser = {
                        ...user,
                        email: response.data.email,
                        firstName: response.data.first_name,
                        lastName: response.data.last_name,
                        timeZone: response.data.timezone,
                        avatar: response.data.picture.data.url,
                        updatedAt: moment().format('LLLL')
                    };

                    databaseRef.child(`users/${ uid }`).update(updatedUser);
                    dispatch(storeUserDataToState(updatedUser));
                    console.log('updated user: ', updatedUser);

                })
                .catch(error => {
                    console.log(error);
                });
            }
        }, error => {
            return dispatch(addErrorMessage(error.message));
        });
    };
};
