import React from 'react';
import mojs from 'mo-js';

import {
    TweenLite,
    Power1,
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
            const countChanged = this.props.buttons[i].count !== nextProps.buttons[i].count;
            const btnChanged = this.props.buttons[i].btnState !== nextProps.buttons[i].btnState;
            if (countChanged){ console.log('post interaction bar - count changed.'); }
            if (btnChanged){ console.log('post interaction bar - button state changed.'); }
            return countChanged || btnChanged;
        }) || false;
    },

    componentDidUpdate(prevProps){
        const diff = this.props.buttons.find((e, i) =>
            prevProps.buttons[i].count !== this.props.buttons[i].count);

        if (diff) {
            TweenLite.from(this[`countRef${ diff.text }_${ this.key }`], 0.25, {
                ease: Power1.easeOut,
                opacity: 0
            });
        }

        const liked = this.props.buttons.find((e, i) =>
            !prevProps.buttons[i].btnState &&
            this.props.buttons[i].btnState &&
            this.props.buttons[i].type === 'like');

        if (liked) {
            console.log('liked! time to animate.', this[`iconRef${ liked.text }_${ this.key }`]);
            const parentRef = this[`parentRef${ liked.text }_${ this.key }`];
            const childRef = this[`iconRef${ liked.text }_${ this.key }`];
            this.animateLike(parentRef, childRef);
        }
    },

    animateLike(parentRef, childRef){

        // const opacityCurve = mojs.easing.path('M1,0 C1,0 26,100 51,100 C76,100 101,0 101,0');
        // const translationCurve = mojs.easing.path('M0,100 C0,0 50,0 50,0 L50,100 L50,200 C50,200 50,100 100,100');
        // const colorCurve = mojs.easing.path('M0,100 L50,100 L50,0 L100,0');

        const explode1 = new mojs.Burst({
            parent: childRef,
            radius: { 0: 90 },
            count: 10,
            children: {
                stroke: '#9ef6ec',
                shape: 'line',
                strokeWidth: { 5: 1 },
                opacity: 0.6,
                radius: 10,
                duration: 1700,
                easing: mojs.easing.bezier(0.1, 1, 0.3, 1)
            }
        });
        // ring animation
        const explode2 = new mojs.Shape({
            parent: childRef,
            type: 'circle',
            radius: { 0: 60 },
            fill: 'transparent',
            stroke: '#9ef6ec',
            strokeWidth: { 10: 0 },
            opacity: 0.6,
            duration: 700,
            easing: mojs.easing.sin.out
        });
        // icon scale animation
        const explode3 = new mojs.Tween({
            duration: 1200,
            onUpdate: progress => {
                if (progress > 0.3) {
                    const elasticOutProgress = mojs.easing.elastic.out((1.52 * progress) - 0.52);
                    childRef.style.WebkitTransform = childRef.style.transform = `scale3d(${ elasticOutProgress },${ elasticOutProgress },1)`;
                } else {
                    childRef.style.WebkitTransform = childRef.style.transform = 'scale3d(0,0,1)';
                }
            }
        });

        const explode = new mojs.Timeline();
        explode.add(explode1, explode2, explode3);
        explode.play();
    },

    render(){

        const { buttons } = this.props;

        const renderInteractions = () => {
            return buttons.map(({ text, intro, title, data, icon, handler, btnState, count }) => {

                const content = (
                    <div
                        ref={ element => this[`parentRef${ text }_${ this.key }`] = element }
                        onClick={ handler }
                        className={ `tonal-post-interaction ${ btnState || '' }` }>
                        <i
                            ref={ element => this[`iconRef${ text }_${ this.key }`] = element }
                            className={ `fa fa-${ icon }` }
                            aria-hidden="true" />
                        <span ref={ element => this[`countRef${ text }_${ this.key }`] = element }>
                            { count || 0 }
                        </span>
                    </div>
                );

                const wrappedContent = () => {
                    if (count < 1){
                        return (
                            <Tooltip
                                key={ `PostInteractionTooltip_${ this.key() }` }
                                direction="top"
                                align="center"
                                text={ intro || 'filler text' }>
                                { content }
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
                            { content }
                        </PreviewLink>
                    );
                };

                return wrappedContent();
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
