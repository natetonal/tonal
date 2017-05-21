import React from 'react';
import * as Redux from 'react-redux';
import { toggleNotifs } from 'actions/UIStateActions';

import Notification from './Notification';

export const NotificationsList = React.createClass({

    handleNotifsMenu(event){
        event.preventDefault();
        const { dispatch, isNotifsOpen } = this.props;
        if (isNotifsOpen){
            dispatch(toggleNotifs());
        }
    },

    handleUnfollowUser(uid, event){
        event.preventDefault();
        console.log('unfollow: ', uid);
    },

    handleBlockUser(uid, event){
        event.preventDefault();
        console.log('block: ', uid);
    },

    handleDeleteNotif(notifId, event){
        event.preventDefault();
        console.log('delete this notif: ', notifId);
    },

    render(){

        const {
            data,
            status
        } = this.props;

        console.log('data passed to HeaderNotifsList: ', data);
        const renderNotifs = () => {
            if (status === 'fetching' || !status){
                return <div>Fetching...</div>;
            } else if (status === 'error'){
                return <div>Error.</div>;
            } else if (status === 'success'){
                if (data){
                    return Object.keys(data)
                    .reverse()
                    .map(key => {
                        console.log('data for this key: ', data[key]);
                        return (
                            <Notification
                                key={ `notif_${ key }` }
                                notifId={ key }
                                unfollowUser={ this.handleUnfollowUser }
                                blockUser={ this.handleBlockUser }
                                deleteNotif={ this.handleDeleteNotif }
                                data={ data[key] } />
                        );
                    });
                }

                return (
                    <div className="header-notifications-none">
                        <i className="fa fa-meh-o" aria-hidden="true" /> You have no notifications.
                    </div>
                );
            }

            return '';
        };

        return (
            <div onMouseLeave={ this.handleNotifsMenu } >
                <div className="header-notifications-list">
                    { renderNotifs() }
                </div>
                <div className="header-notifications-lip" />
            </div>
        );
    }
});

export default Redux.connect(state => {
    return {
        isNotifsOpen: state.uiState.notifsIsOpen
    };
})(NotificationsList);
