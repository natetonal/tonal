import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Link } from 'react-router';
import * as actions from 'actions';

import Input from 'helpers/Input';
import Button from 'helpers/Button';
import validate from './validate';

export const ResetPassword = React.createClass({

    handleFormSubmit(values){

        console.log('ResetPassword.jsx: handleFormSubmit called with values: ', values);

        const { password } = values;
        const { dispatch, userEmail, location: { query: { mode, oobCode }}} = this.props;

        console.log('ResetPassword.jsx: oobCode: ', oobCode);
        console.log(`ResetPassword.jsx: dispatching resetPasswordAndLoginUser with email ${userEmail} and pw ${password}`);
        return dispatch(actions.resetPasswordAndLoginUser(oobCode, userEmail, password));

    },

    render(){

        const { userEmail, handleSubmit, submitting } = this.props;

        console.log('ResetPassword.jsx: userEmail is ', userEmail);

        return(
            <div className="login-reset-password">
                <h3>Reset Password</h3>
                <p>Thank you for verifying your email, { userEmail }. Please enter a new password below:</p>
                <form onSubmit={ handleSubmit(this.handleFormSubmit) }>
                    <Field name="password" label="New Password" type="password" component={ Input } />
                    <Field name="confirmPassword" label="Confirm Password" type="password" component={ Input } />
                    <Button type="submit" btnType="main" isLoading={ submitting } btnIcon="" btnText={ submitting ? "Submitting" : "Reset Password" } />
                </form>
            </div>
        );
    }
});

export default reduxForm({
  form: 'reset-password',
  validate
})(ResetPassword);
