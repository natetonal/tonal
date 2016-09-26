// This will be where to import the Facebook login, as well.
import firebase, { databaseRef, storageRef, facebookAuthProvider } from 'app/firebase/';
import moment from 'moment';

export var login = (uid) => {
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


export var startLogout = () => {
    return (dispatch) => {
        return firebase.auth().signOut().then((success) => {
            console.log('actions: user signed out in firebase, signing out in app.');
            dispatch(logout());
        }, (error) => {
            console.log('actions: there was a problem signing out');
        });
    };
};

export var verifyEmail = (oobCode) => {
    firebase.auth().currentUser.reload();
    dispatch(verificationEmailSent());
    dispatch(login(firebase.auth().currentUser.uid));
};

export var sendVerificationEmail = (user) => {
    return (dispatch) => {
        return user.sendEmailVerification().then(() => {
            console.log("actions: Verification has been sent to ", user.email);
            return dispatch(verificationEmailSent());
        }, (error) => {
            console.log("actions: Error sending user verification email: ", error);
        });
    }
};

export var createUserWithEmailAndPassword = (email, password) => {
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
export var startEmailLogin = () => {
    return (dispatch, getState) => {
        firebase.auth().signInWithEmailAndPassword(email, password).then((result) => {
            // There's a ton of helpful data that comes back in the result object. Remember this!!!
            console.log('actions: Auth worked! ', result);
        }, (error) => {
            console.log('actions: Unable to auth: ', error);
        });
    };
};

export var startFacebookLogin = () => {
    return (dispatch, getState) => {
        firebase.auth().signInWithPopup(provider).then((result) => {
            console.log('actions: Auth worked! ', result);
        }, (error) => {
            console.log('actions: Unable to auth: ', error);
        });
    };
};
