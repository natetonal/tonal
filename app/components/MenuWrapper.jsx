import React from 'react';
import * as Redux from 'react-redux';
import { switchHeaderMenu } from 'actions/UIStateActions';
// import Hammer from 'react-hammerjs'; - add this back in later for swiping.

import Menu from './Menu';

export const MenuWrapper = React.createClass({

    handleClick(menu, event){
        event.preventDefault();
        const {
            dispatch,
            headerMenu
        } = this.props;
        if (event.target === this.wrapperRef){
            if (headerMenu === menu){
                dispatch(switchHeaderMenu());
            } else {
                dispatch(switchHeaderMenu(menu));
            }
        }
    },

    isOpen(){
        return this.props.headerMenu === 'settings';
    },

    render(){

        return (
            <div
                id="tonal-container"
                className={ `tonal-container menu-effect ${ this.isOpen() ? 'tonal-menu-open' : '' }` }>
                <Menu />
                <div
                    ref={ element => this.wrapperRef = element }
                    className="tonal-pusher"
                    onClick={ e => this.handleClick('settings', e) }>
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
        headerMenu: state.uiState.headerMenu
    };
})(MenuWrapper);
