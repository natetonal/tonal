import React from 'react';
import { Field, reduxForm } from 'redux-form';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import {
    createUserWithFacebookAuth,
    createUserWithEmailAndPassword
} from 'actions/UserActions';

import Input from 'elements/Input';
import Button from 'elements/Button';

import {
    validate,
    warn
} from './validatesignup';

export const Signup = React.createClass({

    componentWillMount(){
        this.setState({
            showForm: false
        });
    },

    handleFacebookLogin(event){
        event.preventDefault();
        const { dispatch } = this.props;
        return dispatch(createUserWithFacebookAuth());
    },

    handleFormSubmit(values){
        const {
            email,
            password
        } = values;
        const { dispatch } = this.props;
        return dispatch(createUserWithEmailAndPassword(email, password));
    },

    handleStop(event){
        event.preventDefault();
    },

    toggleSignupForm(){
        this.setState({
            showForm: !this.state.showForm
        });
    },

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
                                tooltip={ 'A verification e-mail will be sent to this address to confirm your account before you can log in.' }
                                component={ Input }
                                onPaste={ this.handleStop }
                                onDrop={ e => this.handleStop(e) } />
                            {/* <Field
                                name="displayName"
                                label="Full Name / Display Name"
                                type="text"
                                tooltip={ 'This is how everyone else will view you on our network. We recommend making it the same name you use in your day-to-day life, your artist name, or your band name.' }
                                component={ Input }
                                format={ value => formatDisplayName(value) }
                                onPaste={ this.handleStop }
                                onDrop={ e => this.handleStop(e) } />
                            <Field
                                name="username"
                                label="User Name"
                                type="text"
                                tooltip={ 'This will be how Tonal identifies you internally. This name will appear in your profile address and in shared content from you. Choose carefully, as there is no way to change it later!' }
                                component={ Input }
                                format={ value => formatUsername(value) }
                                onPaste={ this.handleStop }
                                onDrop={ e => this.handleStop(e) } /> */}
                            <Field
                                name="password"
                                label="Password"
                                type="password"
                                tooltip={
                                    `Your password must:
                                    - Be at least 8 characters long
                                    - Contain at least one capitalized letter
                                    - Contain at least one lowercase letter
                                    - Contain at least one number
                                    - Contain at least one symbol`
                                }
                                component={ Input }
                                onPaste={ this.handleStop }
                                onDrop={ e => this.handleStop(e) } />
                            <Button
                                type="submit"
                                btnType="main"
                                isLoading={ submitting }
                                btnIcon=""
                                btnText={ submitting ? 'Submitting' : 'Create Account' } />
                        </form>
                    </div>
                );
            }

            return '';
        };

        return (
            <div>
                <div>
                    <Button
                        onClick={ this.handleFacebookLogin }
                        btnType="facebook"
                        btnIcon="fa-facebook-official"
                        btnText="Sign Up With Facebook" />
                </div>
                <p className="text-center">
                    -OR-
                </p>
                <Button
                    onClick={ this.toggleSignupForm }
                    btnType="main"
                    btnIcon="fa-envelope"
                    btnText="Sign Up By E-Mail" />
                <div className="login-form-email-container">
                    <ReactCSSTransitionGroup
                        transitionName="fade-and-grow-slow"
                        transitionEnterTimeout={ 500 }
                        transitionLeaveTimeout={ 500 }>
                        { displayForm() }
                    </ReactCSSTransitionGroup>
                </div>
            </div>
        );
    }
});

export default reduxForm({
    form: 'signup',
    validate,
    warn
})(Signup);
