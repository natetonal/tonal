import React from 'react';
import { Link } from 'react-router';
import * as Redux from 'react-redux';
import * as actions from 'actions';

import Search from './Search';

{/*<div className="small-6 columns">
    <button className="button header-login" onClick={ isModalOpen ? false : this.toggleLoginModal } href="#">GoodLoginButton.jpg</button>
</div>*/}

export const HeaderLoggedOut = React.createClass({

    toggleLoginModal(event){
        event.preventDefault();
        const tabSelected = event.target.getAttribute('name')
        const { dispatch } = this.props;
        dispatch(actions.toggleLoginModal());
        dispatch(actions.toggleLoginModalTab(tabSelected));
    },

    render(){

        const { isModalOpen } = this.props;

        return(
            <div className={`tonal-header ${ isModalOpen ? "blur" : "" }`}>
                <div className="logo float-center"></div>
                <div className="row">
                    <div className="small-6 tonal-links-loggedout columns">
                        <nav className="links">
                            <Link to="#" name="signup" onClick={ isModalOpen ? "" : this.toggleLoginModal } data-hover="Sign Up">Sign Up</Link>
                            <Link to="#" name="login" onClick={ isModalOpen ? "" : this.toggleLoginModal } data-hover="Log In">Log In</Link>
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
    return { isModalOpen: state.uiState.loginModalIsOpen };
})(HeaderLoggedOut);
