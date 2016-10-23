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

export const storeUserDataToState = (data) => {
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
        firebase.auth().applyActionCode(oobCode).then((success) => {
            console.log('action.jsx: action code applied!', success);
            const uid = firebase.auth().currentUser.uid;
            const user = {
                uid,
                email: firebase.auth().currentUser.email,
                updatedAt: snapshot.val().updatedAt
            };
            databaseRef.child(`users/${uid}`).update(user);
            dispatch(storeUserDataToState(user));
            dispatch(startLoginForAuthorizedUser(uid));
        }, (error) => {
            console.log("router: Problem verifying email: ", error);
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
            return dispatch(verificationEmailSent());
        }, (error) => {
            console.log("actions: Error sending user verification email: ", error);
        });
    }
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
                    updatedAt: moment().format('LLLL')
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
