import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Link } from 'react-router';
import * as actions from 'actions';

import Input from './../../helpers/Input';
import Button from './../../helpers/Button';
import validate from './validate';

export const Login = React.createClass({

    handleFormSubmit(values){

        const { email, password } = values;
        const { dispatch } = this.props;

        return dispatch(actions.startEmailLogin(email, password)).catch((error) => {
            console.log("login: there was an error: ", error);
        });

    },

    render(){

        const { handleSubmit, submitting } = this.props;

        return(
            <div>
                <form onSubmit={ handleSubmit(this.handleFormSubmit) }>
                    <Field name="email" label="Email" type="text" component={ Input } />
                    <Field name="password" label="Password" type="password" component={ Input } />
                    <Button type="submit" btnType="main" isLoading={ submitting } btnIcon="" btnText={ submitting ? "Submitting" : "Sign In"} />
                    <p className="text-center">-OR-</p>
                    <Button btnType="facebook" btnIcon="fa-facebook-official" btnText="Sign In With Facebook" />
                    <p className="text-center">
                        <Link to="#" className="forgot-password">I forgot my password</Link>
                    </p>
                </form>
            </div>
        );
    }
});

export default reduxForm({
  form: 'login',
  validate
})(Login);
