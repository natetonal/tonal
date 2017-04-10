import React from 'react';

export const Button = React.createClass({

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

        const displayIcon = () => {
            if (btnIcon){
                return (
                    <i
                        className={ `fa ${ btnIcon }` }
                        aria-hidden="true" />
                );
            }

            return '';
        };

        const loading = () => {
            if (isLoading){
                return <i className="fa fa-cog fa-spin fa-fw" />;
            }

            return '';
        };

        return (
            <button
                onClick={ onClick }
                type={ type }
                disabled={ disabled }
                className={ `tonal-btn ${ btnType || 'main' } ${ hoverArrow ? 'icon-arrow-right' : '' } ${ disabled ? 'disabled' : '' }` }>
                { displayIcon() }{ btnText }{ loading() }
            </button>
        );
    }
});

export default Button;
