import React from 'react';
import * as Redux from 'react-redux';
import {
    TimelineLite,
    Power2,
    Power0
} from 'gsap';

import SmallMenu from 'elements/SmallMenu';
import { toggleNotifs } from 'actions/UIStateActions';
import { deleteNotif } from 'actions/NotificationActions';
import {
    updateBlockedUser,
    toggleSettingDisplayNotifs
} from 'actions/UserActions';
import Notification from './Notification';

export const NotificationsList = React.createClass({

    componentWillMount(){
        this.setState({
            showNotifSettingsMenu: false
        });
    },

    componentDidMount(){
        const tl = new TimelineLite();
        tl.from(this.notifsListRef, 0.4, {
            ease: Power2.easeOut,
            opacity: 0
        });
        tl.from(this.topbarRef, 0.4, {
            ease: Power2.easeOut,
            y: -20,
            opacity: 0
        }, '-=0.2');
        tl.play();
    },

    componentDidUpdate(prevProps){
        if (Object.keys(prevProps.data).length === 0 &&
            Object.keys(this.props.data).length > 0){
            const tl = new TimelineLite();
            tl.delay(1);
            tl.from(this.topbarRef, 1, {
                ease: Power0.easeNone,
                className: '-=read'
            });
            tl.play();
        }

        if (Object.keys(prevProps.data).length > 0 &&
            Object.keys(this.props.data).length === 0){
            const tl = new TimelineLite();
            tl.delay(1);
            tl.from(this.topbarRef, 1, {
                ease: Power0.easeNone,
                className: '+=read'
            });
            tl.play();
        }

        if (prevProps.settings.displayNotifs !== this.props.settings.displayNotifs){
            const tl = new TimelineLite();
            const topbarFromClass = this.props.settings.displayNotifs ? '+=off' : '-=off';
            tl.from(this.topbarRef, 0.5, {
                ease: Power2.easeOut,
                className: topbarFromClass
            });
            tl.play();
        }
    },

    toggleNotifSettingsMenu(){
        this.setState({
            showNotifSettingsMenu: !this.state.showNotifSettingsMenu
        });
    },

    handleUnfollowUser(uid){
        console.log('unfollow: ', uid);
    },

    handleBlockUser(uid){
        console.log('block: ', uid);
    },

    handleDeleteNotif(notifId){
        const { dispatch } = this.props;
        console.log('delete this notif: ', notifId);
        dispatch(deleteNotif(notifId));
    },

    toggleMuteNotifs(){
        const { dispatch } = this.props;
        dispatch(toggleSettingDisplayNotifs());
        console.log('toggling mute notifs');
    },

    clearNotifs(){
        console.log('clear notifs');
    },

    render(){

        const {
            data,
            status,
            notifsCount,
            settings: {
                displayNotifs
            }
        } = this.props;

        const { showNotifSettingsMenu } = this.state;

        const renderNotifs = () => {
            if (status === 'fetching' || !status){
                return <div>Fetching...</div>;
            } else if (status === 'error'){
                return <div>Error.</div>;
            } else if (status === 'success'){
                if (data && Object.keys(data).length > 0){
                    return Object.keys(data)
                    .reverse()
                    .map(key => {
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

        const renderTopbar = () => {

            if (data && Object.keys(data).length > 0){

                const renderCount = () => {
                    if (notifsCount === 0){
                        return 'no';
                    }

                    return <span>{ notifsCount }</span>;
                };

                const renderMenu = () => {

                    const topIcon = displayNotifs ? 'bell-slash' : 'bell';
                    const topColor = displayNotifs ? 'yellow' : 'lightgreen';
                    const topTitle = displayNotifs ? 'Mute Notifications' : 'Unmute Notifications';

                    if (showNotifSettingsMenu){
                        const settings = [
                            {
                                icon: topIcon,
                                iconColor: topColor,
                                title: topTitle,
                                callback: this.toggleMuteNotifs
                            },
                            {
                                divider: true
                            },
                            {
                                icon: 'times',
                                highlightColor: 'red',
                                title: 'Clear Notifications',
                                callback: this.clearNotifs,
                            }
                        ];

                        return (
                            <SmallMenu
                                options={ settings }
                                onClose={ this.toggleNotifSettingsMenu } />
                        );
                    }
                };

                const notifsTopbarText = () => {
                    if (displayNotifs){
                        return `You have ${ renderCount() } new notification${ notifsCount === 1 ? '' : 's' }`;
                    }

                    return 'You are not currently receiving notifications.';
                };

                const notifsTopbarClass = () => {
                    if (displayNotifs){
                        return `header-notifications-topbar ${ notifsCount === 0 ? 'read' : '' }`;
                    }

                    return 'header-notifications-topbar off';
                };

                return (
                    <div
                        ref={ element => this.topbarRef = element }
                        className={ notifsTopbarClass() }>
                        <div className="header-notifications-topbar-text">
                            { notifsTopbarText() }
                        </div>
                        <div
                            onClick={ this.toggleNotifSettingsMenu }
                            className="header-notifications-topbar-menu">
                            <i className="fa fa-cog" aria-hidden="true" />
                            { renderMenu() }
                        </div>
                    </div>
                );
            }

            return '';
        };

        return (
            <div>
                <div
                    ref={ element => this.notifsListRef = element }
                    className="header-notifications-list-container">
                    { renderTopbar() }
                    <div className="header-notifications-list">
                        { renderNotifs() }
                    </div>
                </div>
                <div className="header-notifications-lip" />
            </div>
        );
    }
});

export default Redux.connect(state => {
    return {
        isNotifsOpen: state.uiState.notifsIsOpen,
        settings: state.user.settings
    };
})(NotificationsList);
