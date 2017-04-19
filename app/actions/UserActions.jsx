import firebase, {
    databaseRef,
    facebookAuthProvider,
    twitterAuthProvider
} from 'app/firebase';
import moment from 'moment';
import axios from 'axios';
import qs from 'qs';
import jsonp from 'jsonp';
import $ from 'jquery';
import request from 'request';
import percentEncode from 'oauth-percent-encode';
import Twit from 'twit';
import CryptoJS from 'crypto-js';
import {
    switchLoginModalUI
} from './UIStateActions';

import {
    addErrorMessage,
    logoutAndPushToRootRoute,
    startLoginForAuthorizedUser
} from './AuthActions';

const facebookRootURI = 'https://graph.facebook.com';

export const changeStatus = (status = false) => {
    return {
        type: 'USER_DATA_STATUS',
        status
    };
};

export const storeUserDataToState = data => {
    return {
        type: 'USER_ADD_DATA',
        data
    };
};

export const sendVerificationEmail = user => {
    return dispatch => {
        return user.sendEmailVerification()
        .then(() => {
            dispatch(switchLoginModalUI('email-sent-verify'));
        }, error => {
            console.log(error);
        });
    };
};

export const sendPasswordResetEmail = email => {
    return dispatch => {
        return firebase.auth().sendPasswordResetEmail(email)
        .then(() => {
            dispatch(switchLoginModalUI('email-sent-password'));
        }, error => {
            return dispatch(addErrorMessage(error.message));
        });
    };
};

export const createUserWithEmailAndPassword = (email, password) => {
    return dispatch => {
        return firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(user => {
            return dispatch(sendVerificationEmail(user));
        }, error => {
            return dispatch(addErrorMessage(error.message));
        });
    };
};

export const fetchUserData = uid => {
    console.log('fetchUserData called with uid: ', uid);
    return ((dispatch, getState) => {
        dispatch(changeStatus('fetching'));
        databaseRef.child(`users/${ uid }`).once('value')
        .then(snapshot => {
            console.log('snapshot.val from fetchUserData: ', snapshot.val());
            if (snapshot.val()){
                const blankUser = getState().user;
                const user = {
                    ...blankUser,
                    uid: snapshot.val().uid,
                    fbToken: snapshot.val().fbToken,
                    email: snapshot.val().email,
                    firstName: snapshot.val().firstName,
                    lastName: snapshot.val().lastName,
                    displayName: snapshot.val().displayName,
                    timeZone: snapshot.val().timeZone,
                    avatar: snapshot.val().avatar,
                    updatedAt: snapshot.val().updatedAt
                };
                dispatch(storeUserDataToState(user));
                dispatch(changeStatus('success'));
            } else {
                console.log('Ain\'t no user with them there credentials in yon database. back to the pile!');
                dispatch(changeStatus());
                dispatch(logoutAndPushToRootRoute());
            }
        }, error => {
            console.log(error);
            dispatch(changeStatus('error'));
        });
    });
};

