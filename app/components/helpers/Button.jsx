import React from 'react';
import * as Redux from 'react-redux';
import * as actions from 'actions';

export const Button = React.createClass({

    displayIcon(){
        const { btnIcon } = this.props;
        if(btnIcon){
            return(
                <i className={`fa ${ btnIcon }`} aria-hidden="true"></i>
            );
        }
        return "";
    },

    render(){

        const { hoverArrow, btnText, btnType } = this.props;

        return(
            <button className={`tonal-btn ${btnType || "main"} ${hoverArrow ? "icon-arrow-right" : ""}`}>
                { this.displayIcon() }{ btnText }
            </button>
        );
    }
});

export default Redux.connect()(Button);
