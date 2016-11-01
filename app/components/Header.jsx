import React from 'react';
import * as Redux from 'react-redux';
import { Link } from 'react-router';
import * as actions from 'actions';

import Search from './Search';

export const Header = React.createClass({

    onClick(event){
        event.preventDefault();
        var { dispatch } = this.props;
        dispatch(actions.toggleMenu());
    },

    render(){

        var { isOpen, photoURL } = this.props;

        console.log('Header.jsx: isOpen? ', isOpen);

        return(
            <div className="tonal-header">
                <div className="logo float-center"></div>
                <div className="row">
                    <div className="small-5 medium-1 columns">
                        { photoURL ? (
                                <div className="tonal-header-avatar">
                                    <a onClick={ !isOpen ? this.onClick : false } href="">
                                        <img src={ photoURL } className="tonal-header-avatar-image" />
                                    </a>
                                </div>
                            ) : (
                                <div className="hi-icon-effect-1 hi-icon-effect-1b">
                                    <a onClick={ !isOpen ? this.onClick : false } href="" className="hi-icon hi-icon-mobile">
                                        <i className="fa fa-user" aria-hidden="true"></i>
                                    </a>
                                </div>
                            )
                        }
                        <div className="hi-icon-effect-1 hi-icon-effect-1b hi-icon-notify nt-left">
                            <a href="#" className="hi-icon hi-icon-mobile">
                                <i className="fa fa-bell" aria-hidden="true"></i>
                            </a>
                            <span className="alert badge"></span>
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
                            <a href="#" className="hi-icon hi-icon-mobile">
                                <i className="fa fa-bell" aria-hidden="true"></i>
                            </a>
                            <span className="alert badge"></span>
                        </div>
                        <div className="hi-icon-effect-1 hi-icon-effect-1b hi-icon-post">
                            <a href="#" className="hi-icon hi-icon-mobile">
                                <i className="fa fa-pencil" aria-hidden="true"></i>
                            </a>
                        </div>
                        <Search />
                    </div>
                </div>
            </div>
        );
    }
});

export default Redux.connect(state => {
    console.log('state in Header.jsx: ', state);
    return {
        isOpen: state.uiState.menuIsOpen,
        photoURL: state.user.avatarPhoto
     };
})(Header);
