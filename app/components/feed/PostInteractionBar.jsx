import React from 'react';
import {
    TweenLite,
    Power1
} from 'gsap';

import PreviewLink from 'links/PreviewLink';
import Tooltip from 'elements/Tooltip';

export const PostInteractionBar = React.createClass({

    componentWillMount(){
        this.key = (length = 10) => {
            let text = '';
            const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            for (let i = 0; i < length; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            return text;
        };
    },

    shouldComponentUpdate(nextProps){
        return this.props.buttons.find((e, i) => {
            return (
                (this.props.buttons[i].count !== nextProps.buttons[i].count) ||
                (this.props.buttons[i].btnState !== nextProps.buttons[i].btnState)
            );
        }) || false;
    },

    componentDidUpdate(prevProps){
        const diff = this.props.buttons.find((e, i) => prevProps.buttons[i].count !== this.props.buttons[i].count);
        if (diff) {
            TweenLite.from(this[`countRef${ diff.text }_${ this.key }`], 0.25, {
                ease: Power1.easeOut,
                opacity: 0
            });
        }
    },

    render(){

        const { buttons } = this.props;

        const renderInteractions = () => {
            return buttons.map(({ text, intro, title, data, icon, handler, btnState, count }) => {
                if (count < 1){
                    return (
                        <Tooltip
                            key={ `PostInteractionTooltip_${ this.key() }` }
                            direction="top"
                            text={ intro || 'filler text' }>
                            <div
                                onClick={ handler }
                                className={ `tonal-post-interaction ${ btnState || '' }` }>
                                <i
                                    className={ `fa fa-${ icon }` }
                                    aria-hidden="true" />
                                <span ref={ element => this[`countRef${ text }_${ this.key }`] = element }>
                                    { count || 0 }
                                </span>
                            </div>
                        </Tooltip>
                    );
                }

                return (
                    <PreviewLink
                        key={ `PostInteraction_${ this.key() }` }
                        type="user-list"
                        title={ title || false }
                        previewIds={ data }
                        className="likes-link">
                        <div
                            onClick={ handler }
                            className={ `tonal-post-interaction ${ btnState || '' }` }>
                            <i
                                className={ `fa fa-${ icon }` }
                                aria-hidden="true" />
                            <span ref={ element => this[`countRef${ text }_${ this.key }`] = element }>
                                { count || 0 }
                            </span>
                        </div>
                    </PreviewLink>
                );
            });
        };

        return (
            <div className="tonal-post-interactions">
                { renderInteractions() }
            </div>
        );
    }

});

export default PostInteractionBar;
