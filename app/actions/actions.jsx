// This will be where to import the Facebook login, as well.
import firebase, { databaseRef, storageRef, facebookAuthProvider } from 'app/firebase/';
import { browserHistory } from 'react-router';
import moment from 'moment';
import axios from 'axios';

const facebookRootURI = 'https://graph.facebook.com';

export const login = (uid) => {
    return{
        type: 'LOGIN',
        uid
    };
};

export const logout = () => {
    return{
        type: 'LOGOUT'
    };
};

export const resetErrorMessage = () => {
    return{
        type: 'RESET_ERROR_MESSAGE'
    };
};

export const addErrorMessage = (error) => {
    return{
        type: 'ADD_ERROR_MESSAGE',
        error
    };
};

export const toggleLoginModal = () => {
    return{
        type: 'TOGGLE_LOGIN_MODAL',
    };
};


export const switchLoginModalUI = (loginModalUI) => {
    return{
        type: 'SWITCH_LOGIN_MODAL_UI',
        loginModalUI
    };
};

export const toggleMenu = () => {
    return{
        type: 'TOGGLE_MENU'
    };
};

export const toggleSearch = () => {
    return{
        type: 'TOGGLE_SEARCH'
    };
};

export const storeVerifiedEmailCode = (oobCode) => {
    return{
        type: 'VERIFIED_EMAIL_CODE',
        oobCode
    };
};

export const resetAuthState = () => {
    return{
        type: 'RESET_AUTH_STATE'
    };
};

export const resetUIState = () => {
    return{
        type: 'RESET_UI_STATE'
    };
};

export const pushToRoute = (route) => {
    return () => {
        browserHistory.push(route);
    };
};

export const storeUserDataToState = (data) => {
    console.log('actions.jsx: adding user data to state', data);
    return{
        type: 'ADD_USER_DATA',
        data
    };
};

export const startLoginForAuthorizedUser = (uid) => {
    return (dispatch) => {
        console.log('actions.jsx/sLFAU: starting login for authorized user');
        dispatch(login(uid));
        dispatch(pushToRoute('connect'));
    };
};

export const logoutAndPushToRootRoute = () => {
    return (dispatch) => {
        dispatch(logout());
        dispatch(pushToRoute('/'));
    };
};

export const getImgUrl = (path) => {
    return(dispatch, getState) => {
        console.log('actions: getImgUrl request received.');
        var imgRef = storageRef.child(`assets/${path}`);
        imgRef.getDownloadURL().then(imgUrl => {
            if(imgUrl){
                console.log('actions: imgUrl returned: ', imgUrl);
                dispatch({
                    type: 'GET_IMG_URL',
                    imgUrl
                });
            }
        }).catch(error => {
            console.log('actions: There was an error fetching an image: ', error);
        });
    };
};

export const verifyEmailWithCode = (oobCode) => {
    return (dispatch, getState) => {
        firebase.auth().applyActionCode(oobCode).then((success) => {
            if(firebase.auth().currentUser){
                const currentUser = firebase.auth().currentUser;
                const defaultUser = getState().user;
                const uid = currentUser.uid;
                const email = currentUser.email;
                const displayName = "" + email.match(/^[^@]*/g)[0];
                const user = {
                    ...defaultUser,
                    uid,
                    email,
                    displayName,
                    updatedAt: moment().format('LLLL'),
                    createdAt: moment().format('LLLL')
                };
                databaseRef.child(`users/${uid}`).update(user);
                dispatch(storeUserDataToState(user));
                dispatch(startLoginForAuthorizedUser(uid));
            }
        }, (error) => {
            console.log("router: Problem verifying email: ", error);
        });
    }
};

export const verifyPasswordResetCode = (oobCode) => {
    return (dispatch) => {
        firebase.auth().verifyPasswordResetCode(oobCode).then((email) => {
            console.log('actions.jsx: password reset code verified for user ', email);
            dispatch(storeUserDataToState({ email }));
            dispatch(storeVerifiedEmailCode(oobCode));
        }, (error) => {
            console.log('actions.jsx: problem resetting you password: ', error.message);
        });
    }
};

export const resetPasswordAndLoginUser = (oobCode, email, password) => {
    return (dispatch) => {
        console.log('actions/resetPasswordAndLoginUser: resetting PW for ', email);
        console.log('actions/resetPasswordAndLoginUser: PW: ', password);
        console.log('actions/resetPasswordAndLoginUser: oobCode: ', oobCode);
        firebase.auth().confirmPasswordReset(oobCode, password).then((success) => {
            console.log('actions.jsx: password reset confirmed, logging you in');
            dispatch(startEmailLogin(email, password));
        }, (error) => {
            console.log('actions.jsx: problem resetting your password with FB: ', error.message);
            dispatch(addErrorMessage(error.message));
        });
    }
};

