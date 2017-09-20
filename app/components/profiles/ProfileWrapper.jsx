import React, { Component } from 'react';
import * as Redux from 'react-redux';

class ProfileWrapper extends Component {

    render(){
        return (
            <div className="profile-wrapper" />
        );
    }
}

export default Redux.connect(state => {
    return {
        user: state.user
    };
})(ProfileWrapper);