export const createUserWithTwitterAuth = () => {
    console.log('createUserWithTwitterAuth / fetching uder data');
    return (dispatch, getState) => {
        firebase.auth().signInWithPopup(twitterAuthProvider)
        .then(result => {
            if (result.credential){
                console.log('result from twitter: ', result);
                const token = result.credential.accessToken;
                const secret = result.credential.secret;
                const firebaseUser = result.user;
                const uid = firebaseUser.uid;

                const blankUser = getState().user;
                const user = {
                    ...blankUser,
                    uid,
                    fbToken: token,
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName,
                    avatar: firebaseUser.photoURL
                };

                console.log('user: ', user);
                // databaseRef.child(`users/${ uid }`).update(user);
                // dispatch(storeUserDataToState(user));
                // dispatch(startLoginForAuthorizedUser(uid));

                const generateNonce = () => {
                    const length = 6;
                    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                    let text = '';
                    for (let i = 0; i < length; i += 1) {
                        text += possible.charAt(Math.floor(Math.random() * possible.length));
                    }

                    console.log('generated nonce: ', text);
                    return text;
                };

                // const config = {
                //     headers: {
                //         Authorization: {
                //             oauth_consumer_key: 'LMW1BGY9yiosy1en3YhoTHYXP',
                //             oauth_nonce: nonce(6),
                //             oauth_signature_method: 'HMAC-SHA1',
                //             oauth_timestamp: '1492457407',
                //             oauth_token: token,
                //             oauth_version: '1.0'
                //         }
                //     },
                //     responseType: 'json'
                // };

                const consumerKey = 'LMW1BGY9yiosy1en3YhoTHYXP';
                const consumerSecret = '1VpcOOpV1hqHuRUaYdG6hnbKw9Ds3ZDk8lfJDiQiZ6uAxw0hnk';
                const reqMethod = 'GET';
                const baseUrl = 'https://api.twitter.com/1/';
                const apiVerifyCredentials = 'account/verify_credentials.json';
                const fullUrl = `${ baseUrl }${ apiVerifyCredentials }`;
                const encodedUrl = percentEncode(fullUrl);
                const nonce = generateNonce();
                const timestamp = moment().unix();
                const authParams = {
                    oauth_consumer_key: consumerKey,
                    oauth_nonce: nonce,
                    oauth_signature_method: 'HMAC-SHA1',
                    oauth_timestamp: timestamp,
                    oauth_token: token,
                    oauth_version: '1.0'
                };

                const paramStr = qs.stringify(authParams);

                const encodedParamStr = percentEncode(paramStr);
                console.log('encodedParamStr: ', encodedParamStr);

                const signatureBaseStr = `${ reqMethod }&${ encodedUrl }&${ encodedParamStr }`;
                console.log('signatureBaseStr: ', signatureBaseStr);

                const signingKey = `${ consumerSecret }&${ secret }`;
                const signature = CryptoJS.HmacSHA1(signatureBaseStr, signingKey)
                                          .toString(CryptoJS.enc.Base64);
                console.log('signature: ', signature);

                const reqUrl = `${ fullUrl }?${ encodeURIComponent(paramStr) }&oauth_signature=${ signature }`;
                const params = {
                    ...authParams,
                    oauth_signature: percentEncode(signature)
                };

                const buildAuthString = () => {
                    let str = 'OAuth ';
                    Object.keys(params).forEach((key, index) => {
                        str += `${ key }="${ params[key] }"${ index === Object.keys(params).length - 1 ? '' : ',' }`;
                    });
                    console.log('auth key: ', str);
                    return str;
                };

                // Let's try request:
                // const oauth = {
                //     consumer_key: consumerKey,
                //     consumer_secret: consumerSecret,
                //     token,
                //     token_secret: secret
                // };
                // request.get({
                //     oauth,
                //     url: fullUrl,
                //     json: true
                // }, (e, r, u) => {
                //     if (r){
                //         console.log('response: ', r);
                //         console.log('user: ', u);
                //     } else {
                //         console.log('error: ', e);
                //     }
                // });
                // App broke with this.
                const T = new Twit({
                    consumer_key: consumerKey,
                    consumer_secret: consumerSecret,
                    access_token: token,
                    access_token_secret: secret,
                    timeout_ms: 60 * 1000,  // optional HTTP request timeout to apply to all requests.
                });

                T.get('account/verify_credentials', { skip_status: true })
                .catch(err => {
                    console.log('caught error', err.stack);
                }).then(res => {
                    // `result` is an Object with keys "data" and "resp".
                    // `data` and `resp` are the same objects as the ones passed
                    // to the callback.
                    // See https://github.com/ttezel/twit#tgetpath-params-callback
                    // for details.

                    console.log('data', res.data);
                });

                // ajax didn't work either.
                // $.ajax({
                //     url: fullUrl,
                //     type: 'GET',
                //     crossDomain: true,
                //     dataType: 'jsonp',
                //     headers: { Authorization: buildAuthString() },
                //     // beforeSend: xhr => xhr.setRequestHeader('Authorization', buildAuthString()),
                //     success: data => { console.log('data: ', data); },
                //     error: err => { console.log('error: ', err); }
                // });

                // request doesn't work with jsonp:
                // jsonp(reqUrl, null, (err, data) => {
                //     if (err){
                //         console.log('error from jsonp request: ', err);
                //     } else {
                //         console.log('data received! ', data);
                //     }
                // });

                // request doesn't work with axios:
                // axios.get(fullUrl, {
                //     headers: {
                //         'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                //         'Authorization': buildAuthString()
                //     },
                //     params
                // }).then(response => {
                //     console.log('response from twitter API call: ', response);
                // }, error => {
                //     console.log('error from twitter API call: ', error);
                // });
            }
        }, error => {
            console.log('error from twitter: ', error);
        });
    };
};

// split create and login into two separate actions.
export const createUserWithFacebookAuth = () => {
    console.log('createUserWithFacebookAuth / fetching user data');
    return (dispatch, getState) => {
        dispatch(changeStatus('fetching'));
        firebase.auth().signInWithPopup(facebookAuthProvider)
        .then(result => {
            if (result.credential){
                console.log('result: ', result);
                const token = result.credential.accessToken;
                const firebaseUser = result.user;
                const uid = firebaseUser.uid;

                const blankUser = getState().user;
                const user = {
                    ...blankUser,
                    uid,
                    fbToken: token,
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName,
                    avatar: firebaseUser.photoURL,
                };

                // Something like this needs to happen
                // databaseRef.child('users')
                //     .orderByChild('email')
                //     .equalTo(firebaseUser.email)
                //     .once('value')
                //     .then(snap => {
                //         console.log('snapshot val: ', snap.val());
                //     });

                console.log('user: ', user);
                databaseRef.child(`users/${ uid }`).update(user);
                dispatch(storeUserDataToState(user));
                dispatch(startLoginForAuthorizedUser(uid));

                axios.get(`${ facebookRootURI }/me`, {
                    params: {
                        access_token: token,
                        fields: 'first_name, last_name, email, timezone, picture.width(300), location'
                    }
                })
                .then(response => {

                    console.log('response.data: ', response.data);
                    const updatedUser = {
                        ...user,
                        email: response.data.email,
                        firstName: response.data.first_name,
                        lastName: response.data.last_name,
                        timeZone: response.data.timezone,
                        avatar: response.data.picture.data.url,
                        updatedAt: moment().format('LLLL')
                    };

                    databaseRef.child(`users/${ uid }`).update(updatedUser);
                    dispatch(changeStatus('success'));
                    dispatch(storeUserDataToState(updatedUser));
                    console.log('updated user: ', updatedUser);

                })
                .catch(error => {
                    console.log(error);
                    dispatch(changeStatus('error'));
                });
            }
        }, error => {
            return dispatch(addErrorMessage(error.message));
        });
    };
};
