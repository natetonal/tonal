import React from 'react';
import * as Redux from 'react-redux';
import { Link } from 'react-router';
import VisibilitySensor from 'react-visibility-sensor';
import { switchHeaderMenu } from 'actions/UIStateActions';
import Search from 'Search';
import NotificationCenter from 'notifications/NotificationCenter';
import HeaderCompose from './HeaderCompose';

export const Header = React.createClass({

    onClickHeaderMenu(menu = false, event) {
        if (event){ event.preventDefault(); }
        const {
            dispatch,
            headerMenu
        } = this.props;

        console.log('onClickHeaderMenu: headerMenu: ', headerMenu);
        console.log('onClickHeaderMenu: menu?: ', menu);

        console.log('opening/closing menu: ', menu);
        dispatch(switchHeaderMenu(menu));
    },

    render(){

        const {
            screenSize,
            headerMenu,
            avatar
        } = this.props;

        const renderAvatar = () => {
            if (avatar){
                return (
                    <div className="tonal-header-avatar">
                        <a
                            onClick={ e => headerMenu !== 'settings' && this.onClickHeaderMenu('settings', e) }
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
                        onClick={ e => headerMenu !== 'settings' && this.onClickHeaderMenu('settings', e) }
                        href=""
                        className="hi-icon hi-icon-mobile">
                        <i className="fa fa-user" aria-hidden="true" />
                    </a>
                </div>
            );
        };

        const renderComposer = () => {
            if (headerMenu === 'compose'){
                return <HeaderCompose onToggle={ this.onClickHeaderMenu } />;
            }
        };

        const renderNotifCenter = (size, direction) => {
            if (size.includes(screenSize)){
                return (
                    <NotificationCenter
                        onToggle={ this.onClickHeaderMenu }
                        direction={ direction } />
                );
            }

            return '';
        };

        return (
            <div className="tonal-header">
                <div className="logo float-center" />
                <div className="row">
                    <div className="small-5 medium-1 columns">
                        { renderAvatar() }
                        { renderNotifCenter(['small'], 'left') }
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
                        { renderNotifCenter(['medium', 'large'], 'right') }
                        <div className="hi-icon-effect-1 hi-icon-effect-1b hi-icon-post">
                            <a
                                onClick={ e => headerMenu !== 'compose' && this.onClickHeaderMenu('compose', e) }
                                className="hi-icon hi-icon-mobile">
                                <i
                                    className="fa fa-pencil"
                                    aria-hidden="true" />
                            </a>
                            { renderComposer() }
                        </div>
                        <Search onToggle={ this.onClickHeaderMenu } />
                    </div>
                </div>
            </div>
        );
    }
});

export default Redux.connect(state => {
    return {
        headerMenu: state.uiState.headerMenu,
        screenSize: state.uiState.screenSize,
        uid: state.auth.uid,
        avatar: state.user.avatar,
        displayNotifs: state.user.settings.displayNotifs,
        newNotifsCount: state.notifs.newNotifsCount
    };
})(Header);
