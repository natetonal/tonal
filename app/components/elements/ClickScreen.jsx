import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ClickScreen extends Component {

    componentWillMount(){
        document.addEventListener('click', this.handleClickOutside, false);
    }

    componentWillUnmount(){
        document.removeEventListener('click', this.handleClickOutside, false);
    }

    handleClickOutside(e){

        const domNode = this.domNode;
        if ((!domNode ||
            !domNode.contains(e.target)) &&
            typeof this.props.handleClick === 'function') {
            console.log('Closing.');
            this.props.handleClick(e);
        } else {
            console.log('Ignoring this click.');
        }
    }

    render(){

        return (
            <div
                ref={ element => this.domNode = element }
                className="click-screen">
                { this.props.children }
            </div>
        );
    }
}

ClickScreen.propTypes = {
    handleClick: PropTypes.func.isRequired
};

export default ClickScreen;
