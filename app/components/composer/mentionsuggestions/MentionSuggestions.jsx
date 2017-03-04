import React from 'react';
import * as Redux from 'react-redux';
import * as actions from 'actions';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import DummyData from './dummydata';

export const MentionSuggestions = React.createClass({

    render(){

        const { query } = this.props;

        return (
            <ReactCSSTransitionGroup
                component="div"
                transitionName="fade-and-grow"
                transitionAppear
                transitionAppearTimeout={ 200 }
                transitionEnter={ false }
                transitionLeave
                transitionLeaveTimeout={ 200 }>
                <div className="mention-suggestions">
                    SUGGESTIONS:
                    { query }
                </div>
            </ReactCSSTransitionGroup>
        );
    }

});

export default Redux.connect(state => {
    return {
        query: state.composer.query
    };
})(MentionSuggestions);
