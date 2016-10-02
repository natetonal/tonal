// This will be where to import the Facebook login, as well.
import firebase, { databaseRef, storageRef, facebookAuthProvider } from 'app/firebase/';
import { browserHistory } from 'react-router';
import moment from 'moment';

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

export const toggleLoginModal = () => {
    return{
        type: 'TOGGLE_LOGIN_MODAL',
    };
};

export const switchLoginModalTab = (tabSelected) => {
    return{
        type: 'SWITCH_LOGIN_MODAL_TAB',
        tabSelected
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

export const verificationEmailSent = () => {
    return{
        type: 'FLAG_VERIFICATION_EMAIL_AS_SENT'
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

export const startLoginForAuthorizedUser = (uid) => {
    return (dispatch) => {
        dispatch(login(uid));
        dispatch(pushToRoute('/connect'));
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
    return (dispatch) => {
        return firebase.auth().applyActionCode(oobCode).then(() => {
            const currentUser = firebase.auth().currentUser;
            return dispatch(login(currentUser.uid));
        }, (error) => {
            console.log("router: Problem verifying email: ", error);
        });
    }
};

export const startLogout = () => {
    return (dispatch) => {
        firebase.auth().signOut().then((success) => {
            console.log('actions: user signed out in firebase, signing out in app.', success);
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
            return dispatch(verificationEmailSent());
        }, (error) => {
            console.log("actions: Error sending user verification email: ", error);
        });
    }
};

export const createUserWithEmailAndPassword = (email, password) => {
    return (dispatch) => {
        firebase.auth().createUserWithEmailAndPassword(email, password).then((user) => {
            console.log(`actions: User created: ${email} : ${password}`);
            return dispatch(sendVerificationEmail(user));
        }, (error) => {
            console.log("actions: error creating user: ", error);
        });
    };
};

// This needs to be edited to accommodate FB & user/email login:
export const startEmailLogin = (email, password) => {
    return (dispatch) => {
        firebase.auth().signInWithEmailAndPassword(email, password).then((result) => {
            // There's a ton of helpful data that comes back in the result object. Remember this!!!
            return dispatch(login(result.uid));
        }, (error) => {
            return error;
        });
    };
};

export const startFacebookLogin = () => {
    return (dispatch, getState) => {
        firebase.auth().signInWithPopup(provider).then((result) => {
            console.log('actions: Auth worked! ', result);
        }, (error) => {
            console.log('actions: Unable to auth: ', error);
        });
    };
};
