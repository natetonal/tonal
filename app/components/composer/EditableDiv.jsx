import React from 'react';
import select from 'selection-range';

export const EditableDiv = React.createClass({

    shouldComponentUpdate(nextProps) {
        // We need not rerender if the change of props simply reflects the user's
        // edits. Rerendering in this case would make the cursor/caret jump.
        return (
            // Rerender if there is no element yet... (somehow?)
            !this.htmlEl
            // ...or if html really changed... (programmatically, not by user edit)
            || ( nextProps.html !== this.htmlEl.innerHTML
                && nextProps.html !== this.props.html )
                // ...or if editing is enabled or disabled.
                || this.props.disabled !== nextProps.disabled
        );
    },

    componentDidUpdate() {
        if ( this.htmlEl && this.props.html !== this.htmlEl.innerHTML ) {
            // Perhaps React (whose VDOM gets outdated because we often prevent
            // rerendering) did not update the DOM. So we update it manually now.
            this.htmlEl.innerHTML = this.props.html;
            select(this.htmlEl, { start: this.cursorPos });
            console.log('cursor pos set to: ', this.cursorPos);
        }
    },

    emitChange(evt) {
        if (!this.htmlEl) return;
        var html = this.htmlEl.innerHTML;
        var text = this.htmlEl.textContent;
        this.cursorPos = select(this.htmlEl).end;
        console.log('range: ', select(this.htmlEl));
        if (this.props.onChange && html !== this.lastHtml) {
            evt.target = {
                value: html,
                textContent: text,
                cursorPos: this.cursorPos
            };
            this.props.onChange(evt);
        }


        this.lastHtml = html;
    },

    render(){

        const { html, ...props } = this.props;

        return React.createElement(
            'div', {
                ...props,
                className: this.props.className,
                ref: (e) => this.htmlEl = e,
                onInput: this.emitChange,
                onBlur: this.props.onBlur || this.emitChange,
                contentEditable: true,
                dangerouslySetInnerHTML: { __html: html }
            },
            this.props.children
        );
    }
});

export default EditableDiv;
