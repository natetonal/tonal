import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import * as Redux from 'react-redux';
import * as actions from 'actions';

export const StickerSelector = React.createClass({
    render(){
        const {} = this.props;

        return(
            <ReactCSSTransitionGroup
                transitionName="smooth-popin"
                transitionAppear
                transitionAppearTimeout={ 200 }
                transitionEnter={ false }
                transitionLeave={ false }>
                <div className="sticker-selector">
                    Herro
                </div>
            </ReactCSSTransitionGroup>
        );
    }
});

export default Redux.connect(state => {
    return {};
})(StickerSelector);
