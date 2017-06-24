import React from 'react';

export const ClickScreen = React.createClass({

    propTypes: {
        onClick: React.PropTypes.func.isRequired
    },

    componentWillMount(){
        document.addEventListener('click', this.handleClickOutside, false);
    },

    componentWillUnmount(){
        document.removeEventListener('click', this.handleClickOutside, false);
    },

    handleClickOutside(e){
        if (this.clickScreenRef !== e.target && !this.clickScreenRef.contains(e.target)) {
            this.props.onClick(e);
        }
    },

    render(){

        return (
            <div
                ref={ element => this.clickScreenRef = element }
                className="click-screen">
                { this.props.children }
            </div>
        );
    }

});

export default ClickScreen;
