import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {
    switchLoginModalUI,
    toggleLoginModal
} from 'actions/UIStateActions';

import Search from 'Search';

class HeaderLoggedOut extends Component {

    toggleLoginModal = event => {
        event.preventDefault();

        const { dispatch, isModalOpen } = this.props;

        if (!isModalOpen){
            const tabSelected = event.target.getAttribute('name');
            dispatch(switchLoginModalUI(tabSelected));
            dispatch(toggleLoginModal());
        }
    }

    render(){

        const { isModalOpen } = this.props;

        return (
            <div className={ `tonal-header ${ isModalOpen ? 'blur' : '' }` }>
                <div className="logo float-center" />
                <div className="row">
                    <div className="small-6 tonal-links-loggedout columns">
                        <nav className="links">
                            <button
                                name="signup"
                                onClick={ this.toggleLoginModal }
                                className="tonal-btn main">
                                Sign Up
                            </button>
                            <Link
                                to="#"
                                name="login"
                                onClick={ this.toggleLoginModal }
                                data-hover="Log In">
                                Log In
                            </Link>
                        </nav>
                    </div>
                    <div className="small-6 text-right columns">
                        <Search />
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(state => {
    return {
        isModalOpen: state.uiState.loginModalIsOpen
    };
})(HeaderLoggedOut);
