import React from 'react';
import * as Redux from 'react-redux';
import onClickOutside from 'react-onclickoutside';

import {
    TweenLite,
    TimelineLite,
    Power2
} from 'gsap';
import { uploadPostImage } from 'actions/StorageActions';
import { changeTab } from 'actions/HeaderComposeActions';
import { resetState } from 'actions/ComposerActions';
import { writePost } from 'actions/PostActions';

// import ClickScreen from 'elements/ClickScreen';
import Composer from 'composer/Composer';

const headerComposeTabs = [
    {
        name: 'post',
        icon: 'comment'
    },
    {
        name: 'photos',
        icon: 'camera'
    },
    {
        name: 'videos',
        icon: 'video-camera'
    },
    {
        name: 'event',
        icon: 'calendar-plus-o'
    },
    {
        name: 'song',
        icon: 'microphone'
    }
];

export const HeaderCompose = onClickOutside(React.createClass({

    componentDidMount(){
        TweenLite.from(this.composeRef, 0.4, {
            ease: Power2.easeOut,
            opacity: 0
        });
    },

    componentDidUpdate(prevProps){
        // If compose just opened:
        if (!prevProps.headerMenu !== this.props.headerMenu &&
            this.isComposeOpen()){
            TimelineLite.from(this.composeRef, 0.4, {
                ease: Power2.easeOut,
                opacity: 0
            });
        }
    },

    // Finish this, similar to notifscenter.
    onCloseCompose(){
        const { onToggle } = this.props;
        const isComposeOpen = this.isComposeOpen();
        // If compose is open, animate it out.
        if (isComposeOpen){
            const tl = new TimelineLite();
            tl.to(this.composeRef, 0.2, {
                ease: Power2.easeOut,
                opacity: 0
            });
            tl.play();
            tl.eventCallback('onComplete', onToggle);
        }
    },

    handleClickOutside(){
        this.onCloseCompose();
    },

    handleTabClick(tab){
        const { dispatch } = this.props;
        dispatch(changeTab(tab));
    },

    handlePostSubmit(post){
        // Make sure to update action & reducer to store raw & parsed post!
        const {
            dispatch,
            uid
        } = this.props;

        if (post.file){
            dispatch(uploadPostImage(post))
            .then(updatedPost => {
                console.log('updatedPost: ', updatedPost);
                if (updatedPost){
                    dispatch(writePost(uid, 'feed', updatedPost.type, updatedPost))
                    .then(() => {
                        this.onCloseCompose();
                        dispatch(resetState());
                    });
                } else {
                    console.log('error received from HeaderCompose: ', updatedPost);
                }
            });
        } else {
            dispatch(writePost(uid, 'feed', post.type, post))
            .then(() => {
                dispatch(resetState());
            });
        }
    },

    isComposeOpen(){
        return this.props.headerMenu === 'compose';
    },

    render(){

        const { tabSelected } = this.props;

        const renderTabs = () => {
            return headerComposeTabs.map((tab, index) => {
                const { name, icon } = tab;
                return (
                    <div
                        key={ name + icon + index }
                        onClick={ () => this.handleTabClick(name) }
                        className={ `header-compose-tab ${ tabSelected === name ? 'selected' : '' }` }>
                        <i className={ `fa fa-${ icon }` } aria-hidden="true" />
                        { name }
                    </div>
                );
            });
        };

        const renderComponent = () => {
            let component = '';
            switch (tabSelected){
                case 'post':
                    component = (
                        <Composer
                            type={ 'posts' }
                            onSubmit={ this.handlePostSubmit } />
                    );
                    break;
                default:
                    component = '';
            }

            return component;
        };

        return (
            <div
                ref={ element => this.composeRef = element }
                className="header-compose">
                <div className="header-compose-tab-set">
                    { renderTabs() }
                </div>
                <div className="header-compose-contentarea">
                    { renderComponent() }
                </div>


            </div>
        );
    }
}));

export default Redux.connect(state => {
    return {
        uid: state.auth.uid,
        headerMenu: state.uiState.headerMenu,
        tabSelected: state.headerCompose.currentTab
    };
})(HeaderCompose);
