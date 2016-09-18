import React from 'react';
import { Field, reduxForm } from 'redux-form';
import * as actions from 'actions';

import validate from './validate';
import asyncValidate from './asyncValidate';
import Input from './../../helpers/Input';
import Button from './../../helpers/Button';

export const Signup = React.createClass({

    handleFormSubmit(values){
        const { email, password } = values;
        const { dispatch } = this.props;
        dispatch(actions.createUserWithEmailAndPassword(email, password));
    },

    render(){

        const { handleSubmit } = this.props;

        return(
            <div>
                <form onSubmit={ handleSubmit(this.handleFormSubmit) }>
                    <Field name="email" label="Email" type="text" component={ Input } />
                    <Field name="password" label="Password" type="password" component={ Input } />
                    <Field name="confirmPassword" label="Confirm Password" type="password" component={ Input } />
                    <Button type="submit" btnType="main" btnIcon="" btnText="Create Account" />
                </form>
            </div>
        );
    }
});

export default reduxForm({
  form: 'signup',
  validate
})(Signup);
