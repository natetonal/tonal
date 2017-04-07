import React from 'react';
import * as Redux from 'react-redux';

export const Button = React.createClass({

    displayIcon(btnIcon){
        return btnIcon ? <i className={ `fa ${ btnIcon }` } aria-hidden="true" /> : '';
    },

    loading(isLoading){
        return isLoading ? <i className="fa fa-cog fa-spin fa-fw" /> : '';
    },

    render(){

        const {
            hoverArrow,
            btnText,
            btnType,
            btnIcon,
            isLoading,
            type,
            disabled,
            onClick
        } = this.props;

        return (
            <button
                onClick={ onClick }
                type={ type }
                disabled={ disabled }
                className={ `tonal-btn ${ btnType || 'main' } ${ hoverArrow ? 'icon-arrow-right' : '' } ${ disabled ? 'disabled' : '' }` }>
                { this.displayIcon(btnIcon) }{ btnText }{ this.loading(isLoading) }
            </button>
        );
    }
});

export default Redux.connect()(Button);
