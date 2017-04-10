import React from 'react';
import { Link } from 'react-router';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import * as Redux from 'react-redux';
import {
    toggleHover,
    loadPreview,
    clearPreview
} from 'actions/PreviewLinkActions';

import UserPreview from './UserPreview';

export const PreviewLink = React.createClass({

    componentWillMount(){
        this.timeoutMouseEnter = null;
        this.timeoutMouseLeave = null;
        this.top = 0;
        this.left = 0;
    },

    getCoords(elem){
        const rect = elem.getBoundingClientRect();
        this.top = rect.top + 40;
        this.left = rect.left;
    },

    clearCoords(){
        this.top = 0;
        this.left = 0;
    },

    handleMentionPreview(data, type, event){
        event.preventDefault();
        const { dispatch } = this.props;
        if (!this.timeoutMouseEnter) {
            this.getCoords(event.target);
            this.timeoutMouseEnter = window.setTimeout(() => {
                this.timeoutMouseEnter = null;
                dispatch(loadPreview(data, type));
            }, 1000);
        }
    },

    handleClearMentionPreview(){
        if (this.timeoutMouseEnter) {
            window.clearTimeout(this.timeoutMouseEnter);
            this.timeoutMouseEnter = null;
        } else {
            this.timeoutMouseLeave = window.setTimeout(() => {
                const {
                    dispatch,
                    previewHovered
                } = this.props;
                this.timeoutMouseLeave = null;
                if (!previewHovered){
                    this.clearCoords();
                    dispatch(clearPreview());
                }
            }, 100);
        }
    },

    handlePreviewMouseEnter(){
        const { dispatch } = this.props;
        dispatch(toggleHover());
    },

    handlePreviewMouseLeave(){
        const { dispatch } = this.props;
        this.clearCoords();
        dispatch(toggleHover());
        dispatch(clearPreview());
    },

    render(){
        const {
            className,
            key,
            src,
            data,
            type,
            preview,
            previewType,
            children
        } = this.props;

        const renderPreview = () => {
            switch (previewType) {
                case 'user':
                    if (data.displayName === preview.displayName){
                        return (
                            <UserPreview
                                pos={ { top: this.top, left: this.left } }
                                user={ preview }
                                key={ preview.fullName + preview.followers }
                                onMouseEnter={ () => this.handlePreviewMouseEnter }
                                onMouseLeave={ () => this.handlePreviewMouseLeave } />
                        );
                    }
                    break;
                default:
                    return '';
            }
        };

        return (
            <span>
                <Link
                    ref={ element => this.previewElement = element }
                    key={ key }
                    className={ className }
                    onMouseEnter={ e => this.handleMentionPreview(data, type, e) }
                    onMouseOut={ () => this.handleClearMentionPreview() }
                    onClick={ () => this.handleClearMentionPreview() }
                    to={ src }>
                    { children }
                </Link>
                <ReactCSSTransitionGroup
                    transitionName="climb-in"
                    transitionEnterTimeout={ 200 }
                    transitionLeaveTimeout={ 200 }>
                    { renderPreview() }
                </ReactCSSTransitionGroup>
            </span>
        );
    }
});

export default Redux.connect(state => {
    return {
        preview: state.previewLink.preview,
        previewType: state.previewLink.previewType,
        previewHovered: state.previewLink.previewHovered
    };
})(PreviewLink);