export const startLogout = () => {
    return (dispatch) => {
        firebase.auth().signOut().then((success) => {
            console.log('actions: user signed out in firebase, signing out in app.', success);
            dispatch({ type: 'RESET_USER_DATA' });
            dispatch(logoutAndPushToRootRoute());
        }, (error) => {
            console.log('actions: there was a problem signing out');
        });
    };
};

export const sendVerificationEmail = (user) => {
    return (dispatch) => {
        return user.sendEmailVerification().then(() => {
            console.log("actions: Verification has been sent to ", user.email);
            dispatch(switchLoginModalUI('email-sent-verify'));
        }, (error) => {
            console.log("actions: Error sending user verification email: ", error);
        });
    }
};

export const sendPasswordResetEmail = (email) => {
    return (dispatch) => {
        return firebase.auth().sendPasswordResetEmail(email).then((success) => {
            console.log('actions.jsx: pw reset email sent to ', email);
            dispatch(actions.switchLoginModalUI('email-sent-password'));
        }, (error) => {
            return dispatch(addErrorMessage(error.message));
        });
    };
};

export const createUserWithEmailAndPassword = (email, password) => {
    return (dispatch) => {
        return firebase.auth().createUserWithEmailAndPassword(email, password).then((user) => {
            console.log('actions.jsx: creating new user: ', user);
            console.log(`actions: User created: ${email} : ${password}`);
            return dispatch(sendVerificationEmail(user));
        }, (error) => {
            console.log("actions: there was an error creating this user: ");
            return dispatch(addErrorMessage(error.message));
        });
    };
};

// This needs to be edited to accommodate FB & user/email login:
export const startEmailLogin = (email, password) => {
    return (dispatch) => {
        return firebase.auth().signInWithEmailAndPassword(email, password).then((result) => {
            if(!result.emailVerified){
                dispatch(addErrorMessage("You have not verified your e-mail address. Please check your inbox for a verification e-mail from Tonal."));
            } else {
                console.log('actions: logged in user, result: ', result);
                dispatch(startLoginForAuthorizedUser(result.uid));
            }
        }, (error) => {
            console.log('actions: there was an error logging in user: ', error.message);
            return dispatch(addErrorMessage(error.message));
        });
    };
};

export const fetchUserData = (uid) => {
    return (dispatch, getState) => {
        console.log('actions.jsx: actions/fetchUserData: uid: ', uid);
        databaseRef.child(`users/${uid}`).once('value').then((snapshot) => {
            console.log('actions.jsx: user data: ', snapshot.val());
            if(snapshot.val()){
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
        }, (error) => {
            console.log('actions.jsx: error checking if user exists: ', error);
        });
    }
};

export const createUserWithFacebookAuth = () => {
    return (dispatch, getState) => {
        firebase.auth().signInWithPopup(facebookAuthProvider).then((result) => {
            if(result.credential){

                const token = result.credential.accessToken;
                const firebaseUser = result.user;
                const uid = firebaseUser.uid;

                console.log('action.jsx: signed in with FB, initial result: ', result);

                const user = {
                    uid: uid,
                    fbToken: token,
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName,
                    avatarPhoto: firebaseUser.photoURL,
                    updatedAt: moment().format('LLLL'),
                    createdAt: moment().format('LLLL')
                };

                databaseRef.child(`users/${uid}`).update(user);
                dispatch(storeUserDataToState(user));
                dispatch(startLoginForAuthorizedUser(uid));

                axios.get(`${ facebookRootURI }/me`, {
                    params: {
                        access_token: token,
                        fields: 'first_name, last_name, email, timezone, picture.width(300)'
                    }
                })
                .then(response => {
                    console.log('actions.jsx: successful get from FB API: ', response);

                    const updatedUser = {
                        ...user,
                        email: response.data.email,
                        firstName: response.data.first_name,
                        lastName:response.data.last_name,
                        timeZone: response.data.timezone,
                        avatarPhoto: response.data.picture.data.url,
                        updatedAt: moment().format('LLLL')
                    };

                    databaseRef.child(`users/${uid}`).update(updatedUser);
                    dispatch(storeUserDataToState(updatedUser));

                })
                .catch(error => {
                    console.log('actions.jsx: there was an error getting FB data: ', error);
                });
            }
        }, (error) => {
            return dispatch(addErrorMessage(error.message));
        });
    };
};
