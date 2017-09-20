import React, { Component } from 'react';
import {
    TimelineLite,
    Power2,
    Power0
} from 'gsap';

import SmallMenu from 'elements/SmallMenu';

class NotificationTopbar extends Component {

    componentWillMount(){
        this.setState({
            showNotifSettingsMenu: false
        });
    }

    componentDidMount(){
        // Animate the topbar when component first loads.
        const tl = new TimelineLite();
        tl.from(this.topbarRef, 0.4, {
            ease: Power2.easeOut,
            y: -20,
            opacity: 0
        });
        tl.play();
    }

    componentDidUpdate(prevProps){

        // Change the color if there are now new notifications.
        if (prevProps.newNotifsCount === 0 &&
            this.props.newNotifsCount > 0){
            const tl = new TimelineLite();
            tl.delay(1);
            tl.from(this.topbarRef, 1, {
                ease: Power0.easeNone,
                className: '-=read'
            });
            tl.play();
        }

        // Change the color if all notifications are now acknowledged.
        if (prevProps.newNotifsCount > 0 &&
            this.props.newNotifsCount === 0 &&
            this.props.areThereNotifs){
            const tl = new TimelineLite();
            tl.delay(1);
            tl.from(this.topbarRef, 1, {
                ease: Power0.easeNone,
                className: '+=read'
            });
            tl.play();
        }

        // Put a small fade-in if number of new notifs changes while menu is open:
        if (prevProps.newNotifsCount !== this.props.newNotifsCount &&
            this.notifCountRef){
            const tl = new TimelineLite();
            tl.from(this.notifCountRef, 0.5, {
                ease: Power0.easeNone,
                opacity: 0
            });
            tl.play();
        }

        // Change the color if the user muted/unmuted notifications.
        if (prevProps.displayNotifs !== this.props.displayNotifs){
            const tl = new TimelineLite();
            const topbarFromClass = this.props.displayNotifs ? '+=off' : '-=off';
            tl.from(this.topbarRef, 0.5, {
                ease: Power2.easeOut,
                className: topbarFromClass
            });
            tl.play();
        }
    }

    toggleMuteNotifs(){
        const { toggleMuteNotifs } = this.props;
        toggleMuteNotifs();
    }

    toggleNotifSettingsMenu(e){
        if (e){ e.preventDefault(); }
        this.setState({
            showNotifSettingsMenu: !this.state.showNotifSettingsMenu
        });
    }

    render(){

        const {
            displayNotifs,
            newNotifsCount,
            muteNotifs,
            clearNotifs
        } = this.props;

        const { showNotifSettingsMenu } = this.state;

        const renderMenu = () => {

            const topIcon = displayNotifs ? 'bell-slash' : 'bell';
            const topColor = displayNotifs ? 'lightred' : 'lightgreen';
            const topTitle = displayNotifs ? 'Mute Notifications' : 'Unmute Notifications';

            if (showNotifSettingsMenu){
                const settings = [
                    {
                        icon: topIcon,
                        iconColor: topColor,
                        title: topTitle,
                        callback: muteNotifs
                    },
                    {
                        divider: true
                    },
                    {
                        icon: 'times',
                        highlightColor: 'red',
                        title: 'Clear Notifications',
                        callback: clearNotifs
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

                const renderCount = () => {
                    if (newNotifsCount === 0){
                        return 'no';
                    }
                    return <span ref={ element => this.notifCountRef = element }>{ newNotifsCount }</span>;
                };

                return (
                    <div>
                        You have { renderCount() } new notification{ newNotifsCount === 1 ? '.' : 's.' }
                    </div>
                );
            }

            return 'You are not currently receiving notifications.';
        };

        const notifsTopbarClass = () => {
            if (displayNotifs){
                return `notifications-topbar ${ newNotifsCount === 0 ? 'read' : '' }`;
            }

            return 'notifications-topbar off';
        };

        return (
            <div
                ref={ element => this.topbarRef = element }
                className={ notifsTopbarClass() }>
                <div className="notifications-topbar-text">
                    { notifsTopbarText() }
                </div>
                <div
                    onClick={ this.toggleNotifSettingsMenu }
                    className="notifications-topbar-menu">
                    <i className="fa fa-cog" aria-hidden="true" />
                    { renderMenu() }
                </div>
            </div>
        );
    }
}

export default NotificationTopbar;
