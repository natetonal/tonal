import firebase from 'firebase';

try {
    const config = {
        apiKey: process.env.API_KEY,
        authDomain: process.env.AUTH_DOMAIN,
        databaseURL: process.env.DATABASE_URL,
        storageBucket: process.env.STORAGE_BUCKET
    };

    firebase.initializeApp(config);

} catch (e) {

    console.log('Error with Firebase: ', e);
}

// Middleware & Auth Providers
export const facebookAuthProvider = new firebase.auth.FacebookAuthProvider();
facebookAuthProvider.addScope('user_actions.music');

// Firebase refs
export const databaseRef = firebase.database().ref();
export const storageRef = firebase.storage().ref();
export const auth = firebase.auth();

export default firebase;
