import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Link } from 'react-router';
import * as actions from 'actions';

import Input from 'helpers/Input';
import Button from 'helpers/Button';
import validate from './validate';

export const ResetPassword = React.createClass({

    handleFormSubmit(values){


        const { password } = values;
        const { dispatch, userEmail, oobCode } = this.props;

        return dispatch(actions.resetPasswordAndLoginUser(oobCode, userEmail, password));

    },

    render(){

        const { userEmail, handleSubmit, submitting } = this.props;


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
