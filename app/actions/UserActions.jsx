import firebase, {
    databaseRef,
    facebookAuthProvider
} from 'app/firebase';
import moment from 'moment';
import axios from 'axios';
import {
    switchLoginModalUI
} from './UIStateActions';

import {
    addErrorMessage,
    logoutAndPushToRootRoute,
    startLoginForAuthorizedUser
} from './AuthActions';

const facebookRootURI = 'https://graph.facebook.com';

export const changeStatus = (status = false) => {
    return {
        type: 'USER_DATA_STATUS',
        status
    };
};

export const storeUserDataToState = data => {
    return {
        type: 'USER_ADD_DATA',
        data
    };
};

export const toggleSettingDisplayNotifs = () => {
    return (dispatch, getState) => {
        const uid = getState().auth.uid;
        databaseRef.child(`users/${ uid }`).once('value')
        .then(snapshot => {
            const currentUser = snapshot.val();
            const currentSettings = currentUser.settings;
            const displayNotifs = currentSettings.displayNotifs;

            console.log('current value of displayNotifs: ', displayNotifs);
            const updatedUser = {
                ...currentUser,
                settings: {
                    ...currentSettings,
                    displayNotifs: !displayNotifs
                }
            };

            console.log('updated user: ', updatedUser);
            databaseRef.child(`users/${ uid }`).update(updatedUser);
            dispatch(storeUserDataToState(updatedUser));
        }, error => {
            console.log(error);
        });
    };
};

// If user is blocked, update user's blocked object and sever all following/followed connections.
// Otherwise, remove from user's blocked object. Users will have to refollow if desired.
export const updateBlockedUser = blockedUid => {
    return (dispatch, getState) => {
        const uid = getState().auth.uid;
        const userRef = databaseRef.child(`users/${ uid }/blocked`);
        userRef.once('value')
        .then(snapshot => {
            const updates = {};
            const blocked = snapshot.val() || {};

            console.log('blocked object???', blocked);
            if (Object.keys(blocked).includes(blockedUid)){
                updates[`users/${ uid }/blocked/${ blockedUid }`] = null;
                blocked[blockedUid] = null;

            } else {
                updates[`users/${ uid }/blocked/${ blockedUid }`] = moment().format('LLLL');
                updates[`followers/${ uid }/${ blockedUid }`] = null;
                updates[`following/${ uid }/${ blockedUid }`] = null;
                updates[`followers/${ blockedUid }/${ uid }`] = null;
                updates[`following/${ blockedUid }/${ uid }`] = null;
                blocked[blockedUid] = moment().format('LLLL');
            }

            databaseRef.update(updates);
            dispatch(storeUserDataToState({ blocked }));
        }, error => {
            console.log(error);
        });
    };
};

export const updateUserData = data => {
    console.log('updateUserData called with data', data);
    return (dispatch, getState) => {
        // Make sure the data we're getting passed matches the user data object keys:
        if (typeof data === 'object'){
            const userKeys = Object.keys(getState().user);
            const dataKeys = Object.keys(data);
            if (dataKeys.every(key => {
                return userKeys.includes(key);
            })) {
                console.log('updateUserData has this key, update user object');
                const uid = getState().auth.uid;
                databaseRef.child(`users/${ uid }`).once('value')
                .then(snapshot => {
                    const currentUser = snapshot.val();
                    console.log('updateUserData this user is in the db');
                    if (currentUser){
                        const user = {
                            ...currentUser,
                            ...data
                        };
                        console.log('updated obj going to db: ', user);
                        databaseRef.child(`users/${ uid }`).update(user);
                        dispatch(storeUserDataToState(user));
                    }
                }, error => {
                    console.log(error);
                });
            }
        }
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
        dispatch(changeStatus('fetching'));
        databaseRef.child(`users/${ uid }`).once('value')
        .then(snapshot => {
            const currentUser = snapshot.val();
            if (currentUser){
                const user = {
                    ...currentUser,
                    updatedAt: moment().format('LLLL')
                };
                dispatch(storeUserDataToState(user));
                dispatch(changeStatus('success'));
            } else {
                console.log('Ain\'t no user with them there credentials in yon database. back to the pile!');
                dispatch(changeStatus());
                dispatch(logoutAndPushToRootRoute());
            }
        }, error => {
            console.log(error);
            dispatch(changeStatus('error'));
        });
    };
};

