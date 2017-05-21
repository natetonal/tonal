import React from 'react';
import * as Redux from 'react-redux';
import firebase from 'firebase';
import { Link } from 'react-router';
import {
    toggleMenu,
    toggleCompose,
    toggleNotifs
} from 'actions/UIStateActions';
import {
    fetchNotifs,
    addNotif,
    removeNotif
} from 'actions/NotificationActions';

import Search from 'Search';
import NotificationsList from 'notifications/NotificationsList';
import HeaderCompose from './HeaderCompose';

export const Header = React.createClass({

    componentWillMount(){
        const {
            dispatch,
            uid
        } = this.props;
        if (uid){
            // Fetch notifications:
            dispatch(fetchNotifs(uid));

            // Set up observers for it:
            const notifsRef = firebase.database().ref(`/notifications/${ uid }/`);
            notifsRef.on('child_added', notif => {
                dispatch(addNotif(notif.key, notif.val()));
            });
            notifsRef.on('child_changed', notif => {
                console.log('child changed!');
                dispatch(addNotif(notif.key, notif.val()));
            });
            notifsRef.on('child_removed', notif => {
                console.log('NOTIFS DELETION WITNESSED! REMOVING: ', notif.key);
                dispatch(removeNotif(notif.key));
            });
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
            isComposeOpen
        } = this.props;
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

    render(){

        const {
            isMenuOpen,
            isNotifsOpen,
            isComposeOpen,
            avatar,
            notifs,
            notifsStatus
        } = this.props;

        const renderNotifs = () => {
            return (
                <NotificationsList
                    data={ notifs }
                    status={ notifsStatus } />
            );
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
                            { notifs && <span className="alert badge" /> }
                            { isNotifsOpen && renderNotifs() }
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
                            { notifs && <span className="alert badge" /> }
                            { isNotifsOpen && renderNotifs() }
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
