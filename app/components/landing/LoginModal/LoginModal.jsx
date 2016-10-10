import React from 'react';
import { Link } from 'react-router';
import * as Redux from 'react-redux';
import * as actions from 'actions';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import Login from './Login';
import Signup from './Signup';
import Alert from 'helpers/Alert';
import Button from 'helpers/Button';

export const LoginModal = React.createClass({

    handleTabs(event){

        event.preventDefault();
        const tabSelected = event.target.getAttribute('name')
        const { dispatch } = this.props;
        dispatch(actions.switchLoginModalTab(tabSelected));
    },

    clearErrors(value){

        console.log('LoginModal.jsx: clearing errors');
        const { dispatch } = this.props;
        dispatch(actions.resetErrorMessage());
    },

    handleFacebookLogin(event){

        event.preventDefault();
        console.log('Login.jsx: logging into FB');
        const { dispatch } = this.props;
        return dispatch(actions.startFacebookLogin());

    },

    render(){

        const { isOpen, tabSelected, verificationEmailSent, error } = this.props;

        if(error){ console.log('LoginModal.jsx: error: ', error); }

        const loginModalUI = () => {
            if(verificationEmailSent){
                return(
                    <div>Account verification email has been sent. Click the link in your email to confirm your account.</div>
                );
            } else {
                return(
                    <div onClick={ this.clearErrors }>
                        <ReactCSSTransitionGroup transitionName="callout" transitionEnterTimeout={300} transitionLeaveTimeout={300}>
                        { error && (
                            <Alert
                                type="error"
                                title={ tabSelected == 'login' ? 'Error with your login' : 'Error with your signup' }
                                message={ error }
                            />
                        )}
                        </ReactCSSTransitionGroup>
                        <div className="login-area">
                            <ReactCSSTransitionGroup transitionName="example" transitionEnterTimeout={250} transitionLeaveTimeout={1}>
                                { tabSelected === 'login' ? <Login key="login" /> : <Signup key="signup" /> }
                            </ReactCSSTransitionGroup>
                            { tabSelected === 'login' && (
                                <div>
                                    <p className="text-center">-OR-</p>
                                    <Button onClick={ this.handleFacebookLogin } btnType="facebook" btnIcon="fa-facebook-official" btnText="Sign In With Facebook" />
                                    <p className="text-center">
                                        <Link to="#" className="forgot-password">I forgot my password</Link>
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className="login-tabs">
                            <div className={`login-tab ${tabSelected === 'signup' ? 'selected' : ''} `}>
                                <Link name="signup"
                                      to="#"
                                      onClick={this.handleTabs}
                                      className="login-tabs-label">Sign Up</Link>
                            </div>
                            <div className={`login-tab ${tabSelected === 'login' ? 'selected' : ''} `}>
                                <Link name="login"
                                      to="#"
                                      onClick={this.handleTabs}
                                      className="login-tabs-label">Log In</Link>
                            </div>
                        </div>
                    </div>
                );
            }
        };

        return(
            <div className={`md-modal md-effect-1 ${isOpen ? "md-show" : ""}`} id="modal-1">
            	<div className="md-content">
                    <ReactCSSTransitionGroup transitionName="example" transitionEnterTimeout={250} transitionLeaveTimeout={1}>
                        { loginModalUI() }
                    </ReactCSSTransitionGroup>
            	</div>
            </div>
        );
    }
});

export default Redux.connect(state => {
    return {
        isOpen: state.uiState.loginModalIsOpen,
        tabSelected: state.uiState.loginModalTabSelected || 'login',
        verificationEmailSent: state.auth.verificationEmailSent,
        error: state.errors
    };
})(LoginModal);
