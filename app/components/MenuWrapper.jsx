import React from 'react';
import * as Redux from 'react-redux';
import { toggleMenu } from 'actions/UIStateActions';
// import Hammer from 'react-hammerjs'; - add this back in later for swiping.

import Menu from './Menu';

export const MenuWrapper = React.createClass({

    handleClick(event){
        event.preventDefault();
        const { dispatch } = this.props;
        dispatch(toggleMenu());
    },

    render(){

        const { isOpen } = this.props;

        return (
            <div
                id="tonal-container"
                className={ `tonal-container menu-effect ${ isOpen ? 'tonal-menu-open' : '' }` }>
                <Menu />
                <div
                    className="tonal-pusher"
                    onClick={ isOpen ? this.handleClick : false }>
                    <div className="tonal-main">
                        <div className="tonal-main-inner">
                            { this.props.children }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

export default Redux.connect(state => {
    return {
        isOpen: state.uiState.menuIsOpen
    };
})(MenuWrapper);
