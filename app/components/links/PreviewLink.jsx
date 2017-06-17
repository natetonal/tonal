import React from 'react';
import * as Redux from 'react-redux';
import { Link } from 'react-router';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import fetchPreviewData from 'actions/LinkActions';

import UserPreview from './UserPreview';

export const PreviewLink = React.createClass({

    componentWillMount(){
        this.timeoutMouseEnter = null;
        this.timeoutMouseLeave = null;
        this.top = 0;
        this.left = 0;

        this.setState({
            preview: false,
            previewType: false,
            previewHovered: false
        });
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

    fetchData(){
        const {
            dispatch,
            previewId
        } = this.props;

        return dispatch(fetchPreviewData(previewId))
        .then(response => {
            if (response){
                return response;
            }

            return false;
        });
    },

    handleMentionPreview(previewType, event){
        event.preventDefault();
        event.persist();
        if (!this.timeoutMouseEnter) {
            this.getCoords(event.target);
            this.timeoutMouseEnter = window.setTimeout(() => {
                this.fetchData().then(preview => {
                    this.timeoutMouseEnter = null;
                    this.setState({
                        preview,
                        previewType
                    });
                });
            }, 500);

        }
    },

    handleClearMentionPreview(){
        if (this.timeoutMouseEnter) {
            window.clearTimeout(this.timeoutMouseEnter);
            this.timeoutMouseEnter = null;
        } else {
            this.timeoutMouseLeave = window.setTimeout(() => {
                const { previewHovered } = this.state;
                this.timeoutMouseLeave = null;
                if (!previewHovered){
                    this.clearCoords();
                    this.setState({
                        preview: false,
                        previewType: false
                    });
                }
            }, 100);
        }
    },

    handlePreviewMouseEnter(){
        this.setState({ previewHovered: true });
    },

    handlePreviewMouseLeave(){
        this.clearCoords();
        this.setState({
            preview: false,
            previewType: false,
            previewHovered: false
        });
    },

    render(){
        const {
            className,
            src,
            type,
            postId,
            previewId,
            relationship,
            followUser,
            children
        } = this.props;

        const {
            preview,
            previewType
        } = this.state;

        const renderPreview = () => {
            switch (previewType) {
                case 'user':
                    return (
                        <UserPreview
                            pos={ { top: this.top, left: this.left } }
                            user={ preview }
                            relationship={ relationship }
                            followUser={ followUser }
                            key={ `UserPreview_${ previewId }` }
                            onMouseEnter={ () => this.handlePreviewMouseEnter }
                            onMouseLeave={ () => this.handlePreviewMouseLeave } />
                    );
                default:
                    return '';
            }
        };

        return (
            <span>
                <Link
                    ref={ element => this.previewElement = element }
                    key={ `PreviewLinkInnerLink_${ postId }` }
                    className={ className }
                    onMouseEnter={ e => this.handleMentionPreview(type, e) }
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

export default Redux.connect()(PreviewLink);
