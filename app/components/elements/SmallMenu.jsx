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
    }
    {
        divider: true
    }
    ...
]


*/

import React, { Component } from 'react';
import {
    TimelineLite,
    Power1,
    Back
} from 'gsap';

class SmallMenu extends Component {

    componentWillMount(){
        console.log('smallMenu mounting.');
        this.setState({
            mouseOverMenu: false
        });
    }

    componentDidMount(){
        const tl = new TimelineLite();
        tl.from(this.smallMenu, 0.25, {
            ease: Back.easeOut.config(1.4),
            transformOrigin: 'right top',
            scale: 0
        });
        tl.play();
    }

    handleCallback(callback, event, params){
        event.preventDefault();
        const tl = new TimelineLite();
        tl.to(this.smallMenu, 0.1, {
            ease: Power1.easeIn,
            opacity: 0
        });
        tl.play();

        if (params){
            tl.eventCallback('onComplete', callback, params);
        } else {
            tl.eventCallback('onComplete', callback);
        }
    }

    render(){

        const {
            onClose,
            width,
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
                const renderIcon = () => {
                    if (icon){
                        if (icon === 'broken-heart'){
                            return (
                                <span className="fa-stack">
                                    <i className={ `fa fa-heart fa-stack-1x ${ iconColor }` } />
                                    <i className="fa fa-bolt fa-stack-1x fa-inverse" />
                                </span>
                            );
                        }

                        return <i className={ `fa fa-${ icon } ${ iconColor }` } aria-hidden="true" />;
                    }

                    return '';
                };

                if (validation){
                    if (validation.value === validation.truth){
                        return (
                            <div
                                key={ `postmenu_item_${ index }` }
                                onClick={ e => this.handleCallback(callback, e, params) }
                                className={ `small-menu-option ${ highlightColor }` }>
                                { icon && (<div className="small-menu-icon">{ renderIcon(icon) }</div>) }
                                <div className="small-menu-text">
                                    { title && <div className="small-menu-title">{ title }</div> }
                                    { description && <div className="small-menu-description">{ description }</div> }
                                </div>
                            </div>
                        );
                    }

                    return '';
                }

                return (
                    <div
                        key={ `postmenu_item_${ index }` }
                        onClick={ e => this.handleCallback(callback, e, params) }
                        className={ `small-menu-option ${ highlightColor }` }>
                        { icon && (<div className="small-menu-icon">{ renderIcon(icon) }</div>) }
                        <div className="small-menu-text">
                            { title && <div className="small-menu-title">{ title }</div> }
                            { description && <div className="small-menu-description">{ description }</div> }
                        </div>
                    </div>
                );
            });
        };

        return (
            <div
                ref={ element => this.smallMenu = element }
                onMouseLeave={ e => this.handleCallback(onClose, e) }
                className={ `small-menu ${ width || '' }` }>
                { renderMenu() }
            </div>
        );
    }
}

export default SmallMenu;
