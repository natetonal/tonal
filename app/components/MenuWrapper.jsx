import React from 'react';
import * as Redux from 'react-redux';
import { Link } from 'react-router';
import * as actions from 'actions';
import Hammer from 'react-hammerjs';

import Menu from './Menu';

export const MenuWrapper = React.createClass({

    handleClick(event){
        event.preventDefault();
        var { dispatch } = this.props;
        dispatch(actions.toggleMenu());
    },

    render(){

        var { isOpen } = this.props;

        return(
            <Hammer onSwipe={ !isOpen ? this.handleClick : false} direction="DIRECTION_RIGHT">
                <div id="tonal-container" className={`tonal-container menu-effect ${isOpen ? "tonal-menu-open" : ""}`}>
                    <Menu />
                    <Hammer onSwipe={ isOpen ? this.handleClick : false }
                            direction="DIRECTION_LEFT">
                        <div className="tonal-pusher" onMouseDown={ isOpen ? this.handleClick : false }>
                            <div className="tonal-main">
                                <div className="tonal-main-inner">
                                        {this.props.children}
                                </div>
                            </div>
                        </div>
                    </Hammer>
                </div>
            </Hammer>
        );
    }
});

export default Redux.connect(state => {
    return { isOpen: state.uiState.menuIsOpen };
})(MenuWrapper);
