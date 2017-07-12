import React from 'react';
import { connect } from 'react-redux';
import firebase from 'firebase';
import $ from 'jquery';

import {
    addNotifToList,
    removeNotifFromList,
    countNewNotifs
} from 'actions/NotificationActions';

import { changeScreenSize } from 'actions/UIStateActions';
import { syncUserData } from 'actions/UserActions';

// The observer handles all database changes globally and keeps state up-to-date.
export const Observer = React.createClass({

    componentWillMount(){

        console.log('Observer loaded.');

        const {
            dispatch,
            uid
        } = this.props;

        // Observe changes in size to the viewport relative to our media query breakpoints.
        Foundation.MediaQuery._init();
        $(window).on('changed.zf.mediaquery', (event, newSize) => {
            if (newSize !== 'small'){ newSize = 'large'; }
            dispatch(changeScreenSize(newSize));
        });

        // Observers for notifications:
        const notifsRef = firebase.database().ref(`/notifications/${ uid }/`);
        notifsRef.on('child_added', notif => {
            if (notif.val().approved){
                dispatch(addNotifToList(notif.key, notif.val()));
            }
        });
        notifsRef.on('child_changed', notif => {
            if (notif.val().approved){
                dispatch(addNotifToList(notif.key, notif.val()));
            }
        });
        notifsRef.on('child_removed', notif => {
            dispatch(removeNotifFromList(notif.key));
        });

        // Observer for user's followers:
        const followersCountRef = firebase.database().ref(`users/${ uid }/followers`);
        followersCountRef.on('child_added', () => {
            dispatch(syncUserData(['followers', 'followersCount']));
        });
        followersCountRef.on('child_changed', () => {
            dispatch(syncUserData(['followers', 'followersCount']));
        });
        followersCountRef.on('child_removed', () => {
            dispatch(syncUserData(['followers', 'followersCount']));
        });

        // Observer for user's followings:
        const followingCountRef = firebase.database().ref(`users/${ uid }/following`);
        followingCountRef.on('child_added', () => {
            dispatch(syncUserData(['following', 'followingCount']));
        });
        followingCountRef.on('child_changed', () => {
            dispatch(syncUserData(['following', 'followingCount']));
        });
        followingCountRef.on('child_removed', () => {
            dispatch(syncUserData(['following', 'followingCount']));
        });

        // Observer for user's favorites:
        const favoritesRef = firebase.database().ref(`users/${ uid }/favorites`);
        favoritesRef.on('child_added', () => {
            dispatch(syncUserData(['favorites', 'favoritesCount']));
        });
        favoritesRef.on('child_changed', () => {
            dispatch(syncUserData(['favorites', 'favoritesCount']));
        });
        favoritesRef.on('child_removed', () => {
            dispatch(syncUserData(['favorites', 'favoritesCount']));
        });

        // Observer for user's favorited:
        const favoritedRef = firebase.database().ref(`users/${ uid }/favorited`);
        favoritedRef.on('child_added', () => {
            dispatch(syncUserData(['favorited', 'favoritedCount']));
        });
        favoritedRef.on('child_changed', () => {
            dispatch(syncUserData(['favorited', 'favoritedCount']));
        });
        favoritedRef.on('child_removed', () => {
            dispatch(syncUserData(['favorited', 'favoritedCount']));
        });

        // Observer for if another user blocked/unblocked this user:
        const blockedByRef = firebase.database().ref(`users/${ uid }/blockedBy`);
        blockedByRef.on('child_added', () => {
            dispatch(syncUserData(['blockedBy']))
            .then(() => {
                dispatch(countNewNotifs());
            });
        });
        blockedByRef.on('child_changed', () => {
            dispatch(syncUserData(['blockedBy']))
            .then(() => {
                dispatch(countNewNotifs());
            });
        });
        blockedByRef.on('child_removed', () => {
            dispatch(syncUserData(['blockedBy']))
            .then(() => {
                dispatch(countNewNotifs());
            });
        });
    },

    componentDidMount(){
        const size = Foundation.MediaQuery.current === 'small' ? 'small' : 'large';
        this.props.dispatch(changeScreenSize(size));
    },

    render(){
        return <div />;
    }

});

export default connect(state => {
    return {
        uid: state.auth.uid
    };
})(Observer);
