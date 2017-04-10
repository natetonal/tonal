import React from 'react';
import * as Redux from 'react-redux';
import {
    toggleLoginModal,
    switchLoginModalUI
} from 'actions/UIStateActions';

import {
    verifyEmailWithCode,
    verifyPasswordResetCode
} from 'actions/AuthActions';

import LoginModal from './LoginModal/LoginModal';

export const Landing = React.createClass({

    componentDidMount(){
        if (this.props.location){
            const { dispatch, location: { query: { mode, oobCode }}} = this.props;
            if (mode === 'resetPassword' && oobCode){
                dispatch(toggleLoginModal());
                dispatch(switchLoginModalUI('reset-password'));
                dispatch(verifyPasswordResetCode(oobCode));
            } else if (mode === 'verifyEmail' && oobCode){
                dispatch(toggleLoginModal());
                dispatch(switchLoginModalUI('verifying-email'));
                dispatch(verifyEmailWithCode(oobCode));
            }
        }
    },

    render(){

        const { isModalOpen } = this.props;

        return (
            <div>
                <LoginModal />
                <div className={ `auth-content ${ isModalOpen ? 'blur' : '' }` }>
                    <div className="landing-section section-1" />
                </div>
            </div>
        );
    }
});

export default Redux.connect(state => {
    return {
        isOpen: state.uiState.loginModalIsOpen,
    };
})(Landing);
