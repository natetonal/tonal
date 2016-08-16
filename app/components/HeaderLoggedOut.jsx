import React from 'react';
import * as Redux from 'react-redux';
import * as actions from 'actions';

import Search from './Search';

export const HeaderLoggedOut = React.createClass({

    toggleLoginModal(event){
        event.preventDefault();
        const { dispatch } = this.props;
        dispatch(actions.toggleLoginModal());
    },

    render(){

        const { isModalOpen } = this.props;

        return(
            <div className="tonal-header">
                <div className="logo float-center"></div>
                <div className="row">
                    <div className="small-12 columns">
                        <div className="small-6 columns">
                            <button className="button header-login" onClick={ isModalOpen ? false : this.toggleLoginModal } href="#">GoodLoginButton.jpg</button>
                        </div>
                        <div className="small-6 text-right columns">
                            <Search />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

export default Redux.connect(state => {
    return { isModalOpen: state.uiState.loginModalIsOpen };
})(HeaderLoggedOut);
