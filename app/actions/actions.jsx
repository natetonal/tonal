// This will be where to import the Facebook login, as well.
import firebase, { databaseRef, storageRef, facebookAuthProvider } from 'app/firebase/';
import { browserHistory } from 'react-router';
import moment from 'moment';
import axios from 'axios';

const facebookRootURI = 'https://graph.facebook.com';

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

export const resetErrorMessage = () => {
    return {
        type: 'RESET_ERROR_MESSAGE'
    };
};

export const addErrorMessage = error => {
    return {
        type: 'ADD_ERROR_MESSAGE',
        error
    };
};

export const switchLoginModalUI = loginModalUI => {
    return {
        type: 'UI_SWITCH_LOGIN_MODAL',
        loginModalUI
    };
};

// UI TOGGLES

export const toggleLoginModal = () => {
    return {
        type: 'UI_TOGGLE_LOGIN_MODAL',
    };
};
export const toggleMenu = () => {
    return {
        type: 'UI_TOGGLE_MENU'
    };
};

export const toggleSearch = () => {
    return {
        type: 'UI_TOGGLE_SEARCH'
    };
};

export const toggleNotifs = () => {
    return {
        type: 'UI_TOGGLE_NOTIFS'
    };
};

export const toggleCompose = () => {
    return {
        type: 'UI_TOGGLE_COMPOSE'
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

export const resetUIState = () => {
    return {
        type: 'RESET_UI_STATE'
    };
};

export const pushToRoute = route => {
    return () => {
        browserHistory.push(route);
    };
};

export const storeUserDataToState = data => {
    return {
        type: 'ADD_USER_DATA',
        data
    };
};

export const startLoginForAuthorizedUser = uid => {
    return (dispatch => {
        dispatch(login(uid));
        dispatch(pushToRoute('connect'));
    });
};

export const logoutAndPushToRootRoute = () => {
    return (dispatch => {
        dispatch(logout());
        dispatch(pushToRoute('/'));
    });
};

export const getImgUrl = path => {
    return (dispatch, getState => {
        const imgRef = storageRef.child(`assets/${ path }`);
        imgRef.getDownloadURL().then(imgUrl => {
            if (imgUrl){
                dispatch({
                    type: 'GET_IMG_URL',
                    imgUrl
                });
            }
        }).catch(error => {
        });
    });
};

export const verifyEmailWithCode = oobCode => {
    return (dispatch, getState => {
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
        });
    });
};

export const verifyPasswordResetCode = oobCode => {
    return (dispatch => {
        firebase.auth().verifyPasswordResetCode(oobCode).then(email => {
            dispatch(storeUserDataToState({ email }));
            dispatch(storeVerifiedEmailCode(oobCode));
        }, error => {
        });
    });
};

export const resetPasswordAndLoginUser = (oobCode, email, password) => {
    return (dispatch => {
        return firebase.auth().confirmPasswordReset(oobCode, password).then(() => {
            dispatch(startEmailLogin(email, password));
        }, error => {
            dispatch(addErrorMessage(error.message));
        });
    });
};

export const startLogout = () => {
    return (dispatch => {
        firebase.auth().signOut().then(() => {
            dispatch({ type: 'RESET_USER_DATA' });
            dispatch(logoutAndPushToRootRoute());
        }, error => {
        });
    });
};

export const sendVerificationEmail = user => {
    return (dispatch => {
        return user.sendEmailVerification().then(() => {
            dispatch(switchLoginModalUI('email-sent-verify'));
        }, error => {
        });
    });
};

export const sendPasswordResetEmail = email => {
    return (dispatch => {
        return firebase.auth().sendPasswordResetEmail(email).then(() => {
            dispatch(switchLoginModalUI('email-sent-password'));
        }, error => {
            return dispatch(addErrorMessage(error.message));
        });
    });
};

export const createUserWithEmailAndPassword = (email, password) => {
    return (dispatch => {
        return firebase.auth().createUserWithEmailAndPassword(email, password).then(user => {
            return dispatch(sendVerificationEmail(user));
        }, error => {
            return dispatch(addErrorMessage(error.message));
        });
    });
};

// This needs to be edited to accommodate FB & user/email login:
export const startEmailLogin = (email, password) => {
    return (dispatch => {
        return firebase.auth().signInWithEmailAndPassword(email, password).then(result => {
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
    });
};

export const fetchUserData = uid => {
    return ((dispatch, getState) => {
        databaseRef.child(`users/${ uid }`).once('value').then(snapshot => {
            if (snapshot.val()){
                const user = {
                    uid: snapshot.val().uid,
                    fbToken: snapshot.val().fbToken,
                    email: snapshot.val().email,
                    firstName: snapshot.val().firstName,
                    lastName: snapshot.val().lastName,
                    displayName: snapshot.val().displayName,
                    timeZone: snapshot.val().timeZone,
                    avatarPhoto: snapshot.val().avatarPhoto,
                    updatedAt: snapshot.val().updatedAt
                };
                dispatch(storeUserDataToState(user));
            }
        }, error => {
        });
    });
};

export const createUserWithFacebookAuth = () => {
    return ((dispatch, getState) => {
        firebase.auth().signInWithPopup(facebookAuthProvider).then(result => {
            if (result.credential){

                const token = result.credential.accessToken;
                const firebaseUser = result.user;
                const uid = firebaseUser.uid;


                const user = {
                    uid,
                    fbToken: token,
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName,
                    avatarPhoto: firebaseUser.photoURL,
                    updatedAt: moment().format('LLLL'),
                    createdAt: moment().format('LLLL')
                };

                databaseRef.child(`users/${ uid }`).update(user);
                dispatch(storeUserDataToState(user));
                dispatch(startLoginForAuthorizedUser(uid));

                axios.get(`${ facebookRootURI }/me`, {
                    params: {
                        access_token: token,
                        fields: 'first_name, last_name, email, timezone, picture.width(300)'
                    }
                })
                .then(response => {

                    const updatedUser = {
                        ...user,
                        email: response.data.email,
                        firstName: response.data.first_name,
                        lastName: response.data.last_name,
                        timeZone: response.data.timezone,
                        avatarPhoto: response.data.picture.data.url,
                        updatedAt: moment().format('LLLL')
                    };

                    databaseRef.child(`users/${ uid }`).update(updatedUser);
                    dispatch(storeUserDataToState(updatedUser));

                })
                .catch(error => {
                });
            }
        }, error => {
            return dispatch(addErrorMessage(error.message));
        });
    });
};

// EmojiSelection actions:

export const EmojiSelectionChangeTab = tab => {
    return {
        type: 'ES_CHANGE_TAB',
        tab
    };
};

export const EmojiSelectionChangeTabTitle = tabTitle => {
    return {
        type: 'ES_CHANGE_TAB_TITLE',
        tabTitle
    };
};

export const EmojiSelectionChangeTitleDisplay = titleDisplay => {
    return {
        type: 'ES_CHANGE_TITLE_DISPLAY',
        titleDisplay
    };
};

export const EmojiSelectionSearchText = searchText => {
    return {
        type: 'ES_SEARCH_TEXT',
        searchText
    };
};

export const EmojiSelectionChangeEmoji = emoji => {
    return {
        type: 'ES_CHANGE_EMOJI',
        emoji
    };
};
