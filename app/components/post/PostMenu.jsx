import React from 'react';
import * as Redux from 'react-redux';
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
        const { handleDeletePost } = this.props;
        const tl = new TimelineLite();
        tl.to(this.postmenu, 0.1, {
            ease: Power1.easeIn,
            transformOrigin: 'right top',
            opacity: 0
        });
        tl.play();
        tl.eventCallback('onComplete', handleDeletePost);
    },

    editPost(){
        const { handleEditPost } = this.props;
        const tl = new TimelineLite();
        tl.to(this.postmenu, 0.1, {
            ease: Power1.easeIn,
            transformOrigin: 'right top',
            opacity: 0
        });
        tl.play();
        tl.eventCallback('onComplete', handleEditPost);
    },

    animateOut(){
        const { handlePostMenu } = this.props;
        const tl = new TimelineLite();
        tl.to(this.postmenu, 0.1, {
            ease: Power1.easeIn,
            transformOrigin: 'right top',
            opacity: 0
        });
        tl.play();
        tl.eventCallback('onComplete', handlePostMenu);
    },

    render(){

        const { posterIsSelf } = this.props;

        const renderFollowPost = () => {
            if (posterIsSelf){
                return (
                    <div className="post-menu-option">
                        <div>
                            <i className="fa fa-minus-square" aria-hidden="true" />Unfollow This Post
                        </div>
                        <div className="post-menu-description">
                            Stop receiving notifications about your post.
                        </div>
                    </div>
                );
            }

            return (
                <div className="post-menu-option">
                    <div>
                        <i className="fa fa-plus-square" aria-hidden="true" />Follow This Post
                    </div>
                    <div className="post-menu-description">
                        Receive notifications about this post.
                    </div>
                </div>
            );
        };

        const renderFollowUser = () => {
            if (!posterIsSelf) {
                return (
                    <div className="post-menu-option">
                        <i className="fa fa-user-plus" aria-hidden="true" />Follow This User
                    </div>
                );
            }

            return '';
        };

        const renderFlagPost = () => {
            if (!posterIsSelf) {
                return (
                    <div className="post-menu-option">
                        <i className="fa fa-flag" aria-hidden="true" />Flag This Post
                    </div>
                );
            }
        };

        const renderEditOptions = () => {
            if (posterIsSelf) {
                return (
                    <div>
                        <div className="post-menu-divider" />
                        <div
                            className="post-menu-option"
                            onClick={ this.editPost }>
                            <i className="fa fa-pencil-square-o" aria-hidden="true" />Edit This Post
                        </div>
                        <div
                            className="post-menu-option"
                            onClick={ this.deletePost }>
                            <i className="fa fa-times" aria-hidden="true" />Delete This Post
                        </div>
                    </div>
                );
            }

            return '';
        };

        console.log('posterIsSelf? ', posterIsSelf);
        return (
            <div
                ref={ element => this.postmenu = element }
                onMouseLeave={ this.animateOut }
                className="post-menu">
                { renderFollowPost() }
                { renderFollowUser() }
                { renderFlagPost() }
                { renderEditOptions() }
            </div>
        );
    }

});

export default Redux.connect()(PostMenu);
