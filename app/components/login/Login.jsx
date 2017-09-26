import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Link } from 'react-router-dom';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import { startEmailLogin } from 'actions/AuthActions';
import { createUserWithFacebookAuth } from 'actions/UserActions';
import { switchLoginModalUI } from 'actions/UIStateActions';

import Input from 'elements/Input';
import Button from 'elements/Button';
import validate from './validatelogin';

class Login extends Component {

    constructor(props){

        super(props);

        this.state = {
            showForm: false
        };
    }

    handleFormSubmit = values => {
        const { email, password } = values;
        const { dispatch } = this.props;
        return dispatch(startEmailLogin(email, password));
    }

    handleFacebookLogin = event => {
        event.preventDefault();
        const { dispatch } = this.props;
        return dispatch(createUserWithFacebookAuth());
    }

    handleLoginModalUI = event => {
        event.preventDefault();
        const loginModalUI = event.target.getAttribute('name');
        const { dispatch } = this.props;
        return dispatch(switchLoginModalUI(loginModalUI));
    }

    toggleLoginForm = () => {
        this.setState({
            showForm: !this.state.showForm
        });
    }

    render(){

        const {
            handleSubmit,
            submitting
        } = this.props;

        const { showForm } = this.state;

        const displayForm = () => {
            if (showForm){
                return (
                    <div className="login-form-email">
                        <form onSubmit={ handleSubmit(this.handleFormSubmit) }>
                            <Field
                                name="email"
                                label="Email"
                                type="text"
                                component={ Input } />
                            <Field
                                name="password"
                                label="Password"
                                type="password"
                                component={ Input } />
                            <Button
                                type="submit"
                                btnType="main"
                                isLoading={ submitting }
                                btnIcon=""
                                btnText={ submitting ? 'Submitting' : 'Log In' } />
                        </form>
                    </div>
                );
            }

            return '';
        };

        return (
            <div>
                <Button
                    onClick={ this.handleFacebookLogin }
                    btnType="facebook"
                    btnIcon="fa-facebook-official"
                    btnText="Log In With Facebook" />
                <p className="text-center">
                    -OR-
                </p>
                <Button
                    onClick={ this.toggleLoginForm }
                    btnType="main"
                    btnIcon="fa-envelope"
                    btnText="Log In By E-Mail" />
                <div className="login-form-email-container">
                    <ReactCSSTransitionGroup
                        transitionName="fade-and-grow-slow"
                        transitionEnterTimeout={ 500 }
                        transitionLeaveTimeout={ 500 }>
                        { displayForm() }
                    </ReactCSSTransitionGroup>
                </div>
                <p className="text-center">
                    <Link
                        name="forgot-password"
                        to="#"
                        onClick={ this.handleLoginModalUI }
                        className="forgot-password">
                        I forgot my password
                    </Link>
                </p>
            </div>
        );
    }
}

export default reduxForm({
    form: 'login',
    validate
})(Login);
