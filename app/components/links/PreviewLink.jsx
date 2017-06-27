import React from 'react';
import * as Redux from 'react-redux';
import { Link } from 'react-router';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import { fetchPreviewData } from 'actions/LinkActions';

import UserPreview from './UserPreview';
import UserList from './UserList';

export const PreviewLink = React.createClass({

    componentWillMount(){
        this.timeoutMouseEnter = null;
        this.timeoutMouseLeave = null;
        this.top = 0;
        this.left = 0;

        this.key = (length = 10) => {
            let text = '';
            const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            for (let i = 0; i < length; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            return text;
        };

        this.setState({
            key: this.key(),
            previewData: false,
            previewType: false,
            previewReady: false,
            previewHovered: false
        });
    },

    getCoords(elem){
        const rect = elem.getBoundingClientRect();
        this.top = rect.top + 40;
        this.left = rect.left;
    },

    countsArr: ['followers', 'following'],
    singleDataType: ['user'],
    multipleDataType: ['user-list'],

    clearCoords(){
        this.top = 0;
        this.left = 0;
    },

    fetchData(previewId = this.props.previewId){
        if (!previewId){ return false; }

        const { dispatch } = this.props;
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
                window.clearTimeout(this.timeoutMouseEnter);
                this.timeoutMouseEnter = null;
                if (this.multipleDataType.includes(previewType)){
                    const { previewIds } = this.props;
                    Promise.all(Object.keys(previewIds || {}).map(id => this.fetchData(id)))
                    .then(previewData => {
                        if (previewData && this.componentRef){
                            this.setState({
                                previewReady: true,
                                previewData,
                                previewType
                            });
                        }
                    });
                } else if (this.singleDataType.includes(previewType)){
                    this.fetchData()
                    .then(previewData => {
                        if (previewData && this.componentRef){
                            this.setState({
                                previewReady: true,
                                previewData,
                                previewType
                            });
                        }
                    });
                }
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
                window.clearTimeout(this.timeoutMouseLeave);
                this.timeoutMouseLeave = null;
                if (!previewHovered && this.componentRef){
                    this.clearCoords();
                    this.setState({
                        previewReady: false,
                        previewData: false,
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
            previewType: false,
            previewData: false,
            previewReady: false,
            previewHovered: false
        });
    },

    render(){
        const {
            className,
            src,
            type,
            relationship,
            followUser,
            children
        } = this.props;

        const {
            key,
            previewType,
            previewData,
            previewReady
        } = this.state;

        const renderPreview = () => {
            if (previewReady){
                switch (previewType) {
                    case 'user':
                        return (
                            <UserPreview
                                pos={ { top: this.top, left: this.left } }
                                key={ `UserPreview_${ key }` }
                                user={ previewData }
                                relationship={ relationship }
                                followUser={ followUser }
                                countsArr={ this.countsArr }
                                onMouseEnter={ () => this.handlePreviewMouseEnter }
                                onMouseLeave={ () => this.handlePreviewMouseLeave } />
                        );
                    case 'user-list':
                        return (
                            <UserList
                                users={ previewData }
                                key={ `UserListPreview_${ key }` }
                                onMouseEnter={ () => this.handlePreviewMouseEnter }
                                onMouseLeave={ () => this.handlePreviewMouseLeave } />
                        );
                    default:
                        return '';
                }
            }

        };

        return (
            <span ref={ element => this.componentRef = element }>
                <Link
                    ref={ element => this.previewElement = element }
                    key={ `PreviewLinkInnerLink_${ key }` }
                    className={ className }
                    onMouseEnter={ e => this.handleMentionPreview(type, e) }
                    onMouseOut={ () => this.handleClearMentionPreview() }
                    onClick={ () => this.handleClearMentionPreview() }
                    to={ src || null }>
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
