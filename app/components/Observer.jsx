import React from 'react';
import { connect } from 'react-redux';
import firebase from 'firebase';
import {
    addNotifToList,
    removeNotifFromList
} from 'actions/NotificationActions';
import { syncUserData } from 'actions/UserActions';

// The observer handles all database changes globally and keeps state up-to-date.
export const Observer = React.createClass({

    componentWillMount(){

        console.log('Observer loaded.');

        const {
            dispatch,
            uid
        } = this.props;

        // Observers for notifications:
        const notifsRef = firebase.database().ref(`/notifications/${ uid }/`);
        notifsRef.on('child_added', notif => {
            dispatch(addNotifToList(notif.key, notif.val()));
        });
        notifsRef.on('child_changed', notif => {
            dispatch(addNotifToList(notif.key, notif.val()));
        });
        notifsRef.on('child_removed', notif => {
            dispatch(removeNotifFromList(notif.key));
        });

        // Observer for user's followers:
        const followerCountRef = firebase.database().ref(`users/${ uid }/followers`);
        followerCountRef.on('child_added', () => {
            dispatch(syncUserData(['followers', 'followerCount']));
        });
        followerCountRef.on('child_changed', () => {
            dispatch(syncUserData(['followers', 'followerCount']));
        });
        followerCountRef.on('child_removed', () => {
            dispatch(syncUserData(['followers', 'followerCount']));
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
