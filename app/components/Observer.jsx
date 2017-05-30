import React from 'react';
import { connect } from 'react-redux';
import firebase from 'firebase';
import {
    addNotifToList,
    removeNotifFromList
} from 'actions/NotificationActions';
import { updateUserData } from 'actions/UserActions';

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

        // Observer for user's follower count:
        const followerCountRef = firebase.database().ref(`users/${ uid }/followerCount`);
        followerCountRef.on('child_changed', count => {
            dispatch(updateUserData({ followerCount: count.val() }));
        });

        // Observer for user's following count:
        const followingCountRef = firebase.database().ref(`users/${ uid }/followingCount`);
        followingCountRef.on('child_changed', count => {
            dispatch(updateUserData({ followingCount: count.val() }));
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
