import React from 'react';
import * as Redux from 'react-redux';
import * as actions from 'actions';

export const Button = React.createClass({

    displayIcon(btnIcon){
        return btnIcon ? <i className={`fa ${ btnIcon }`} aria-hidden="true"></i> : "";
    },

    loading(isLoading){
        return isLoading ? <i className="fa fa-cog fa-spin fa-fw"></i> : "";
    },

    render(){

        const { hoverArrow, btnText, btnType, btnIcon, isLoading, type } = this.props;

        console.log('Button.jsx: isLoading? ', isLoading);
        
        return(
            <button type={ type } className={`tonal-btn ${btnType || "main"} ${hoverArrow ? "icon-arrow-right" : ""}`}>
                { this.displayIcon(btnIcon) }{ btnText }{ this.loading(isLoading) }
            </button>
        );
    }
});

export default Redux.connect()(Button);
