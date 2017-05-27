import React from 'react';
import * as Redux from 'react-redux';
import firebase from 'firebase';
import { Link } from 'react-router';
import {
    TimelineLite,
    Power2,
    Back,
} from 'gsap';

import {
    toggleMenu,
    toggleCompose,
    toggleNotifs
} from 'actions/UIStateActions';
import {
    fetchNotifs,
    addNotifToList,
    removeNotifFromList,
    acknowledgeNotifs
} from 'actions/NotificationActions';

import Search from 'Search';
import ClickScreen from 'elements/ClickScreen';
import NotificationsList from 'notifications/NotificationsList';
import HeaderCompose from './HeaderCompose';

export const Header = React.createClass({

    componentWillMount(){
        const {
            dispatch,
            uid
        } = this.props;

        this.setState({
            showBadge: false,
            newNotifsCount: 0
        });

        if (uid){
            // Fetch notifications:
            dispatch(fetchNotifs(uid));

            // Set up observers for it:
            const notifsRef = firebase.database().ref(`/notifications/${ uid }/`);
            notifsRef.on('child_added', notif => {
                dispatch(addNotifToList(notif.key, notif.val()));
            });
            notifsRef.on('child_changed', notif => {
                console.log('child changed!');
                dispatch(addNotifToList(notif.key, notif.val()));
            });
            notifsRef.on('child_removed', notif => {
                console.log('NOTIFS DELETION WITNESSED! REMOVING: ', notif.key);
                dispatch(removeNotifFromList(notif.key));
            });
        }
    },

    componentWillReceiveProps(nextProps){

        let newNotifsCount = 0;
        Object.keys(nextProps.notifs).forEach(key => {
            if (!nextProps.notifs[key].acknowledged){
                newNotifsCount++;
            }
        });

        // Check if there are any unacknowledged notifications and determine if badge should be displayed:
        this.setState({
            showBadge: newNotifsCount > 0,
            newNotifsCount
        });
    },

    componentDidUpdate(prevProps, prevState){
        // If notifs were added:
        if (!prevState.showBadge &&
            this.state.showBadge){
            const tl = new TimelineLite();
            tl.from(this.badgeRef, 0.25, {
                ease: Back.easeOut.config(1.7),
                scale: 0,
                opacity: 0
            });
            tl.play();
        }
    },

    onClickMenu(event){
        event.preventDefault();
        const { dispatch } = this.props;
        dispatch(toggleMenu());
    },

    onClickNotifs(event){
        event.preventDefault();
        const {
            dispatch,
            isComposeOpen,
            isNotifsOpen
        } = this.props;

        const { showBadge } = this.state;

        if (isNotifsOpen &&
            showBadge){
            const tl = new TimelineLite();
            tl.to(this.badgeRef, 0.25, {
                ease: Back.easeIn.config(1.7),
                scale: 0,
                opacity: 0
            });
            tl.play();
            tl.eventCallback('onComplete', this.acknowledgeNotifs);
        }

        if (isComposeOpen){
            dispatch(toggleCompose());
        }

        dispatch(toggleNotifs());
    },

    onClickCompose() {
        const {
            dispatch,
            isNotifsOpen
        } = this.props;
        if (isNotifsOpen) {
            dispatch(toggleNotifs());
        }
        dispatch(toggleCompose());
    },

    acknowledgeNotifs(){
        const {
            dispatch,
            notifs
        } = this.props;
        dispatch(acknowledgeNotifs(notifs));
    },

    render(){

        const {
            isMenuOpen,
            isNotifsOpen,
            isComposeOpen,
            avatar,
            notifs,
            notifsStatus
        } = this.props;

        const {
            showBadge,
            newNotifsCount
        } = this.state;

        const renderNotifs = () => {
            if (isNotifsOpen){

                return (
                    <div>
                        <ClickScreen onClick={ this.onClickNotifs } />
                        <NotificationsList
                            data={ notifs }
                            status={ notifsStatus }
                            notifsCount={ newNotifsCount }
                            onMouseLeave={ this.onClickNotifs } />
                    </div>
                );
            }

            return '';
        };

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

        const photo = () => {
            if (avatar){
                return (
                    <div className="tonal-header-avatar">
                        <a
                            onClick={ !isMenuOpen && this.onClickMenu }
                            href="">
                            <img
                                alt="header avatar"
                                src={ avatar }
                                className="tonal-header-avatar-image" />
                        </a>
                    </div>
                );
            }

            return (
                <div className="hi-icon-effect-1 hi-icon-effect-1b">
                    <a
                        onClick={ !isMenuOpen && this.onClickMenu }
                        href=""
                        className="hi-icon hi-icon-mobile">
                        <i className="fa fa-user" aria-hidden="true" />
                    </a>
                </div>
            );
        };

        return (
            <div className="tonal-header">
                <div className="logo float-center" />
                <div className="row">
                    <div className="small-5 medium-1 columns">
                        { photo() }
                        <div className="hi-icon-effect-1 hi-icon-effect-1b hi-icon-notify nt-left">
                            <a
                                onClick={ this.onClickNotifs }
                                className="hi-icon hi-icon-mobile">
                                <i
                                    className="fa fa-bell"
                                    aria-hidden="true" />
                            </a>
                            { renderBadge() }
                            { renderNotifs() }
                        </div>
                    </div>
                    <div className="tonal-links show-for-large medium-5 columns">
                        <nav className="links">
                            <Link
                                to="connect"
                                data-hover="Connect">
                                Connect
                            </Link>
                            <Link
                                to="discover"
                                data-hover="Discover">
                                Discover
                            </Link>
                            <Link
                                to="store"
                                data-hover="Store">
                                Store
                            </Link>
                            <Link
                                to="mymusic"
                                data-hover="My Music">
                                My Music
                            </Link>
                        </nav>
                    </div>
                    <div className="small-6 text-right columns">
                        <div className="hi-icon-effect-1 hi-icon-effect-1b hi-icon-notify nt-right">
                            <a
                                onClick={ this.onClickNotifs }
                                className="hi-icon hi-icon-mobile">
                                <i
                                    className="fa fa-bell"
                                    aria-hidden="true" />
                            </a>
                            { renderBadge() }
                            { renderNotifs() }
                        </div>
                        <div className="hi-icon-effect-1 hi-icon-effect-1b hi-icon-post">
                            <a
                                onClick={ this.onClickCompose }
                                className="hi-icon hi-icon-mobile">
                                <i
                                    className="fa fa-pencil"
                                    aria-hidden="true" />
                            </a>
                            { isComposeOpen && <HeaderCompose onClose={ this.onClickCompose } /> }
                        </div>
                        <Search />
                    </div>
                </div>
            </div>
        );
    }
});

export default Redux.connect(state => {
    return {
        isMenuOpen: state.uiState.menuIsOpen,
        isNotifsOpen: state.uiState.notifsIsOpen,
        isComposeOpen: state.uiState.composeIsOpen,
        uid: state.auth.uid,
        avatar: state.user.avatar,
        notifs: state.notifs.data,
        notifsStatus: state.notifs.status
    };
})(Header);
