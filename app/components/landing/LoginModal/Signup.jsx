import React from 'react';
import { Field, reduxForm } from 'redux-form';
import * as actions from 'actions';

import validate from './validate';
import asyncValidate from './asyncValidate';
import Input from './../../helpers/Input';
import Button from './../../helpers/Button';

export const Signup = React.createClass({

    handleFacebookLogin(event){
        event.preventDefault();
        console.log('LoginModal.jsx: logging into FB');
        const { dispatch } = this.props;
        return dispatch(actions.createUserWithFacebookAuth());
    },

    handleFormSubmit(values){

        const { email, password } = values;
        const { dispatch } = this.props;

        return dispatch(actions.createUserWithEmailAndPassword(email, password));
    },

    render(){

        const { handleSubmit, submitting } = this.props;

        return(
            <div>
                <form onSubmit={ handleSubmit(this.handleFormSubmit) }>
                    <Field name="email" label="Email" type="text" component={ Input } />
                    <Field name="password" label="Password" type="password" component={ Input } />
                    <Field name="confirmPassword" label="Confirm Password" type="password" component={ Input } />
                    <Button type="submit" btnType="main" isLoading={ submitting } btnIcon="" btnText={ submitting ? "Submitting" : "Create Account"} />
                </form>
                <div>
                    <p className="text-center">-OR-</p>
                    <Button onClick={ this.handleFacebookLogin } btnType="facebook" btnIcon="fa-facebook-official" btnText="Sign Up With Facebook" />
                </div>
            </div>
        );
    }
});

export default reduxForm({
  form: 'signup',
  validate
})(Signup);
