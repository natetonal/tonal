import React from 'react';

export const Tooltip = React.createClass({

    componentWillMount(){
        let showTip = true;
        if (this.props.delay){ showTip = false; }
        this.setState({ showTip });
    },

    componentWillUpdate(nextProps){
        const { delay } = this.props;

        if (delay){
            if (!this.props.text && nextProps.text){
                this.delayTooltip = window.setTimeout(() => {
                    this.delayTooltip = null;
                    this.setState({ showTip: true });
                }, delay);
            }

            if (this.props.text && !nextProps.text){
                this.setState({ showTip: false });
            }
        }
    },

    componentWillUnmount(){
        window.clearTimeout(this.delayTooltip);
    },

    render(){

        const {
            text,
            direction,
            align,
            children
        } = this.props;

        const { showTip } = this.state;

        if (text && showTip){
            return (
                <div className="tonal-tooltip">
                    { children }
                    <span className={ `tooltiptext tooltip-${ direction || 'left' } text-${ align || 'left' }` }>
                        { text }
                    </span>
                </div>
            );
        }

        return children;
    }

});

export default Tooltip;
