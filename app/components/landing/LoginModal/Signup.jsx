import React from 'react';
import { Field, reduxForm } from 'redux-form';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import {
    createUserWithFacebookAuth,
    createUserWithTwitterAuth,
    createUserWithEmailAndPassword
} from 'actions/UserActions';

import validate from './validate';
import Input from './../../elements/Input';
import Button from './../../elements/Button';

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

    handleTwitterLogin(event){
        event.preventDefault();
        const { dispatch } = this.props;
        return dispatch(createUserWithTwitterAuth());
    },

    handleFormSubmit(values){
        const {
            email,
            password
        } = values;
        const { dispatch } = this.props;
        return dispatch(createUserWithEmailAndPassword(email, password));
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

        const formatUsername = value => {
            if (value){
                return value.toLowerCase()
                            .replace(/[^0-9A-Za-z]/i, '');
            }

            return '';
        };

        const formatDisplayName = value => {
            if (value){
                console.log('current value: ', value);
                console.log(value.match(/([0-9a-zA-Z])\1{2,}/i));
                return value.toLowerCase()
                            .replace(/[^0-9A-Za-z().&!? ]/i, '')
                            .replace(/\b[0-9A-Za-z().&!? ]/g, l => l.toUpperCase());
            }

            return '';
        };

        const displayForm = () => {
            if (showForm){
                return (
                    <form onSubmit={ handleSubmit(this.handleFormSubmit) }>
                        <Field
                            name="email"
                            label="Email"
                            type="text"
                            component={ Input } />
                        <Field
                            name="displayName"
                            label="Full Name or Display Name"
                            type="text"
                            component={ Input }
                            format={ value => formatDisplayName(value) } />
                        <Field
                            name="username"
                            label="User Name"
                            type="text"
                            component={ Input }
                            format={ value => formatUsername(value) } />
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
                            btnText={ submitting ? 'Submitting' : 'Create Account' } />
                    </form>
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
                    onClick={ this.handleTwitterLogin }
                    btnType="main"
                    btnIcon="fa-envelope"
                    btnText="Sign Up By E-Mail" />
                <ReactCSSTransitionGroup
                    transitionName="fade-and-grow-slow"
                    transitionEnterTimeout={ 400 }
                    transitionLeaveTimeout={ 400 }>
                    { displayForm() }
                </ReactCSSTransitionGroup>
            </div>
        );
    }
});

export default reduxForm({
    form: 'signup',
    validate
})(Signup);
