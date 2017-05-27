// SMALL MENU ELEMENT
/* Small menu should be passed two attributes:

- onClose: a handler for closing the menu
- options: an array of objects containing the menu item data:

[
    {
        icon: //icon,
        iconColor: //icon color
        title: //title,
        highlightColor: //highlight color,
        description: //description,
        callback: // callback,
        validation: {
            value: //var,
            truth: //t/f
        }
    },
    {
        divider: true
    },
    ...
]


*/

import React from 'react';
import {
    TimelineLite,
    Power1,
    Back
} from 'gsap';

export const SmallMenu = React.createClass({

    componentWillMount(){
        this.setState({
            mouseOverMenu: false
        });
    },

    componentDidMount(){
        const tl = new TimelineLite();
        tl.from(this.postmenu, 0.25, {
            ease: Back.easeOut.config(1.4),
            transformOrigin: 'right top',
            scale: 0
        });
        tl.play();
    },

    handleCallback(callback, event, params){
        event.preventDefault();
        const tl = new TimelineLite();
        tl.to(this.postmenu, 0.1, {
            ease: Power1.easeIn,
            opacity: 0
        });
        tl.play();

        if (params){
            tl.eventCallback('onComplete', callback, params);
        }

        tl.eventCallback('onComplete', callback);
    },

    render(){

        const {
            onClose,
            options
        } = this.props;

        const renderMenu = () => {
            return options.map((item, index) => {

                if (item.divider){
                    return (
                        <div
                            key={ `postmenu_item_${ index }` }
                            className="small-menu-divider" />
                    );
                }

                const icon = item.icon || false;
                const iconColor = item.iconColor || '';
                const title = item.title || 'This needs a title!';
                const highlightColor = item.highlightColor || false;
                const description = item.description || false;
                const callback = item.callback || false;
                const params = item.params || false;
                const validation = item.validation || false;
                const ic = icon ? <i className={ `fa fa-${ icon } ${ iconColor }` } aria-hidden="true" /> : '';
                const dsc = description ? <div className="small-menu-description">{ description }</div> : false;

                if (validation){
                    if (validation.value === validation.truth){
                        return (
                            <div
                                key={ `postmenu_item_${ index }` }
                                onClick={ e => this.handleCallback(callback, e, params) }
                                className={ `small-menu-option ${ highlightColor }` }>
                                <div>
                                    { ic }{ ` ${ title }` }
                                </div>
                                { dsc }
                            </div>
                        );
                    }

                    return '';
                }

                return (
                    <div
                        key={ `postmenu_item_${ index }` }
                        onClick={ e => this.handleCallback(callback, e) }
                        className={ `small-menu-option ${ highlightColor }` }>
                        <div>
                            { ic }{ ` ${ title }` }
                        </div>
                        { dsc }
                    </div>
                );
            });
        };

        return (
            <div
                ref={ element => this.postmenu = element }
                onMouseLeave={ e => this.handleCallback(onClose, e) }
                className="small-menu">
                { renderMenu() }
            </div>
        );
    }

});

export default SmallMenu;
