import React from 'react';
import { Link } from 'react-router';
// import extract from 'meta-extractor';

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

    handleLinkClick(link){
        console.log('the link: ', link);
        extract({ uri: link }, (err, res) =>
            console.log('returned from extract: ', err, res)
        );
    },

    render(){
        const { post, className } = this.props;

        console.log('post received from PostParser: ', post);
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
                                    <Link
                                        key={ key }
                                        className="post-mention"
                                        to={ `users/${ chunk.displayName }` }>
                                        { chunk.value }
                                    </Link>
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
                                        onClick={ this.handleLinkClick(chunk.value) }
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
