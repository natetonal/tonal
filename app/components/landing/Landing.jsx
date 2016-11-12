import React from 'react';
import * as Redux from 'react-redux';
import * as actions from 'actions';

import LoginModal from './LoginModal/LoginModal';

export const Landing = React.createClass({

    componentDidMount(){
        if(this.props.location){
            const { dispatch, location: { query: { mode, oobCode }}} = this.props;
            if(mode == 'resetPassword' && oobCode){
                console.log('Landing.jsx: resetting password');
                dispatch(actions.toggleLoginModal());
                dispatch(actions.switchLoginModalUI('reset-password'));
                dispatch(actions.verifyPasswordResetCode(oobCode));
            } else if(mode == 'verifyEmail' && oobCode){
                console.log('Landing.jsx: verifying email');
                dispatch(actions.toggleLoginModal());
                dispatch(actions.switchLoginModalUI('verifying-email'));
                dispatch(actions.verifyEmailWithCode(oobCode));
            }
        }
    },

    render(){

        const { isModalOpen } = this.props;

        return(
            <div>
                <LoginModal />
                <div className={`auth-content ${ isModalOpen ? "blur" : "" }`}>
                    <div className="landing-section section-1">
                    </div>
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
