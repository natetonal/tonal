import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Link } from 'react-router';
import { switchLoginModalUI } from 'actions/UIStateActions';
import { sendPasswordResetEmail } from 'actions/UserActions';

import Input from 'elements/Input';
import Button from 'elements/Button';
import validate from './validate';

export const ForgotPassword = React.createClass({

    handleLoginModalUI(event){
        event.preventDefault();
        const loginModalUI = event.target.getAttribute('name');
        const { dispatch } = this.props;
        return dispatch(switchLoginModalUI(loginModalUI));
    },

    handleFormSubmit(values){
        const { email } = values;
        const { dispatch } = this.props;
        return dispatch(sendPasswordResetEmail(email));
    },

    render(){

        const {
            handleSubmit,
            submitting
        } = this.props;

        return (
            <div>
                <h3>Forgot Your Password?</h3>
                <p>
                    { 'How horribly irresponsible of you. No worries - just like your momma, Tonal\'s here to coddle you and make it all OK again. Type in your e-mail and we\'ll send you a password reset link. (If you\'re seeing this Mark, don\'t worry - this is just filler)' }
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
});
//
export default reduxForm({
    form: 'forgot-password',
    validate
})(ForgotPassword);
