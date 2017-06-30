import React from 'react';
import * as Redux from 'react-redux';
import onClickOutside from 'react-onclickoutside';

import {
    TweenLite,
    TimelineLite,
    Power2
} from 'gsap';
import { changeTab } from 'actions/HeaderComposeActions';
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

        console.log('onCloseCompose called.');
        const { onToggle } = this.props;
        // If compose is open, animate it out.
        if (this.isComposeOpen()){
            console.log('Received cue to close compose menu.');
            const tl = new TimelineLite();
            tl.to(this.composeRef, 0.2, {
                ease: Power2.easeOut,
                opacity: 0
            });
            tl.play();
            tl.eventCallback('onComplete', () => this.isComposeOpen() && onToggle);
        }
    },

    handleClickOutside(){
        console.log('handleClickOutside called.');
        this.onCloseCompose();
    },

    handleTabClick(tab){
        const { dispatch } = this.props;
        dispatch(changeTab(tab));
    },

    handlePostSubmit(parsedPost){
        // Make sure to update action & reducer to store raw & parsed post!
        const { dispatch } = this.props;
        dispatch(writePost(parsedPost));
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
                        // <ClickScreen handleClick={ this.onCloseCompose }>
                        <Composer
                            onClose={ this.onCloseCompose }
                            onSubmit={ this.handlePostSubmit } />
                        // </ClickScreen>
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
        headerMenu: state.uiState.headerMenu,
        tabSelected: state.headerCompose.currentTab
    };
})(HeaderCompose);
