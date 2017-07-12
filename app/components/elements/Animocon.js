import mojs from 'mo-js';

const opacityCurve1 = mojs.easing.path('M1,0 C1,0 26,100 51,100 C76,100 101,0 101,0');
const translationCurve1 = mojs.easing.path('M0,100 C0,0 50,0 50,0 L50,100 L50,200 C50,200 50,100 100,100');
const colorCurve1 = mojs.easing.path('M0,100 L50,100 L50,0 L100,0');

const opacityCurve2 = mojs.easing.path('M0,100 L20,100 L20,1 L100,1');
const translationCurve2 = mojs.easing.path('M0,100h20V0c0,0,0.2,101,80,101');

// taken from mo.js demos
const isIOSSafari = () => {
    const userAgent = window.navigator.userAgent;
    return userAgent.match(/iPad/i) || userAgent.match(/iPhone/i);
};

// taken from mo.js demos
const isTouch = () => {
    const isIETouch = navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    return [].indexOf.call(window, 'ontouchstart') >= 0 || isIETouch;
};

// taken from mo.js demos
const isIOS = isIOSSafari();
const clickHandler = isIOS || isTouch() ? 'touchstart' : 'click';

const extend = (a, b) => {
    if (typeof b === 'object'){
        Object.keys(b).forEach(key => {
            if (b[key]){
                a[key] = b[key];
            }
        });
    }

    return a;
    // for (const key in b) {
    //     if (b.hasOwnProperty(key)) {
    //         a[key] = b[key];
    //     }
    // }
    // return a;
};

function Animocon(el, options) {
    console.log('el? ', el);
    this.el = el;
    this.options = extend({}, this.options);
    extend(this.options, options);
    this.timeline = new mojs.Timeline();
    for (let i = 0, len = this.options.tweens.length; i < len; ++i) {
        this.timeline.add(this.options.tweens[i]);
    }
}

Animocon.prototype.options = {
    tweens: [
        new mojs.Burst({})
    ]
};

class Bolt extends mojs.CustomShape {
    getShape() {
        return '<path d="M80.41 28.97C60.94 70.69 50.12 93.86 47.96 98.5C47.18 100 45.69 99.85 45.44 100C45.2 100 44.68 99.89 44.59 99.88C43.57 99.58 43.22 98.85 43.06 98.74C42.72 98.18 42.63 97.58 42.79 96.94L54.63 48.38C39.99 52.02 31.86 54.04 30.23 54.45C29.99 54.51 29.58 54.5 29.51 54.51C28.43 54.51 27.83 53.91 27.65 53.85C26.93 53.25 26.67 52.46 26.87 51.5C34.11 21.75 38.14 5.23 38.95 1.92C39.19 1.08 39.81 0.68 39.91 0.54C40.39 0.18 40.95 0 41.59 0C53.42 0 59.99 0 61.3 0C62.44 0 63.03 0.68 63.22 0.75C64.01 1.5 63.93 2.35 64.01 2.52C64.01 2.84 63.9 3.21 63.7 3.61L53.43 31.43C67.71 27.9 75.64 25.93 77.23 25.54C77.71 25.42 77.88 25.43 77.95 25.42C78.71 25.42 79.39 25.72 79.99 26.32L80.41 28.97Z"></path>';
    }
}

mojs.addShape('bolt', Bolt);

