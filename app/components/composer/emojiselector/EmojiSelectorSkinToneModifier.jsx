import React, { Component } from 'react';
import * as Redux from 'react-redux';
import { modifySkinTone } from 'actions/EmojiSelectorActions';
import {
    getPathFromShortname,
    skinToneArray
} from './emojidata';

class EmojiSelectorSkinToneModifier extends Component {

    handleMouseEnter(title, event){
        event.preventDefault();
        const { onMouseEnter } = this.props;
        onMouseEnter(title);
    }

    handleMouseLeave(event){
        event.preventDefault();
        const { onMouseLeave } = this.props;
        onMouseLeave();
    }

    handleClick(name, event){
        event.preventDefault();
        const { dispatch } = this.props;
        dispatch(modifySkinTone(name));
    }

    render(){

        const { skinToneModifier } = this.props;

        const renderSkinTones = () => {
            return skinToneArray.map(({ name, title, shortname }, index) => {
                return (
                    <div
                        key={ name + index }
                        className={ `emoji-skin-tone-modifier ${ skinToneModifier === name ? 'selected' : '' }` }
                        onMouseEnter={ event => this.props.onMouseEnter(title, event) }
                        onMouseLeave={ () => this.props.onMouseLeave() }
                        onClick={ event => this.handleClick(name, event) }>
                        <img
                            alt={ title }
                            src={ getPathFromShortname(shortname) } />
                    </div>
                );
            });
        };

        return (
            <div className="emoji-skin-tone-modifiers">
                { renderSkinTones() }
            </div>
        );
    }
}

export default Redux.connect(state => {
    return {
        skinToneModifier: state.emojiSelector.skinToneModifier
    };
})(EmojiSelectorSkinToneModifier);
