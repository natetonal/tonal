import React, { Component } from 'react';
import onClickOutside from 'react-onclickoutside';
import {
    TimelineLite,
    Power2
} from 'gsap';

import { NotificationTopbar } from './NotificationTopbar';
import { NotificationsList } from './NotificationsList';

class NotificationsMenu  extends Component{

    componentWillMount(){
        console.log('NotificationsMenu: mounting.');
    }

    componentDidUpdate(prevProps){

        // If the menu just opened:
        if (!prevProps.headerMenu !== this.props.headerMenu &&
            this.props.isNotifsOpen()){
            const tl = new TimelineLite();
            tl.from(this.notifsContainerRef, 0.4, {
                ease: Power2.easeOut,
                opacity: 0
            });
            tl.play();
        }

        // If the user toggled the mute notifications option:
        if (prevProps.displayNotifs !== this.props.displayNotifs){
            const tl = new TimelineLite();
            tl.from([this.notifsIconRef, this.notifsIconMobileRef], 0.5, {
                ease: Power2.easeOut,
                opacity: 0
            });
            tl.play();
        }
    }

    handleClickOutside(){
        this.props.onClickNotifs();
    }

    render(){

        const {
            notifs,
            notifsStatus,
            followingCount,
            favoritesCount,
            following,
            favorites,
            blocked,
            blockedBy,
            isSelf,
            checkFriendship,
            clickNotif,
            deleteNotif,
            blockUser,
            followUser,
            favoriteUser,
            newNotifsCount,
            displayNotifs,
            areThereNotifs,
            clearNotifs,
            muteNotifs
        } = this.props;

        return (
            <div
                ref={ element => this.notifsContainerRef = element }
                className="notifications-list-container">
                <NotificationTopbar
                    newNotifsCount={ newNotifsCount }
                    displayNotifs={ displayNotifs }
                    areThereNotifs={ areThereNotifs }
                    clearNotifs={ clearNotifs }
                    muteNotifs={ muteNotifs } />
                <NotificationsList
                    notifs={ notifs }
                    notifsStatus={ notifsStatus }
                    displayNotifs={ displayNotifs }
                    areThereNotifs={ areThereNotifs }
                    followingCount={ followingCount }
                    favoritesCount={ favoritesCount }
                    following={ following }
                    favorites={ favorites }
                    blocked={ blocked }
                    blockedBy={ blockedBy }
                    isSelf={ isSelf }
                    checkFriendship={ checkFriendship }
                    clickNotif={ clickNotif }
                    deleteNotif={ deleteNotif }
                    blockUser={ blockUser }
                    followUser={ followUser }
                    favoriteUser={ favoriteUser } />
            </div>
        );
    }

}

const ComposedNotificationsMenu = onClickOutside(NotificationsMenu);

export default ComposedNotificationsMenu;
