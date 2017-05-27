import React from 'react';

export const ClickScreen = React.createClass({

    propTypes: {
        onClick: React.PropTypes.func.isRequired
    },

    render(){

        return (
            <div
                ref={ element => this.clickScreenRef = element }
                onClick={ e => this.props.onClick(e) }
                className="click-screen" />
        );
    }

});

export default ClickScreen;
