import React from 'react';
import { Link } from 'react-router';
import * as Redux from 'react-redux';
import * as actions from 'actions';

import Search from './Search';
import Button from './helpers/Button';

{/*<div className="small-6 columns">
    <button className="button header-login" onClick={ isModalOpen ? false : this.toggleLoginModal } href="#">GoodLoginButton.jpg</button>
</div>*/}

{/*<Link to="#" className="signup" name="signup" onClick={ isModalOpen ? false : this.toggleLoginModal } data-hover="Sign Up">Sign Up</Link>*/}

export const HeaderLoggedOut = React.createClass({

    toggleLoginModal(event){
        event.preventDefault();
        const { dispatch } = this.props;
        const tabSelected = event.target.getAttribute('name')
        dispatch(actions.toggleLoginModalTab(tabSelected));
        dispatch(actions.toggleLoginModal());
        console.log("tab selected: ", tabSelected);
        console.log("event.target: ", event.target);
    },

    render(){

        const { isModalOpen } = this.props;

        return(
            <div className={`tonal-header ${ isModalOpen ? "blur" : "" }`}>
                <div className="logo float-center"></div>
                <div className="row">
                    <div className="small-6 tonal-links-loggedout columns">
                        <nav className="links">
                            <button name="signup" onClick={ isModalOpen ? false : this.toggleLoginModal } className="tonal-btn main">Sign Up</button>
                            <Link to="#" name="login" onClick={ isModalOpen ? false : this.toggleLoginModal } data-hover="Log In">Log In</Link>
                        </nav>
                    </div>
                    <div className="small-6 text-right columns">
                        <Search />
                    </div>
                </div>
            </div>
        );
    }
});

export default Redux.connect(state => {
    return {
        isModalOpen: state.uiState.loginModalIsOpen
    };
})(HeaderLoggedOut);
