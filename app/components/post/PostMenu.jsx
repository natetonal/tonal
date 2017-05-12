import React from 'react';
import * as Redux from 'react-redux';
import { deletePost } from 'actions/PostActions';
import {
    TimelineLite,
    Power1,
    Back
} from 'gsap';

export const PostMenu = React.createClass({

    componentDidMount(){
        const tl = new TimelineLite();
        tl.from(this.postmenu, 0.25, {
            ease: Back.easeOut.config(1.4),
            transformOrigin: 'right top',
            scale: 0
        });
        tl.play();
    },

    deletePost(){
        const {
            dispatch,
            postId
        } = this.props;
        dispatch(deletePost(postId));
    },

    animateOut(){
        const { callback } = this.props;

        const tl = new TimelineLite();
        tl.to(this.postmenu, 0.1, {
            ease: Power1.easeIn,
            transformOrigin: 'right top',
            opacity: 0
        });
        tl.play();
        tl.eventCallback('onComplete', callback);
    },

    render(){

        return (
            <div
                ref={ element => this.postmenu = element }
                onMouseLeave={ this.animateOut }
                className="post-menu">
                <div className="post-menu-option">
                    <i className="fa fa-plus-square" aria-hidden="true" />Follow This Post
                </div>
                <div className="post-menu-option">
                    <i className="fa fa-user-plus" aria-hidden="true" />Follow This User
                </div>
                <div className="post-menu-option">
                    <i className="fa fa-flag" aria-hidden="true" />Flag This Post
                </div>
                <div className="post-menu-divider" />
                <div
                    className="post-menu-option"
                    onClick={ this.deletePost }>
                    <i className="fa fa-times" aria-hidden="true" />Delete This Post
                </div>
            </div>
        );
    }

});

export default Redux.connect()(PostMenu);
