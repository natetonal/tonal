import React from 'react';
import { Link } from 'react-router';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import Alert from 'elements/Alert';
import PreviewLink from 'links/PreviewLink';

// Note - In execution, make sure to use something more user-specific than their name, such as unique ID.
export const PostParser = React.createClass({

    componentWillMount(){
        this.setState({
            showAlert: false,
            link: '',
            loading: false
        });
    },

    handleRedirect(link){
        this.setState({ loading: true });
        window.location.replace(link);
    },

    handleClose(){
        this.setState({
            showAlert: false,
            link: '',
            loading: false
        });
    },

    replaceHTMLEntities(textBlock){
        const escapeCharsRegex = /&lt;|&gt;|&amp;|&nbsp;/gi;
        const escapeChars = ['&gt;', '&lt;', '&amp;', '&nbsp;'];
        const replaceChars = ['>', '<', '&', ' '];
        if (textBlock.match(escapeCharsRegex)){
            escapeChars.forEach((char, index) => {
                textBlock = textBlock.replace(new RegExp(char, 'g'), replaceChars[index]);
            });
        }

        return textBlock;
    },

    isThisTonal(link){
        let isThisTonal = false;
        const tonalPrefixes = [
            'http://tonal.co',
            'http://www.tonal.co',
            'https://tonal.co',
            'https://www.tonal.co',
            'www.tonal.co',
            'tonal.co'
        ];
        tonalPrefixes.forEach(prefix => {
            if (link.startsWith(prefix)){
                isThisTonal = true;
            }
        });

        return isThisTonal;
    },

    prependProtocol(link){
        let isThereAProtocol = false;
        const allowableProtocols = [
            'http://',
            'https://'
        ];
        allowableProtocols.forEach(protocol => {
            if (link.startsWith(protocol)){
                isThereAProtocol = true;
            }
        });

        if (isThereAProtocol){ return link; }

        return `http://${ link }`;
    },

    handleLinkClick(link, event){
        event.preventDefault();
        if (!this.isThisTonal(link)){
            link = this.prependProtocol(link);
            this.setState({
                showAlert: true,
                link
            });
        }
    },

    render(){
        const {
            post,
            className
        } = this.props;

        const {
            link,
            showAlert,
            loading
        } = this.state;

        const alert = () => {
            if (showAlert){

                const alertBtns = [
                    {
                        text: 'Yes, And Away I Go!',
                        callback: () => this.handleRedirect(link),
                        isLoading: loading
                    },
                    {
                        text: 'No, I Think I\'ll Stay For A Bit.',
                        callback: () => this.handleClose()
                    },
                ];

                return (
                    <Alert
                        type="default"
                        fullscreen
                        title={ 'Whoa there.' }
                        message={ 'You clicked on a link that is outside of Tonal. Did you mean to do that?' }
                        buttons={ alertBtns }
                        onClose={ this.handleClose }
                    />
                );
            }

            return '';
        };

        if (post){
            const processPost = () => {
                if (post){
                    return post.map((chunk, index) => {
                        const key = `postchunk_${ index }`;
                        switch (chunk.type){
                            case 'text':
                                return (
                                    <span key={ key }>
                                        { this.replaceHTMLEntities(chunk.text) }
                                    </span>
                                );
                            case 'emoji':
                                return (
                                    <img
                                        key={ key }
                                        className="post-emoji"
                                        src={ chunk.src }
                                        alt={ chunk.alt } />
                                );
                            case 'mention':
                                return (
                                    <PreviewLink
                                        key={ key }
                                        type="user"
                                        data={ chunk.mention }
                                        className="post-mention"
                                        src={ `users/${ chunk.mention.displayName }` }>
                                        { chunk.value }
                                    </PreviewLink>
                                );
                            case 'hashtag':
                                return (
                                    <Link
                                        key={ key }
                                        className="post-hashtag"
                                        to={ `hashtags/${ chunk.value.substr(1) }` }>
                                        { chunk.value }
                                    </Link>
                                );
                            case 'link':
                                return (
                                    <a
                                        key={ key }
                                        href={ chunk.value }
                                        target="_blank"
                                        onClick={ e => this.handleLinkClick(chunk.value, e) }
                                        rel="noopener noreferrer">
                                        { chunk.value }
                                    </a>
                                );
                            case 'break':
                                return <br key={ key } />;
                            default:
                                return '';
                        }
                    });
                }

                return '';
            };

            return (
                <div className={ className }>
                    { alert() }
                    { processPost() }
                </div>
            );
        }

        return <div />;
    }

});

export default PostParser;
