import React from 'react';
import { Link } from 'react-router';

import PreviewLink from 'links/PreviewLink';

// Note - In execution, make sure to use something more user-specific than their name, such as unique ID.
export const PostParser = React.createClass({

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

    formatLink(link){
        if (!this.isThisTonal(link)){
            link = this.prependProtocol(link);
            console.log('link: ', link);
            return link;
        }

        return link;
    },

    render(){
        const {
            post,
            className
        } = this.props;

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
                                        type="mention"
                                        previewId={ chunk.mention.uid }
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
                                const src = this.formatLink(chunk.value);
                                return (
                                    <a
                                        key={ key }
                                        href={ src }
                                        target="_blank"
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
                    { processPost() }
                </div>
            );
        }

        return <div />;
    }

});

export default PostParser;
