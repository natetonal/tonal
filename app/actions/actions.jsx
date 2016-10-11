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

export const storeFacebookDataToState = (data) => {
    console.log('actions.jsx: adding user data to state', data);
    return{
        type: 'ADD_USER_DATA',
        data
    };
};

export const startLoginForAuthorizedUser = (uid) => {
    return (dispatch) => {
        console.log('actions.jsx: starting login for authorized user');
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
        return firebase.auth().createUserWithEmailAndPassword(email, password).then((user) => {
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
            console.log('actions: logged in user, result: ', result);
            return dispatch(login(result.uid));
        }, (error) => {
            console.log('actions: there was an error logging in user: ', error.message);
            return dispatch(addErrorMessage(error.message));
        });
    };
};

export const startFacebookLogin = () => {
    return (dispatch, getState) => {
        firebase.auth().signInWithPopup(facebookAuthProvider).then((result) => {
            if(result.credential){
                const token = result.credential.accessToken;
                const user = result.user;
                if(user.photoURL){
                    dispatch(storeFacebookDataToState({
                        photoURL: user.photoURL,
                        displayName: user.displayName
                    }));
                }
                axios.get(`${ facebookRootURI }/me`, {
                    params: {
                        access_token: token,
                        fields: 'first_name, last_name, picture.width(300)'
                    }
                })
                .then(response => {
                    console.log('actions.jsx: successful get from FB API: ', response);
                    dispatch(storeFacebookDataToState({
                        firstName: response.data.first_name,
                        largePhotoURL: response.data.picture.data.url
                    }));
                })
                .catch(error => {
                    console.log('actions.jsx: there was an error getting FB data: ', error);
                });
            }
        }, (error) => {
            console.log('actions.jsx: Unable to auth: ', error);
        });
    };
};
