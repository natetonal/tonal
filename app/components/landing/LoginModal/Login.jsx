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

    render(){

        const { handleSubmit, submitting } = this.props;

        return(
            <div>
                <form onSubmit={ handleSubmit(this.handleFormSubmit) }>
                    <Field name="email" label="Email" type="text" component={ Input } />
                    <Field name="password" label="Password" type="password" component={ Input } />
                    <Button type="submit" btnType="main" isLoading={ submitting } btnIcon="" btnText={ submitting ? "Submitting" : "Log In"} />
                </form>
            </div>
        );
    }
});

export default reduxForm({
  form: 'login',
  validate
})(Login);
