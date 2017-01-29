import React from 'react';
import * as Redux from 'react-redux';
import { Link } from 'react-router';
import * as actions from 'actions';

import Search from 'Search';
import HeaderNotificationsList from './HeaderNotificationsList';
import HeaderCompose from './HeaderCompose';

export const Header = React.createClass({

    onClickMenu(event){
        event.preventDefault();
        const { dispatch } = this.props;
        dispatch(actions.toggleMenu());
    },

    onClickNotifs(event){
        event.preventDefault();
        const { dispatch, isNotifsOpen, isComposeOpen } = this.props;
        if(isComposeOpen){
            dispatch(actions.toggleCompose());
        }
        dispatch(actions.toggleNotifs());
    },

    onClickCompose(event){
        event.preventDefault();
        const { dispatch, isNotifsOpen, isComposeOpen } = this.props;
        if(isNotifsOpen){
            dispatch(actions.toggleNotifs());
        }
        dispatch(actions.toggleCompose());
    },

    render(){

        const { isMenuOpen, isNotifsOpen, isComposeOpen, photoURL } = this.props;

        return(
            <div className="tonal-header">
                <div className="logo float-center"></div>
                <div className="row">
                    <div className="small-5 medium-1 columns">
                        { photoURL ? (
                                <div className="tonal-header-avatar">
                                    <a onMouseDown={ !isMenuOpen && this.onClickMenu } href="">
                                        <img src={ photoURL } className="tonal-header-avatar-image" />
                                    </a>
                                </div>
                            ) : (
                                <div className="hi-icon-effect-1 hi-icon-effect-1b">
                                    <a onMouseDown={ !isMenuOpen && this.onClickMenu } href="" className="hi-icon hi-icon-mobile">
                                        <i className="fa fa-user" aria-hidden="true"></i>
                                    </a>
                                </div>
                            )
                        }
                        <div className="hi-icon-effect-1 hi-icon-effect-1b hi-icon-notify nt-left">
                            <a href="javascript:;" onMouseDown={ this.onClickNotifs } className="hi-icon hi-icon-mobile">
                                <i className="fa fa-bell" aria-hidden="true"></i>
                            </a>
                            <span className="alert badge"></span>
                            { isNotifsOpen && <HeaderNotificationsList /> }
                        </div>
                    </div>
                    <div className="tonal-links show-for-large medium-5 columns">
                        <nav className="links">
                            <Link to="connect" data-hover="Connect">Connect</Link>
                            <Link to="discover" data-hover="Discover">Discover</Link>
                            <Link to="store" data-hover="Store">Store</Link>
                            <Link to="mymusic" data-hover="My Music">My Music</Link>
                        </nav>
                    </div>
                    <div className="small-6 text-right columns">
                        <div className="hi-icon-effect-1 hi-icon-effect-1b hi-icon-notify nt-right">
                            <a href="javascript:;" onMouseDown={ this.onClickNotifs } className="hi-icon hi-icon-mobile">
                                <i className="fa fa-bell" aria-hidden="true"></i>
                            </a>
                            <span className="alert badge"></span>
                            { isNotifsOpen && <HeaderNotificationsList /> }
                        </div>
                        <div className="hi-icon-effect-1 hi-icon-effect-1b hi-icon-post">
                            <a href="javascript:;" onMouseDown={ this.onClickCompose } className="hi-icon hi-icon-mobile">
                                <i className="fa fa-pencil" aria-hidden="true"></i>
                            </a>
                            { isComposeOpen && <HeaderCompose /> }
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
        photoURL: state.user.avatarPhoto
     };
})(Header);
