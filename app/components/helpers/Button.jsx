import React from 'react';
import * as Redux from 'react-redux';
import * as actions from 'actions';

export const Button = React.createClass({
    render(){

        const { iconClass, iconText } = this.props;

        return(
            <button className={`tonal-btn ${iconClass}`}>
                { iconText }
            </button>
        );
    }
});

export default Redux.connect()(Button);
