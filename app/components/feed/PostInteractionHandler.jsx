import React, { Component } from 'react';

import Tooltip from 'elements/Tooltip';
import PreviewLink from 'links/PreviewLink';

class PostInteractionHandler extends Component {

    handleClick = event => {
        if (event){ event.preventDefault(); }

        this.props.clickLike();
    }

    render(){

        const {
            btn,
            uniqueId
        } = this.props;

        if (btn.count < 1){
            return (
                <Tooltip
                    key={ `PostInteractionHandlerTooltip_${ uniqueId }` }
                    direction="top"
                    align="center"
                    className="tonal-post-interaction-click"
                    onClick={ e => this.handleClick(e) }
                    text={ btn.intro || 'filler text' }>
                    <div />
                </Tooltip>
            );
        }

        return (
            <PreviewLink
                key={ `PostInteractionHandlerPreviewLink_${ uniqueId }` }
                onClick={ e => this.handleClick(e) }
                type="user-list"
                title={ btn.title || false }
                previewIds={ btn.data }
                className="tonal-post-interaction-click">
                <div />
            </PreviewLink>
        );
    }
}

export default PostInteractionHandler;
