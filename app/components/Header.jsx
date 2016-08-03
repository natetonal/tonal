import React from 'react';
import * as Redux from 'react-redux';
import { Link } from 'react-router';
import Hammer from 'react-hammerjs';
import * as actions from 'actions';

import Search from './Search';

export const Header = React.createClass({

    onClick(event){
        event.preventDefault();
        console.log(event);
        var { dispatch } = this.props;
        dispatch(actions.toggleMenu());
    },

    render(){

        var { isOpen } = this.props;

        return(
            <div className="tonal-header">
                <div className="logo float-center">
                    <img src="https://firebasestorage.googleapis.com/v0/b/tonal-development.appspot.com/o/assets%2Fheader%2Ftonal-logo.png?alt=media&token=8c709f68-11b8-41ef-969d-f17c5286c4a1" />
                </div>
                <div className="row">
                    <div className="small-12 columns">
                        <Hammer onTap={ !isOpen ? this.onClick : false }>
                            <div className="small-1 columns">
                                <div className="hi-icon-effect-1 hi-icon-effect-1b">
                                    <a href="#" className="hi-icon hi-icon-mobile">
                                        <i className="fa fa-user" aria-hidden="true"></i>
                                    </a>
                                </div>
                            </div>
                        </Hammer>
                        <div className="tonal-links small-5 columns">
                            <nav className="links">
                                <Link to="connect" data-hover="Connect">Connect</Link>
                                <Link to="discover" data-hover="Discover">Discover</Link>
                                <Link to="store" data-hover="Store">Store</Link>
                                <Link to="mymusic" data-hover="My Music">My Music</Link>
                            </nav>
                        </div>
                        <div className="small-6 text-right columns">
                                <div className="hi-icon-effect-1 hi-icon-effect-1b">
                                    <a href="#" className="hi-icon hi-icon-mobile">
                                        <i className="fa fa-bell" aria-hidden="true"></i>
                                    </a>
                                </div>
                                <div className="hi-icon-effect-1 hi-icon-effect-1b">
                                    <a href="#" className="hi-icon hi-icon-mobile">
                                        <i className="fa fa-pencil" aria-hidden="true"></i>
                                    </a>
                                </div>
                                <Search />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

export default Redux.connect(state => {
    return { isOpen: state.uiState.menuIsOpen };
})(Header);
