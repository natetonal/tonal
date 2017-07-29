import React from 'react';
import {
    TweenLite,
    Power2
} from 'gsap';

import Composer from 'composer/Composer';

export const Thread = React.createClass({

    componentDidUpdate(prevProps){
        if (prevProps.showReply !== this.props.showReply){
            const on = this.props.showReply === true;
            TweenLite.fromTo(this.userReplyRef, 0.25, {
                opacity: (on ? 0 : 1),
                maxHeight: (on ? 0 : '500px'),
                scaleY: (on ? 0 : 1),
            }, {
                ease: Power2.easeOut,
                transformOrigin: 'top top',
                opacity: (on ? 1 : 0),
                maxHeight: (on ? '500px' : 0),
                scaleY: (on ? 1 : 0),
            });
        }
    },

    render(){

        const {
            thread,
            showReply,
            toggleReply
        } = this.props;

        const renderUserReplyWindow = () => {
            if (showReply){
                return (
                    <div className="tonal-thread-user-reply-container">
                        <div
                            className="tonal-user-reply-close"
                            onClick={ toggleReply }>
                            <i className="fa fa-times" aria-hidden="true" />
                        </div>
                        <Composer
                            submitText={ 'Reply ' }
                            onClose={ toggleReply }
                            onSubmit={ toggleReply } />
                    </div>
                );
            }
        };

        return (
            <div className="tonal-thread">
                <div
                    ref={ element => this.userReplyRef = element }
                    className="tonal-thread-user-reply">
                    { renderUserReplyWindow() }
                </div>
                <div className="tonal-replies">
                    { thread || '(comment & share do not work yet.)' }
                </div>
            </div>
        );
    }

});

export default Thread;
