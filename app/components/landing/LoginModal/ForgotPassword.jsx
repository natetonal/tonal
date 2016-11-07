import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Link } from 'react-router';
import * as actions from 'actions';

import Input from 'helpers/Input';
import Button from 'helpers/Button';
import validate from './validate';

export const ForgotPassword = React.createClass({

    handleFormSubmit(values){

        const { email } = values;
        const { dispatch } = this.props;

        console.log('ForgotPassword.jsx: dispatch action to send email for resetting password', email);
        return dispatch(actions.sendPasswordResetEmail(email));

    },

    render(){

        const { handleSubmit, submitting } = this.props;

        return(
            <div>
                <h3>Forgot Your Password?</h3>
                <p>How horribly irresponsible of you. No worries - just like your momma, Tonal's here to coddle you and make it all OK again. Type in your e-mail and we'll send you a password reset link. (If you're seeing this Mark, don't worry - this is just filler)</p>
                <form onSubmit={ handleSubmit(this.handleFormSubmit) }>
                <Field name="email" label="Email" type="text" component={ Input } />
                <Button type="submit" btnType="main" isLoading={ submitting } btnIcon="" btnText={ submitting ? "Submitting" : "Reset Password" } />
                </form>
            </div>
        );
    }
});
//
export default reduxForm({
  form: 'forgot-password',
  validate
})(ForgotPassword);
