import React from 'react';
import * as Redux from 'react-redux';

// Note - you'll need to make sure that any action that sends an e-mail also captures the e-mail address.

const LoginEmailSent = React.createClass({

    render(){

        const { loginModalUI } = this.props;

        const messaging = () => {
            switch (loginModalUI){
                case 'email-sent-verify':
                    return 'Account verification email has been sent. Click the link in your email to confirm your account.';
                case 'email-sent-password':
                    return 'Password reset email has been sent. Click on the link in your email to reset password.';
                default:
                    return 'Email has been sent. Click the link in your email.';
            }
        };

        return (
            <div className="login-verification-email-sent">
                <h2>Email Sent!</h2>
                <h3>
                    <i
                        className="fa fa-thumbs-o-up fa-3x"
                        aria-hidden="true" />
                </h3>
                <h5>{ messaging() }</h5>
            </div>
        );
    }
});

export default Redux.connect(state => {
    return {
        loginModalUI: state.uiState.loginModalUI
    };
})(LoginEmailSent);