// Sync specific parts of user object with database.
export const syncUserData = (keys = false) => {
    return (dispatch, getState) => {
        console.log('syncUserData called with keys: ', keys);
        const uid = getState().auth.uid;

        if (!keys){
            dispatch(fetchUserData(uid));
        }

        databaseRef.child(`users/${ uid }`).once('value')
        .then(snapshot => {
            const dbUser = snapshot.val();
            const updatedUser = getState().user;

            if (dbUser){
                keys.forEach(key => {
                    if (Object.keys(updatedUser).includes(key) &&
                        Object.keys(dbUser).includes(key)){
                        updatedUser[key] = dbUser[key];
                    }
                });
                updatedUser.updatedAt = moment().format('LLLL');
                dispatch(storeUserDataToState(updatedUser));
            }
        }, error => {
            console.log(error);
            dispatch(changeStatus('error'));
        });
    };
};

// split create and login into two separate actions.
export const createUserWithFacebookAuth = () => {
    console.log('createUserWithFacebookAuth / fetching user data');
    return (dispatch, getState) => {
        dispatch(changeStatus('fetching'));
        firebase.auth().signInWithPopup(facebookAuthProvider)
        .then(result => {
            if (result.credential){
                console.log('result: ', result);
                const token = result.credential.accessToken;
                const firebaseUser = result.user;
                const uid = firebaseUser.uid;

                const blankUser = getState().user;
                let user = {
                    ...blankUser,
                    uid,
                    authMethod: 'facebook',
                    fbToken: token,
                    email: firebaseUser.email,
                    emailVerified: true,
                    username: firebaseUser.email.match(/^[^@]*/g)[0],
                    displayName: firebaseUser.displayName,
                    avatar: firebaseUser.photoURL,
                };

                // Something like this needs to happen
                databaseRef.child('users')
                .orderByChild('email')
                .equalTo(firebaseUser.email)
                .once('value')
                .then(snapshot => {

                    // If snapshot.val(), this user's already there.
                    // Update the sign-in time, populate with known data, update FB token.
                    console.log('response from our server: ', snapshot.val());

                    if (snapshot.val()){
                        const currentUser = snapshot.val()[uid];
                        dispatch(changeStatus('success'));

                        user = {
                            ...currentUser,
                            status: getState().user.status,
                            fbToken: token,
                            updatedAt: moment().format('LLLL')
                        };

                        dispatch(storeUserDataToState(user));
                        dispatch(startLoginForAuthorizedUser(uid));
                        databaseRef.child(`users/${ uid }`).update(user);
                        console.log('user: ', user);

                    } else {
                        axios.get(`${ facebookRootURI }/me`, {
                            params: {
                                access_token: token,
                                fields: 'first_name, last_name, email, timezone, picture.width(300), location'
                            }
                        })
                        .then(response => {

                            console.log('response from facebook: ', response.data);
                            dispatch(changeStatus('success'));

                            const email = response.data.email ? response.data.email : firebaseUser.email;
                            const username = email.match(/^[^@]*/g)[0];
                            const location = response.data.location ? response.data.location.name : '';
                            const firstName = response.data.first_name ? response.data.first_name : '';
                            const lastName = response.data.last_name ? response.data.last_name : '';
                            const timeZone = response.data.timezone ? response.data.timezone : '';
                            const avatar = response.data.picture ?
                                response.data.picture.data.url :
                                firebaseUser.photoURL;

                            user = {
                                ...user,
                                email,
                                username,
                                location,
                                firstName,
                                lastName,
                                timeZone,
                                avatar,
                                status: getState().user.status,
                                updatedAt: moment().format('LLLL')
                            };

                            dispatch(storeUserDataToState(user));
                            dispatch(startLoginForAuthorizedUser(uid));
                            databaseRef.child(`users/${ uid }`).update(user);
                            console.log('updated user: ', user);

                        })
                        .catch(error => {
                            // Something went wrong with the call to facebook's API:
                            console.log('Something went wrong with the call to facebook API:', error);
                            dispatch(changeStatus('error'));
                        });
                    }
                })
                .catch(error => {
                    // Something went wrong checking firebase for this user:
                    console.log('Something went wrong checking firebase for this user:', error);
                });
            }
        }, error => {
            // Something went wrong with the initial auth with facebook:
            console.log('Something went wrong with the initial auth with facebook:', error);
            return dispatch(addErrorMessage(error.message));
        });
    };
};
