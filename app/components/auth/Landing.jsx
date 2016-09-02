import React from 'react';
import * as Redux from 'react-redux';
import * as actions from 'actions';

import LoginModal from './LoginModal/LoginModal';

export const Landing = React.createClass({

    onEmailLogin(){

    },

    onFacebookLogin(){

    },

    render(){

        const { isOpen } = this.props;

        return(
            <div>
                <LoginModal />
                <div className={`auth-content ${ isOpen ? "blur" : "" }`}>
                    <div className="landing-section section-1">
                        YO
                    </div>
                </div>
            </div>
        );
    }
});

export default Redux.connect(state => {
    return { isOpen: state.uiState.loginModalIsOpen };
})(Landing);
