import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from 'actions';

import Input from './../../elements/Input';
import Button from './../../elements/Button';

class ForgotPassword extends Component {
    render(){
        return(
            <div>
                <Input name="Email or Username" />
                <Button btnType="main" btnIcon="" btnText="Retrieve Password" />
            </div>
        );
    }
});

export default connect()(ForgotPassword);
