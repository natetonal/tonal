import React from 'react';
import {
    TimelineLite,
    Power2
} from 'gsap';
import Notification from './Notification';

// Notification types (keep in sync with cloud functions!)
const NOTIF_ADD_FOLLOWER = 'follower-add';

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
            isFollowing,
            isBlocked,
            isSelf,
            followUser,
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

                        const following = isFollowing(notifs[key].uid);
                        const blocked = isBlocked(notifs[key].uid);
                        const displayFollowOption = !isSelf(notifs[key].uid);
                        // Render notif based off of type:
                        if (!blocked){
                            const notifType = notifs[key].type;
                            switch (notifType){
                                case NOTIF_ADD_FOLLOWER:
                                    return (
                                        <Notification
                                            key={ `notif_${ key }` }
                                            route={ `users/${ notifs[key].username }` }
                                            notifId={ key }
                                            following={ following }
                                            blocked={ blocked }
                                            followUser={ followUser }
                                            blockUser={ blockUser }
                                            deleteNotif={ deleteNotif }
                                            clickNotif={ clickNotif }
                                            displayFollowOption={ displayFollowOption }
                                            data={ notifs[key] } />
                                    );
                                default:
                                    return '';
                            }

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
