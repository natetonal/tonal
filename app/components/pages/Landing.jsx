import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    toggleLoginModal,
    switchLoginModalUI
} from 'actions/UIStateActions';

import {
    verifyEmailWithCode,
    verifyPasswordResetCode
} from 'actions/AuthActions';

import LoginModal from 'login/LoginModal';

class Landing extends Component {

    componentDidMount = () => {
        const modeCheck = (this.props.location.query && this.props.location.query.mode) || false;
        if (modeCheck){
            console.log('Landing / location: ', this.props.location);
            const {
                dispatch,
                location: {
                    query: {
                        mode,
                        oobCode
                    }
                }
            } = this.props;
            if (mode === 'resetPassword' && oobCode){
                dispatch(toggleLoginModal());
                dispatch(switchLoginModalUI('reset-password'));
                dispatch(verifyPasswordResetCode(oobCode));
            } else if (mode === 'verifyEmail' && oobCode){
                console.log('Landing / mode is verifyEmail and there\'s an oobCode');
                dispatch(toggleLoginModal());
                dispatch(switchLoginModalUI('verifying-email'));
                dispatch(verifyEmailWithCode(oobCode));
            }
        }
    }

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
}

export default connect(state => {
    return {
        isOpen: state.uiState.loginModalIsOpen,
    };
})(Landing);