export default (type, el) => {
    if (!el){ return; }

    console.log('el: ', el);
    switch (type){
        case 'takeoff':
            return new Animocon(el, {
                tweens: [
                    new mojs.Burst({
                        parent: el,
                        radius: { 4: 50 },
                        count: 8,
                        degree: 100,
                        angle: 130,
                        children: {
                            shape: 'line',
                            radius: 10,
                            scale: 2,
                            duration: 500,
                            stroke: '#9ef6ec',
                            strokeWidth: 0.1,
                            strokeDasharray: '100%',
                            strokeDashoffset: { '-100%': '100%' },
                            easing: 'circ.out'
                        }
                    }),
                    new mojs.Tween({
                        duration: 400,
                        easing: mojs.easing.ease.out,
                        onUpdate: progress => {
                            const opacityProgress = opacityCurve1(progress);
                            el.style.opacity = opacityProgress;

                            const translationProgress = translationCurve1(progress);
                            el.style.WebkitTransform = el.style.transform = `translate3d(0,${ (-150 * translationProgress) }'%,0)`;

                            const colorProgress = colorCurve1(progress);
                            el.style.color = colorProgress ? '#9ef6ec' : '#c0c1c3';
                        }
                    })
                ]
            });
        case 'pindrop':
            return new Animocon(el, {
                tweens: [
                    // burst animation
                    new mojs.Burst({
                        parent: el,
                        count: 2,
                        radius: { 10: 90 },
                        angle: 92,
                        top: '90%',
                        children: {
                            shape: 'line',
                            fill: '#9ef6ec',
                            scale: 1,
                            radius: { 20: 0 },
                            stroke: '#9ef6ec',
                            strokeWidth: { 4: 1 },
                            strokeLinecap: 'round',
                            opacity: 0.5,
                            duration: 500,
                            delay: 200,
                            easing: mojs.easing.bezier(0.1, 1, 0.3, 1)
                        }
                    }),
                    // burst animation
                    new mojs.Burst({
                        parent: el,
                        count: 3,
                        radius: { 10: 40 },
                        angle: 182,
                        top: '90%',
                        children: {
                            shape: 'line',
                            fill: '#c0c1c3',
                            opacity: 0.5,
                            scale: 1,
                            radius: { 10: 0 },
                            stroke: '#c0c1c3',
                            strokeWidth: { 4: 1 },
                            strokeLinecap: 'round',
                            duration: 600,
                            delay: 200,
                            easing: mojs.easing.bezier(0.1, 1, 0.3, 1)
                        }
                    }),
                    // ring animation
                    new mojs.Shape({
                        parent: el,
                        radius: { 20: 0 },
                        radiusY: { 10: 0 },
                        fill: 'rgba(0,0,0,0.25)',
                        stroke: 'rgba(0,0,0,0.25)',
                        strokeWidth: 1,
                        opacity: 0.3,
                        top: '90%',
                        duration: 400,
                        delay: 100,
                        easing: 'bounce.out'
                    }),
                    // icon scale animation
                    new mojs.Tween({
                        duration: 500,
                        easing: mojs.easing.bounce.out,
                        onUpdate: progress => {
                            const translationProgress = translationCurve2(progress);
                            el.style.WebkitTransform = el.style.transform = `translate3d(0,'${ -450 * translationProgress }'%,0)`;

                            const colorProgress = opacityCurve2(progress);
                            el.style.color = colorProgress ? '#9ef6ec' : '#c0c1c3';
                        }
                    })
                ]
            });
        case 'bolts':
            return new Animocon(el, {
                tweens: [
                    // ring animation
                    new mojs.Shape({
                        parent: el,
                        duration: 750,
                        shape: 'bolt',
                        radius: { 0: 40 },
                        fill: 'transparent',
                        stroke: '#9ef6ec',
                        strokeWidth: { 25: 0 },
                        opacity: 0.5,
                        top: '45%',
                        easing: mojs.easing.bezier(0, 1, 0.5, 1)
                    }),
                    new mojs.Shape({
                        parent: el,
                        duration: 500,
                        delay: 100,
                        shape: 'bolt',
                        radius: { 0: 20 },
                        fill: 'transparent',
                        stroke: '#9ef6ec',
                        strokeWidth: { 5: 0 },
                        opacity: 0.2,
                        x: 40,
                        y: -60,
                        easing: mojs.easing.sin.out
                    }),
                    new mojs.Shape({
                        parent: el,
                        duration: 500,
                        delay: 180,
                        shape: 'bolt',
                        radius: { 0: 10 },
                        fill: 'transparent',
                        stroke: '#9ef6ec',
                        strokeWidth: { 5: 0 },
                        opacity: 0.5,
                        x: -10,
                        y: -80,
                        isRunLess: true,
                        easing: mojs.easing.sin.out
                    }),
                    new mojs.Shape({
                        parent: el,
                        duration: 800,
                        delay: 240,
                        shape: 'bolt',
                        radius: { 0: 20 },
                        fill: 'transparent',
                        stroke: '#9ef6ec',
                        strokeWidth: { 5: 0 },
                        opacity: 0.3,
                        x: -70,
                        y: -10,
                        easing: mojs.easing.sin.out
                    }),
                    new mojs.Shape({
                        parent: el,
                        duration: 800,
                        delay: 240,
                        shape: 'bolt',
                        radius: { 0: 20 },
                        fill: 'transparent',
                        stroke: '#9ef6ec',
                        strokeWidth: { 5: 0 },
                        opacity: 0.4,
                        x: 80,
                        y: -50,
                        easing: mojs.easing.sin.out
                    }),
                    new mojs.Shape({
                        parent: el,
                        duration: 1000,
                        delay: 300,
                        shape: 'bolt',
                        radius: { 0: 15 },
                        fill: 'transparent',
                        stroke: '#9ef6ec',
                        strokeWidth: { 5: 0 },
                        opacity: 0.2,
                        x: 20,
                        y: -100,
                        easing: mojs.easing.sin.out
                    }),
                    new mojs.Shape({
                        parent: el,
                        duration: 600,
                        delay: 330,
                        shape: 'bolt',
                        radius: { 0: 25 },
                        fill: 'transparent',
                        stroke: '#9ef6ec',
                        strokeWidth: { 5: 0 },
                        opacity: 0.4,
                        x: -40,
                        y: -90,
                        easing: mojs.easing.sin.out
                    }),
                    // icon scale animation
                    new mojs.Tween({
                        duration: 1200,
                        easing: mojs.easing.ease.out,
                        onUpdate: progress => {
                            if (progress > 0.3) {
                                const elasticOutProgress = mojs.easing.elastic.out((1.52 * progress) - 0.52);
                                el.style.WebkitTransform = el.style.transform = `scale3d(${ elasticOutProgress },${ elasticOutProgress },1)`;
                            } else {
                                el.style.WebkitTransform = el.style.transform = 'scale3d(0,0,1)';
                            }
                        }
                    })
                ]
            });
        case 'explode':
            return new Animocon(el, {
                tweens: [
                    // burst animation
                    new mojs.Burst({
                        parent: el,
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
                    }),
                    // ring animation
                    new mojs.Shape({
                        parent: el,
                        type: 'circle',
                        radius: { 0: 60 },
                        fill: 'transparent',
                        stroke: '#9ef6ec',
                        strokeWidth: { 10: 0 },
                        opacity: 0.6,
                        duration: 700,
                        easing: mojs.easing.sin.out
                    }),
                    // icon scale animation
                    new mojs.Tween({
                        duration: 1200,
                        onUpdate: progress => {
                            if (progress > 0.3) {
                                const elasticOutProgress = mojs.easing.elastic.out((1.52 * progress) - 0.52);
                                el.style.WebkitTransform = el.style.transform = `scale3d(${ elasticOutProgress },${ elasticOutProgress },1)`;
                            } else {
                                el.style.WebkitTransform = el.style.transform = 'scale3d(0,0,1)';
                            }
                        }
                    })
                ]
            });
        default:
            return false;
    }
};
