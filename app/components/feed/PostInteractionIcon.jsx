import React from 'react';
import mojs from 'mo-js';

export const PostInteractionIcon = React.createClass({

    componentDidMount() {

        this.likedColor = '#9ef6ec';
        this.unLikedColor = 'rgba(0, 0, 0, 0.3)';
        this.animStarted = false;
        this.ref.style.color = this.props.isLiked ? this.likedColor : this.unlikedColor;

        const opacityCurve = mojs.easing.path('M1,0 C1,0 26,100 51,100 C76,100 101,0 101,0');
        const translationCurve = mojs.easing.path('M0,100 C0,0 50,0 50,0 L50,100 L50,200 C50,200 50,100 100,100');
        const colorCurve = mojs.easing.path('M0,100 L50,100 L50,0 L100,0');

        const takeoff1 = new mojs.Burst({
            parent: this.parentRef,
            radius: { 40: 100 },
            count: 8,
            degree: 100,
            angle: 130,
            children: {
                shape: 'line',
                radius: { 30: 0 },
                scale: 1,
                duration: 1200,
                stroke: this.likedColor,
                strokeWidth: { 1: 2 },
                strokeDasharray: '100%',
                strokeDashoffset: { '-100%': '100%' },
                easing: mojs.easing.bezier(0.1, 1, 0.3, 1)
            }
        });

        const takeoff2 = new mojs.Tween({
            duration: 600,
            easing: mojs.easing.ease.out,
            onUpdate: progress => {
                const opacityProgress = opacityCurve(progress);
                this.ref.style.opacity = opacityProgress;

                const translationProgress = translationCurve(progress);
                const translation = -120 * translationProgress;
                this.ref.style.WebkitTransform = `translate3d(0,${ translation }%,0)`;
                this.ref.style.transform = `translate3d(0,${ translation }%,0)`;

                const colorProgress = colorCurve(progress);
                this.ref.style.color = colorProgress ? this.likedColor : this.unLikedColor;
            }
        });

        this.anim = new mojs.Timeline({
            onComplete: () => {
                if (this.props.onComplete){
                    this.animStarted = false;
                    this.props.onComplete();
                }
            }
        });

        this.anim.add(takeoff1, takeoff2);

    },

    shouldComponentUpdate(nextProps) {
        if (nextProps.isPlay &&
            nextProps.isLikeButton &&
            !this.animStarted){
            if (nextProps.isLiked){
                this.animStarted = true;
                this.anim.replay();
            } else {
                this.ref.style.color = this.unLikedColor;
            }
        }

        return false;
    },

    render(){

        const { icon } = this.props;

        return (
            <div
                className={ 'tonal-post-interaction-icon-container' }
                ref={ element => this.parentRef = element }>
                <span
                    ref={ element => this.ref = element }
                    className={ icon }
                    aria-hidden="true" />
            </div>
        );
    }

});

export default PostInteractionIcon;

// Takeoff:
// const opacityCurve = mojs.easing.path('M1,0 C1,0 26,100 51,100 C76,100 101,0 101,0');
// const translationCurve = mojs.easing.path('M0,100 C0,0 50,0 50,0 L50,100 L50,200 C50,200 50,100 100,100');
// const colorCurve = mojs.easing.path('M0,100 L50,100 L50,0 L100,0');
//
// const takeoff1 = new mojs.Burst({
//     parent: this.parentRef,
//     radius: { 80: 130 },
//     count: 8,
//     degree: 100,
//     angle: 130,
//     children: {
//         shape: 'line',
//         radius: { 30: 0 },
//         scale: 1,
//         duration: 600,
//         stroke: this.likedColor,
//         strokeWidth: { 1: 2 },
//         strokeDasharray: '100%',
//         strokeDashoffset: { '-100%': '100%' },
//         easing: mojs.easing.bezier(0.1, 1, 0.3, 1)
//     }
// });
//
// const takeoff2 = new mojs.Tween({
//     duration: 400,
//     easing: mojs.easing.ease.out,
//     onUpdate: progress => {
//         const opacityProgress = opacityCurve(progress);
//         this.ref.style.opacity = opacityProgress;
//
//         const translationProgress = translationCurve(progress);
//         const translation = -150 * translationProgress;
//         this.ref.style.WebkitTransform = `translate3d(0,${ translation }%,0)`;
//         this.ref.style.transform = `translate3d(0,${ translation }%,0)`;
//
//         const colorProgress = colorCurve(progress);
//         this.ref.style.color = colorProgress ? this.likedColor : this.unLikedColor;
//     }
// });
//
// this.anim = new mojs.Timeline({
//     onComplete: () => {
//         if (this.props.onComplete){
//             this.animStarted = false;
//             this.props.onComplete();
//         }
//     }
// });
//
// this.anim.add(takeoff1, takeoff2);

// Explode:
// const explode1 = new mojs.Burst({
//     parent: this.parentRef,
//     radius: { 0: 90 },
//     count: 10,
//     children: {
//         stroke: this.likedColor,
//         shape: 'line',
//         strokeWidth: { 5: 1 },
//         opacity: 0.6,
//         radius: 10,
//         duration: 1700,
//         easing: mojs.easing.bezier(0.1, 1, 0.3, 1)
//     }
// });
// // ring animation
// const explode2 = new mojs.Shape({
//     parent: this.parentRef,
//     type: 'circle',
//     radius: { 0: 60 },
//     fill: 'transparent',
//     stroke: this.likedColor,
//     strokeWidth: { 10: 0 },
//     opacity: 0.6,
//     duration: 700,
//     easing: mojs.easing.sin.out
// });
//
// // icon scale animation
// const explode3 = new mojs.Tween({
//     duration: 1200,
//     onUpdate: progress => {
//         if (progress > 0.3) {
//             const elasticOutProgress = mojs.easing.elastic.out((1.52 * progress) - 0.52);
//             this.ref.style.WebkitTransform = this.ref.style.transform = `scale3d(${ elasticOutProgress },${ elasticOutProgress },1)`;
//         } else {
//             this.ref.style.color = this.likedColor;
//             this.ref.style.WebkitTransform = this.ref.style.transform = 'scale3d(0,0,1)';
//         }
//     }
// });
//
// this.anim = new mojs.Timeline({
//     onComplete: () => {
//         if (this.props.onComplete){
//             this.animStarted = false;
//             this.props.onComplete();
//         }
//     }
// });
//
// this.anim.add(explode1, explode2, explode3);
