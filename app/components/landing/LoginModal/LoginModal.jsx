import React from 'react';
import * as Redux from 'react-redux';
import * as actions from 'actions';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import Alert from 'elements/Alert';
import Button from 'elements/Button';

import Login from './Login';
import Signup from './Signup';
import LoginTabs from './LoginTabs';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import VerifyingEmail from './VerifyingEmail';
import LoginEmailSent from './LoginEmailSent';

export const LoginModal = React.createClass({

    clearErrors(value){
        const { dispatch } = this.props;
        dispatch(actions.resetErrorMessage());
    },

    render(){

        const { email, isOpen, loginModalUI, error, oobCode } = this.props;


        const displayError = () => {
            if(error){
                return(
                    <ReactCSSTransitionGroup transitionName="callout" transitionEnterTimeout={300} transitionLeaveTimeout={300}>
                    <Alert
                        type="error"
                        title={ 'We have a problem.' }
                        message={ error }
                    />
                    </ReactCSSTransitionGroup>
                );
            }
        };

        const loginModalView = () => {
            switch(loginModalUI){
                case 'login':
                    return <Login key="login" />;
                case 'signup':
                    return <Signup key="signup" />;
                case 'forgot-password':
                    return <ForgotPassword key="forgot-password" />;
                case 'reset-password':
                    return <ResetPassword oobCode={ oobCode } userEmail={ email } key="reset-password" />;
                case 'verifying-email':
                    return <VerifyingEmail key="verifying-email" />
                case 'email-sent-verify':
                case 'email-sent-password':
                    return <LoginEmailSent key="email-sent" />;
                default:
                    return <div></div>;
            };
        };

        return(
            <div className={`md-modal md-effect-1 ${isOpen ? "md-show" : ""}`} id="modal-1">
            	<div className="md-content">
                    <ReactCSSTransitionGroup transitionName="example" transitionEnterTimeout={250} transitionLeaveTimeout={1}>
                        <div onClick={ this.clearErrors }>
                            { displayError() }
                            <div className="login-area">
                                <ReactCSSTransitionGroup transitionName="example" transitionEnterTimeout={250} transitionLeaveTimeout={1}>
                                    { loginModalView() }
                                </ReactCSSTransitionGroup>
                            </div>
                            <LoginTabs />
                        </div>
                    </ReactCSSTransitionGroup>
            	</div>
            </div>
        );
    }
});

export default Redux.connect(state => {
    return {
        email: state.user.email,
        isOpen: state.uiState.loginModalIsOpen,
        loginModalUI: state.uiState.loginModalUI,
        error: state.errors,
        oobCode: state.auth.oobCode
    };
})(LoginModal);
