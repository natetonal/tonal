import React, { Component } from 'react';

class Tooltip extends Component {

    componentWillMount(){
        let showTip = true;
        if (this.props.delay){ showTip = false; }
        this.setState({ showTip });
    }

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
    }

    componentWillUnmount(){
        window.clearTimeout(this.delayTooltip);
    }

    handleClick(event){
        if (event){ event.preventDefault(); }

        const { onClick } = this.props;
        if (onClick){
            onClick();
        }
    }

    render(){

        const {
            text,
            direction,
            align,
            className,
            children
        } = this.props;

        const { showTip } = this.state;

        if (text && showTip){
            return (
                <div
                    onClick={ e => this.handleClick(e) }
                    className={ `${ className } tonal-tooltip` }>
                    { children }
                    <span className={ `tooltiptext tooltip-${ direction || 'left' } text-${ align || 'left' }` }>
                        { text }
                    </span>
                </div>
            );
        }

        return (
            <div
                onClick={ e => this.handleClick(e) }
                className={ `${ className } tonal-tooltip` }>
                { children }
            </div>
        );
    }
}

export default Tooltip;
