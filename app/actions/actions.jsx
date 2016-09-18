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

export var createUserWithEmailAndPassword = (email, password) => {
    return (dispatch, getState) => {
        firebase.auth().createUserWithEmailAndPassword(email, password).catch((error) => {
            console.log("something bad happened: ", error);
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
