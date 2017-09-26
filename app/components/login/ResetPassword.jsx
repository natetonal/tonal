import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { resetPasswordAndLoginUser } from 'actions/AuthActions';

import Input from 'elements/Input';
import Button from 'elements/Button';
import validate from './validateresetpw';

class ResetPassword extends Component {

    handleFormSubmit = values => {
        const { password } = values;
        const { dispatch, userEmail, oobCode } = this.props;
        return dispatch(resetPasswordAndLoginUser(oobCode, userEmail, password));
    }

    render(){

        const {
            userEmail,
            handleSubmit,
            submitting
        } = this.props;

        return (
            <div className="login-reset-password">
                <h3>Reset Password</h3>
                <p>
                    Thank you for verifying your email, { userEmail }. Please enter a new password below:
                </p>
                <form onSubmit={ handleSubmit(this.handleFormSubmit) }>
                    <Field
                        name="password"
                        label="New Password"
                        type="password"
                        component={ Input } />
                    <Field
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        component={ Input } />
                    <Button
                        type="submit"
                        btnType="main"
                        isLoading={ submitting }
                        btnIcon=""
                        btnText={ submitting ? 'Submitting' : 'Reset Password' } />
                </form>
            </div>
        );
    }
}

export default reduxForm({
    form: 'reset-password',
    validate
})(ResetPassword);
