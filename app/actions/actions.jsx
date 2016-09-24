// This will be where to import the Facebook login, as well.
import firebase, { databaseRef, storageRef, facebookAuthProvider } from 'app/firebase/';
import moment from 'moment';

export var login = (uid) => {
    console.log("UID from actions: ", uid);
    return{
        type: 'LOGIN',
        uid
    };
};

export var logout = () => {
    return{
        type: 'LOGOUT'
    };
};

export var toggleLoginModal = () => {
    return{
        type: 'TOGGLE_LOGIN_MODAL',
    };
};

export var toggleLoginModalTab = (tabSelected) => {
    return{
        type: 'TOGGLE_LOGIN_MODAL_TAB',
        tabSelected
    }
}
export var toggleMenu = () => {
    return{
        type: 'TOGGLE_MENU'
    };
};

export var toggleSearch = () => {
    return{
        type: 'TOGGLE_SEARCH'
    };
};

export var verificationEmailSent = () => {
    return{
        type: 'FLAG_VERIFICATION_EMAIL_AS_SENT'
    };
};

export var resetAuthState = () => {
    return{
        type: 'RESET_AUTH_STATE'
    };
};

export var getImgUrl = (path) => {
    return(dispatch, getState) => {
        console.log('getImgUrl request received.');
        var imgRef = storageRef.child(`assets/${path}`);
        imgRef.getDownloadURL().then(imgUrl => {
            if(imgUrl){
                console.log('imgUrl returned: ', imgUrl);
                dispatch({
                    type: 'GET_IMG_URL',
                    imgUrl
                });
            }
        }).catch(error => {
            console.log('There was an error fetching an image: ', error);
        });
    };
};

export var verifyEmail = (mode, oobCode) => {
    return (dispatch) => {
        console.log('Verifying email');
        return firebase.auth().applyActionCode(oobCode).then((success) => {
            console.log('Email verified!', success);
            console.log('uid? ', firebase.UserInfo.uid);
            return dispatch(login(firebase.UserInfo.uid));

        }, (error) => {
            console.log('Error: Email not verified:', error);
        });
    }
};

export var sendVerificationEmail = (user) => {
    return (dispatch) => {
        user.sendEmailVerification().then(() => {
            console.log("Verification has been sent to ", user.email);
            return dispatch(verificationEmailSent());
        }, (error) => {
            console.log("Error sending user verification email: ", error);
        });
    }
};

export var createUserWithEmailAndPassword = (email, password) => {
    return (dispatch) => {
        return firebase.auth().createUserWithEmailAndPassword(email, password).then((user) => {
            console.log(`User created: ${email} : ${password}`);
            return dispatch(sendVerificationEmail(user));
        }, (error) => {
            console.log("error creating user: ", error);
        });
    };
};

// This needs to be edited to accommodate FB & user/email login:
export var startEmailLogin = () => {
    return (dispatch, getState) => {
        firebase.auth().signInWithEmailAndPassword(email, password).then((result) => {
            // There's a ton of helpful data that comes back in the result object. Remember this!!!
            console.log('Auth worked! ', result);
        }, (error) => {
            console.log('Unable to auth: ', error);
        });
    };
};

export var startFacebookLogin = () => {
    return (dispatch, getState) => {
        firebase.auth().signInWithPopup(provider).then((result) => {
            console.log('Auth worked! ', result);
        }, (error) => {
            console.log('Unable to auth: ', error);
        });
    };
};

export var startLogout = () => {
    return (dispatch, getState) => {
        firebase.auth().signOut().then(() => {
            console.log('Logged out!');
        }, (error) => {
            console.log('Something horrible happened.');
        });
    };
};
