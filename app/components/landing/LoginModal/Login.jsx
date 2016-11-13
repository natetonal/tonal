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

        return dispatch(actions.startEmailLogin(email, password));
    },

    handleFacebookLogin(event){
        event.preventDefault();
        console.log('Login.jsx: logging into FB');
        const { dispatch } = this.props;
        return dispatch(actions.createUserWithFacebookAuth());
    },

    handleLoginModalUI(event){
        event.preventDefault();
        const loginModalUI = event.target.getAttribute('name')
        console.log('Login.jsx: swapping UI: ', loginModalUI);
        const { dispatch } = this.props;
        return dispatch(actions.switchLoginModalUI(loginModalUI));
    },

    render(){

        const { handleSubmit, submitting } = this.props;

        return(
            <div>
                <form onSubmit={ handleSubmit(this.handleFormSubmit) }>
                    <Field name="email" label="Email" type="text" component={ Input } />
                    <Field name="password" label="Password" type="password" component={ Input } />
                    <Button type="submit" btnType="main" isLoading={ submitting } btnIcon="" btnText={ submitting ? "Submitting" : "Log In"} />
                </form>
                <div>
                    <p className="text-center">-OR-</p>
                    <Button onClick={ this.handleFacebookLogin } btnType="facebook" btnIcon="fa-facebook-official" btnText="Log In With Facebook" />
                    <p className="text-center">
                        <Link name="forgot-password"
                              to="#"
                              onClick= { this.handleLoginModalUI }
                              className="forgot-password">I forgot my password</Link>
                    </p>
                </div>
            </div>
        );
    }
});

export default reduxForm({
  form: 'login',
  validate
})(Login);
