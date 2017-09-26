import React, { Component } from 'react';
import { connect } from 'react-redux';

class ProfileWrapper extends Component {

    render(){
        return (
            <div className="profile-wrapper" />
        );
    }
}

export default connect(state => {
    return {
        user: state.user
    };
})(ProfileWrapper);
