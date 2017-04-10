import React from 'react';
import * as Redux from 'react-redux';

export const ProfileWrapper = React.createClass({

    render(){
        return (
            <div className="profile-wrapper" />
        );
    }
});

export default Redux.connect(state => {
    return {
        user: state.user
    };
})(ProfileWrapper);
