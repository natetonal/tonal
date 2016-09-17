import React from 'react';
import { Field, reduxForm } from 'redux-form';
import validate from './validateSignup';
import Input from './../../helpers/Input';
import Button from './../../helpers/Button';

export const Signup = React.createClass({

    renderInput(field){

        const { label, type, input, meta: { touched, error }} = field;

        return (
            <Input input={ input }
                   label={ label }
                   type={ type }
                   filled={ input.value ? true : false }
                   touched={ touched }
                   error={ error } />
        );
    },

    render(){

        console.log(this.props);
        const { handleSubmit } = this.props;

        return(
            <div>
                <form onSubmit={ handleSubmit }>
                    <Field name="email" label="Email" type="text" component={ this.renderInput } />
                    <Field name="username" label="Username" typpe="text" component={ this.renderInput } />
                    <Field name="password" label="Password" type="password" component={ this.renderInput } />
                    <Field name="confirmPassword" label="Confirm Password" type="password" component={ this.renderInput } />
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
