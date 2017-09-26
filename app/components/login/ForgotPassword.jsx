import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Link } from 'react-router-dom';
import { switchLoginModalUI } from 'actions/UIStateActions';
import { sendPasswordResetEmail } from 'actions/UserActions';

import Input from 'elements/Input';
import Button from 'elements/Button';
import validate from './validatelogin';

class ForgotPassword extends Component {

    handleLoginModalUI = event => {
        event.preventDefault();
        const loginModalUI = event.target.getAttribute('name');
        const { dispatch } = this.props;
        return dispatch(switchLoginModalUI(loginModalUI));
    }

    handleFormSubmit = values => {
        const { email } = values;
        const { dispatch } = this.props;
        return dispatch(sendPasswordResetEmail(email));
    }

    render(){

        const {
            handleSubmit,
            submitting
        } = this.props;

        return (
            <div>
                <h3>Forgot Your Password?</h3>
                <p>
                    { 'No worries, we\'ve got you. Go ahead and reset away. Maybe next time, you can try writing it down somewhere or, you know, not forgetting it. Whatever.' }
                </p>
                <form onSubmit={ handleSubmit(this.handleFormSubmit) }>
                    <Field
                        name="email"
                        label="Email"
                        type="text"
                        component={ Input } />
                    <Button
                        type="submit"
                        btnType="main"
                        isLoading={ submitting }
                        btnIcon=""
                        btnText={ submitting ? 'Submitting' : 'Reset Password' } />
                </form>
                <div>
                    <br />
                    <p className="text-center">
                        <Link
                            name="login"
                            to="#"
                            onClick={ this.handleLoginModalUI }
                            className="forgot-password">
                            Just kidding, I remembered it.
                        </Link>
                    </p>
                </div>
            </div>
        );
    }
}

export default reduxForm({
    form: 'forgot-password',
    validate
})(ForgotPassword);
