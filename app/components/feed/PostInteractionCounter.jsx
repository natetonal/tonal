import React, { Component } from 'react';
import {
    TweenLite,
    Power1
} from 'gsap';

class PostInteractionCounter extends Component {

    componentDidUpdate = prevProps => {
        if (prevProps.count !== this.props.count) {
            TweenLite.from(this.countRef, 0.25, {
                ease: Power1.easeOut,
                opacity: 0
            });
        }
    }

    render(){

        const { count } = this.props;

        return (
            <div className="tonal-post-interaction-counter">
                <span ref={ e => this.countRef = e }>{ count || 0 }</span>
            </div>
        );
    }
}

export default PostInteractionCounter;
