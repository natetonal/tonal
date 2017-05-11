import React from 'react';
import { Link } from 'react-router';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

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

    handleMentionPreview(data, type, event){
        event.preventDefault();
        if (!this.timeoutMouseEnter) {
            this.getCoords(event.target);
            this.timeoutMouseEnter = window.setTimeout(() => {
                this.timeoutMouseEnter = null;
                this.setState({
                    preview: data,
                    previewType: type
                });
            }, 1000);
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
            data,
            type,
            postId,
            children
        } = this.props;

        const {
            preview,
            previewType
        } = this.state;

        const renderPreview = () => {
            switch (previewType) {
                case 'user':
                    if (data.displayName === preview.displayName){
                        return (
                            <UserPreview
                                pos={ { top: this.top, left: this.left } }
                                user={ preview }
                                key={ `UserPreview_${ postId }` }
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
                    key={ `PreviewLinkInnerLink_${ postId }` }
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

export default PreviewLink;
