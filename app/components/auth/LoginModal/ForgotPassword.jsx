import React from 'react';
import { Link } from 'react-router';
import * as Redux from 'react-redux';
import * as actions from 'actions';

import Input from './../../elements/Input';
import Button from './../../elements/Button';

export const ForgotPassword = React.createClass({
    render(){
        return(
            <div>
                <Input name="Email or Username" />
                <Button btnType="main" btnIcon="" btnText="Retrieve Password" />
            </div>
        );
    }
});

export default Redux.connect()(ForgotPassword);
