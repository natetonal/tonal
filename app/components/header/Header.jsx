import React from 'react';
import * as Redux from 'react-redux';
import { Link } from 'react-router';
import { switchHeaderMenu } from 'actions/UIStateActions';
import Search from 'Search';
import NotificationCenter from 'notifications/NotificationCenter';
import HeaderCompose from './HeaderCompose';

export const Header = React.createClass({

    onClickHeaderMenu(menu, event) {
        if (event){ event.preventDefault(); }
        const {
            dispatch,
            headerMenu
        } = this.props;
        if (headerMenu === menu) {
            dispatch(switchHeaderMenu());
        } else {
            dispatch(switchHeaderMenu(menu));
        }
    },

    render(){

        const {
            headerMenu,
            avatar
        } = this.props;

        const renderAvatar = () => {
            if (avatar){
                return (
                    <div className="tonal-header-avatar">
                        <a
                            onClick={ e => this.onClickHeaderMenu('settings', e) }
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
                        onClick={ e => this.onClickHeaderMenu('notifs', e) }
                        href=""
                        className="hi-icon hi-icon-mobile">
                        <i className="fa fa-user" aria-hidden="true" />
                    </a>
                </div>
            );
        };

        const renderComposer = () => {
            if (headerMenu === 'compose'){
                return <HeaderCompose onClose={ e => this.onClickHeaderMenu('compose', e) } />;
            }
        };

        return (
            <div className="tonal-header">
                <div className="logo float-center" />
                <div className="row">
                    <div className="small-5 medium-1 columns">
                        { renderAvatar() }
                        <NotificationCenter direction="left" />
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
                        <NotificationCenter direction="right" />
                        <div className="hi-icon-effect-1 hi-icon-effect-1b hi-icon-post">
                            <a
                                onClick={ e => this.onClickHeaderMenu('compose', e) }
                                className="hi-icon hi-icon-mobile">
                                <i
                                    className="fa fa-pencil"
                                    aria-hidden="true" />
                            </a>
                            { renderComposer() }
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
        headerMenu: state.uiState.headerMenu,
        uid: state.auth.uid,
        avatar: state.user.avatar,
        displayNotifs: state.user.settings.displayNotifs,
        newNotifsCount: state.notifs.newNotifsCount
    };
})(Header);
