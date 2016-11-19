import React from 'react';
import * as Redux from 'react-redux';
import * as actions from 'actions';

export const ProfileWrapper = React.createClass({

    render(){

        return(
            <div className="profile-wrapper">
                
            </div>
        );
    }
});

export default Redux.connect(state => {
    return {
        user: state.user
    };
})(ProfileWrapper);
