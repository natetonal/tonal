import React from 'react';
import {
    TimelineLite,
    Power2
} from 'gsap';
import Notification from './Notification';

export const NotificationsList = React.createClass({

    componentDidMount(){
        const tl = new TimelineLite();
        tl.from(this.notifsListRef, 0.4, {
            ease: Power2.easeOut,
            opacity: 0
        });
        tl.play();
    },

    render(){

        const {
            notifs,
            notifsStatus,
            areThereNotifs,
            following,
            favorites,
            blocked,
            blockedBy,
            isSelf,
            checkFriendship,
            followUser,
            favoriteUser,
            blockUser,
            deleteNotif,
            clickNotif
        } = this.props;

        const renderNotifs = () => {
            if (notifsStatus === 'fetching' || !notifsStatus){
                return (
                    <div className="header-notifications-fetching">
                        <i className="fa fa-spinner fa-pulse fa-3x fa-fw" />
                        <span className="sr-only">Loading Notifications</span>
                        Fetching your notifications
                    </div>
                );
            } else if (notifsStatus === 'error'){
                return (
                    <div className="header-notifications-error">
                        <i className="fa fa-exclamation-triangle fa-3x" aria-hidden="true" />
                        <span className="sr-only">Error Loading Notifications</span>
                        There seems to have been an error getting your notifications. Please try again later.
                    </div>
                );
            } else if (notifsStatus === 'success'){
                if (areThereNotifs){
                    return Object.keys(notifs)
                    .reverse()
                    .map(key => {

                        const senders = notifs[key].senders || false;
                        const targets = notifs[key].targets || false;

                        const notifProps = {
                            key: `notif_${ key }`,
                            data: notifs[key],
                            notifId: key,
                            senders,
                            targets,
                            following,
                            favorites,
                            blocked,
                            blockedBy,
                            isSelf,
                            checkFriendship,
                            followUser,
                            favoriteUser,
                            blockUser,
                            deleteNotif,
                            clickNotif
                        };

                        // Render notif based off of type:
                        const notifType = notifs[key].type;
                        switch (notifType){
                            case 'follower-add':
                                // Add follower notifs must have one target.
                                if (targets && Object.keys(targets).length === 1){
                                    return (
                                        <Notification
                                            route={ `users/${ notifs[key].username }` }
                                            message="started following"
                                            icon="user-plus"
                                            { ...notifProps } />
                                    );
                                }
                                break;
                            case 'favorite-add':
                                // Add follower notifs must have one target.
                                if (targets && Object.keys(targets).length === 1){
                                    return (
                                        <Notification
                                            route={ `users/${ notifs[key].username }` }
                                            message="favorited"
                                            icon="heart"
                                            { ...notifProps } />
                                    );
                                }
                                break;
                            case 'new-post':
                                // Only display new post notif if every sender is favorited by user.
                                if (senders &&
                                    Object.keys(senders).every(senderKey => checkFriendship(senders[senderKey].uid, 'favorites'))){
                                    return (
                                        <Notification
                                            route={ `posts/${ notifs[key].postId }` }
                                            message="just posted"
                                            icon="pencil"
                                            { ...notifProps } />
                                    );
                                }
                                break;
                            default:
                                return '';
                        }

                        return '';
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
            <div
                ref={ element => this.notifsListRef = element }
                className="header-notifications-list">
                { renderNotifs() }
            </div>
        );
    }
});

export default NotificationsList;
