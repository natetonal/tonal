import React from 'react';
import * as Redux from 'react-redux';
import {
    TimelineLite,
    Power2,
    Back
} from 'gsap';
import {
    updateBlockedUser,
    toggleSettingDisplayNotifs
} from 'actions/UserActions';
import {
    fetchNotifs,
    deleteNotif,
    acknowledgeNotifs,
    clearAllNotifs
} from 'actions/NotificationActions';
import { pushToRoute } from 'actions/RouteActions';
import { addFollower } from 'actions/FollowActions';
import { toggleNotifs } from 'actions/UIStateActions';
import ClickScreen from 'elements/ClickScreen';
import { NotificationTopbar } from './NotificationTopbar';
import { NotificationsList } from './NotificationsList';

export const NotificationCenter = React.createClass({

    componentWillMount(){

        const {
            dispatch,
            newNotifsCount,
            uid
        } = this.props;

        if (uid){
            // Fetch notifications:
            dispatch(fetchNotifs(uid));
        }

        this.setState({
            showBadge: newNotifsCount > 0
        });
    },

    componentWillReceiveProps(nextProps){

        // Show badge if the unacknowledged notif count changed.
        if (this.props.newNotifsCount !== nextProps.newNotifsCount){
            this.setState({
                showBadge: nextProps.newNotifsCount > 0
            });
        }
    },

    componentDidUpdate(prevProps, prevState){

        // If the menu just opened:
        if (!prevProps.isNotifsOpen && this.props.isNotifsOpen){
            const tl = new TimelineLite();
            tl.from(this.notifsContainerRef, 0.4, {
                ease: Power2.easeOut,
                opacity: 0
            });
            tl.play();
        }

        // If notifs were added:
        if (!prevState.showBadge &&
            this.state.showBadge){
            const tl = new TimelineLite();
            tl.from(this.badgeRef, 0.4, {
                ease: Back.easeOut.config(3),
                scale: 0,
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
    },

    componentWillUnmount() {
        this.acknowledgeNotifs();
    },

    onClickNotifs(event){
        event.preventDefault();

        const {
            dispatch,
            isNotifsOpen
        } = this.props;
        const { showBadge } = this.state;

        // If the menu is open, animate it out, close it, and acknowledge notifs. Otherwise, open it.
        if (isNotifsOpen){
            const tl = new TimelineLite();
            tl.to(this.notifsContainerRef, 0.2, {
                ease: Power2.easeOut,
                opacity: 0
            });
            if (showBadge){
                tl.to(this.badgeRef, 0.4, {
                    ease: Back.easeIn.config(3),
                    scale: 0,
                    opacity: 0
                }, '-=0.2');
            }
            tl.play();
            tl.eventCallback('onComplete', this.closeNotifsMenu);
        } else {
            dispatch(toggleNotifs());
        }
    },

    handleClearNotifs(){
        const { dispatch } = this.props;
        dispatch(clearAllNotifs());
    },

    handleFollowUser(followedUid){
        const {
            dispatch,
            uid
        } = this.props;
        if (!this.isBlocked(followedUid)){
            dispatch(addFollower(uid, followedUid));
        }
    },

    handleBlockUser(blockedUid){
        const { dispatch } = this.props;
        dispatch(updateBlockedUser(blockedUid));
    },

    handleClickNotif(route){
        const { dispatch } = this.props;
        dispatch(pushToRoute(route));
    },

    handleDeleteNotif(notifId){
        const { dispatch } = this.props;
        console.log('delete this notif: ', notifId);
        dispatch(deleteNotif(notifId));
    },

    toggleMuteNotifs(){
        const { dispatch } = this.props;
        dispatch(toggleSettingDisplayNotifs());
    },

    closeNotifsMenu(){
        const { dispatch } = this.props;
        dispatch(toggleNotifs());
        this.acknowledgeNotifs();
    },

    isSelf(testUid){
        return testUid === this.props.uid;
    },

    isBlocked(testUid){
        const blocked = this.props.blocked || {};
        return Object.keys(blocked).includes(testUid);
    },

    isFollowing(testUid){
        const following = this.props.following || {};
        return Object.keys(following).includes(testUid);
    },

    acknowledgeNotifs(){
        const {
            dispatch,
            notifs
        } = this.props;
        dispatch(acknowledgeNotifs(notifs));
    },

    areThereNotifs(){
        return Object.keys(this.props.notifs).length > 0;
    },

    render(){

        const {
            notifs,
            notifsStatus,
            newNotifsCount,
            isNotifsOpen,
            following,
            blocked,
            displayNotifs,
            direction
        } = this.props;

        const { showBadge } = this.state;

        const areThereNotifs = this.areThereNotifs();

        const renderBadge = () => {
            if (showBadge){
                return (
                    <span
                        ref={ element => this.badgeRef = element }
                        className="alert badge" />
                );
            }

            return '';
        };

        const renderNotifs = () => {
            if (isNotifsOpen){
                return (
                    <div>
                        <ClickScreen onClick={ this.onClickNotifs } />
                        <div
                            ref={ element => this.notifsContainerRef = element }
                            className="header-notifications-list-container">
                            <NotificationTopbar
                                newNotifsCount={ newNotifsCount }
                                displayNotifs={ displayNotifs }
                                areThereNotifs={ areThereNotifs }
                                clearNotifs={ this.handleClearNotifs }
                                muteNotifs={ this.toggleMuteNotifs } />
                            <NotificationsList
                                notifs={ notifs }
                                notifsStatus={ notifsStatus }
                                displayNotifs={ displayNotifs }
                                areThereNotifs={ areThereNotifs }
                                isFollowing={ this.isFollowing }
                                isBlocked={ this.isBlocked }
                                isSelf={ this.isSelf }
                                isBlocked={ this.isBlocked }
                                clickNotif={ this.handleClickNotif }
                                deleteNotif={ this.handleDeleteNotif }
                                blockUser={ this.handleBlockUser }
                                followUser={ this.handleFollowUser } />
                            <div className="header-notifications-lip" />
                        </div>
                    </div>
                );
            }
        };

        return (
            <div className={ `hi-icon-effect-1 hi-icon-effect-1b hi-icon-notify nt-${ direction }` }>
                <a
                    onClick={ this.onClickNotifs }
                    className="hi-icon hi-icon-mobile">
                    <i
                        ref={ element => this.notifsIconMobileRef = element }
                        className={ `fa fa-bell${ displayNotifs ? '' : '-slash muted' }` }
                        aria-hidden="true" />
                </a>
                { renderBadge() }
                { renderNotifs() }
            </div>
        );
    }

});

export default Redux.connect(state => {
    return {
        uid: state.auth.uid,
        notifs: state.notifs.data,
        notifsStatus: state.notifs.status,
        isNotifsOpen: state.uiState.notifsIsOpen,
        newNotifsCount: state.notifs.newNotifsCount,
        following: state.user.following,
        followers: state.user.followers,
        blocked: state.user.blocked,
        displayNotifs: state.user.settings.displayNotifs
    };
})(NotificationCenter);
