import firebase from 'firebase';

try {
    var config = {
        apiKey: process.env.API_KEY,
        authDomain: process.env.AUTH_DOMAIN,
        databaseURL: process.env.DATABASE_URL,
        storageBucket: process.env.STORAGE_BUCKET
    };

    console.log(process.env.API_KEY, process.env.AUTH_DOMAIN, process.env.DATABASE_URL, process.env.STORAGE_BUCKET);

    firebase.initializeApp(config);
} catch (e) {
    console.log('Error with Firebase: ', e);
}

// Middleware & Auth Providers
export var facebookAuthProvider = new firebase.auth.FacebookAuthProvider();
facebookAuthProvider.addScope('user_actions.music');

// Firebase refs
export var databaseRef = firebase.database().ref();
export var storageRef = firebase.storage().ref();

export default firebase;
