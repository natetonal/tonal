import React from 'react';
import * as Redux from 'react-redux';
import { toggleSearch } from 'actions/UIStateActions';

export const Search = React.createClass({

    toggleSearch(){
        const { dispatch, isOpen } = this.props;
        dispatch(toggleSearch());
        if (isOpen){
            this.searchBox.value = '';
        }
    },

    render(){

        const { isOpen } = this.props;

        const columnClass = () => {
            if (isOpen){
                return 'animated fadeInUp 1sec dummy-column';
            }

            return 'dummy-column';
        };

        return (
            <div className={ `morphsearch${ isOpen ? ' open' : '' }` }>
                <form className="morphsearch-form">
                    <input
                        className="morphsearch-input"
                        label="Search Box"
                        ref={ element => this.searchBox = element }
                        onFocus={ !isOpen ? this.toggleSearch : '' }
                        type="search"
                        placeholder={ !isOpen ? String.fromCharCode('0xf002') : '' } />
                    <button
                        className="morphsearch-submit"
                        type="submit">
                        <i className="material-icons">
                            search
                        </i>
                    </button>
                </form>
                <div className="morphsearch-content clearfix">
                    <div className={ columnClass() }>
                        <h2>People</h2>
                        <a
                            className="dummy-media-object"
                            href="http://twitter.com/SaraSoueidan">
                            <img
                                className="round"
                                src="https://dummyimage.com/100x100/000/fff.jpg"
                                alt="A Person" />
                            <h3>A Person</h3>
                        </a>
                        <a
                            className="dummy-media-object"
                            href="http://twitter.com/SaraSoueidan">
                            <img
                                className="round"
                                src="https://dummyimage.com/100x100/000/fff.jpg"
                                alt="A Person" />
                            <h3>A Person</h3>
                        </a>
                        <a
                            className="dummy-media-object"
                            href="http://twitter.com/SaraSoueidan">
                            <img
                                className="round"
                                src="https://dummyimage.com/100x100/000/fff.jpg"
                                alt="A Person" />
                            <h3>A Person</h3>
                        </a>
                        <a
                            className="dummy-media-object"
                            href="http://twitter.com/SaraSoueidan">
                            <img
                                className="round"
                                src="https://dummyimage.com/100x100/000/fff.jpg"
                                alt="A Person" />
                            <h3>A Person</h3>
                        </a>
                        <a
                            className="dummy-media-object"
                            href="http://twitter.com/SaraSoueidan">
                            <img
                                className="round"
                                src="https://dummyimage.com/100x100/000/fff.jpg"
                                alt="A Person" />
                            <h3>A Person</h3>
                        </a>
                        <a
                            className="dummy-media-object"
                            href="http://twitter.com/SaraSoueidan">
                            <img
                                className="round"
                                src="https://dummyimage.com/100x100/000/fff.jpg"
                                alt="A Person" />
                            <h3>A Person</h3>
                        </a>
                        <a
                            className="dummy-media-object"
                            href="http://twitter.com/SaraSoueidan">
                            <img
                                className="round"
                                src="https://dummyimage.com/100x100/000/fff.jpg"
                                alt="A Person" />
                            <h3>A Person</h3>
                        </a>
                        <a
                            className="dummy-media-object"
                            href="http://twitter.com/SaraSoueidan">
                            <img
                                className="round"
                                src="https://dummyimage.com/100x100/000/fff.jpg"
                                alt="A Person" />
                            <h3>A Person</h3>
                        </a>
                        <a
                            className="dummy-media-object"
                            href="http://twitter.com/SaraSoueidan">
                            <img
                                className="round"
                                src="https://dummyimage.com/100x100/000/fff.jpg"
                                alt="A Person" />
                            <h3>A Person</h3>
                        </a>
                        <a
                            className="dummy-media-object"
                            href="http://twitter.com/SaraSoueidan">
                            <img
                                className="round"
                                src="https://dummyimage.com/100x100/000/fff.jpg"
                                alt="A Person" />
                            <h3>A Person</h3>
                        </a>
                        <a
                            className="dummy-media-object"
                            href="http://twitter.com/SaraSoueidan">
                            <img
                                className="round"
                                src="https://dummyimage.com/100x100/000/fff.jpg"
                                alt="A Person" />
                            <h3>A Person</h3>
                        </a>
                        <a
                            className="dummy-media-object"
                            href="http://twitter.com/SaraSoueidan">
                            <img
                                className="round"
                                src="https://dummyimage.com/100x100/000/fff.jpg"
                                alt="A Person" />
                            <h3>A Person</h3>
                        </a>
                    </div>
                    <div className={ columnClass() }>
                        <h2>People</h2>
                        <a
                            className="dummy-media-object"
                            href="http://twitter.com/SaraSoueidan">
                            <img
                                className="round"
                                src="https://dummyimage.com/100x100/000/fff.jpg"
                                alt="A Person" />
                            <h3>A Person</h3>
                        </a>
                        <a
                            className="dummy-media-object"
                            href="http://twitter.com/SaraSoueidan">
                            <img
                                className="round"
                                src="https://dummyimage.com/100x100/000/fff.jpg"
                                alt="A Person" />
                            <h3>A Person</h3>
                        </a>
                        <a
                            className="dummy-media-object"
                            href="http://twitter.com/SaraSoueidan">
                            <img
                                className="round"
                                src="https://dummyimage.com/100x100/000/fff.jpg"
                                alt="A Person" />
                            <h3>A Person</h3>
                        </a>
                        <a
                            className="dummy-media-object"
                            href="http://twitter.com/SaraSoueidan">
                            <img
                                className="round"
                                src="https://dummyimage.com/100x100/000/fff.jpg"
                                alt="A Person" />
                            <h3>A Person</h3>
                        </a>
                        <a
                            className="dummy-media-object"
                            href="http://twitter.com/SaraSoueidan">
                            <img
                                className="round"
                                src="https://dummyimage.com/100x100/000/fff.jpg"
                                alt="A Person" />
                            <h3>A Person</h3>
                        </a>
                        <a
                            className="dummy-media-object"
                            href="http://twitter.com/SaraSoueidan">
                            <img
                                className="round"
                                src="https://dummyimage.com/100x100/000/fff.jpg"
                                alt="A Person" />
                            <h3>A Person</h3>
                        </a>
                        <a
                            className="dummy-media-object"
                            href="http://twitter.com/SaraSoueidan">
                            <img
                                className="round"
                                src="https://dummyimage.com/100x100/000/fff.jpg"
                                alt="A Person" />
                            <h3>A Person</h3>
                        </a>
                        <a
                            className="dummy-media-object"
                            href="http://twitter.com/SaraSoueidan">
                            <img
                                className="round"
                                src="https://dummyimage.com/100x100/000/fff.jpg"
                                alt="A Person" />
                            <h3>A Person</h3>
                        </a>
                        <a
                            className="dummy-media-object"
                            href="http://twitter.com/SaraSoueidan">
                            <img
                                className="round"
                                src="https://dummyimage.com/100x100/000/fff.jpg"
                                alt="A Person" />
                            <h3>A Person</h3>
                        </a>
                        <a
                            className="dummy-media-object"
                            href="http://twitter.com/SaraSoueidan">
                            <img
                                className="round"
                                src="https://dummyimage.com/100x100/000/fff.jpg"
                                alt="A Person" />
                            <h3>A Person</h3>
                        </a>
                        <a
                            className="dummy-media-object"
                            href="http://twitter.com/SaraSoueidan">
                            <img
                                className="round"
                                src="https://dummyimage.com/100x100/000/fff.jpg"
                                alt="A Person" />
                            <h3>A Person</h3>
                        </a>
                        <a
                            className="dummy-media-object"
                            href="http://twitter.com/SaraSoueidan">
                            <img
                                className="round"
                                src="https://dummyimage.com/100x100/000/fff.jpg"
                                alt="A Person" />
                            <h3>A Person</h3>
                        </a>
                    </div>
                </div>
                <span
                    className="morphsearch-close"
                    onClick={ this.toggleSearch } />
            </div>
        );
    }
});

export default Redux.connect(state => {
    return { isOpen: state.uiState.searchIsOpen };
})(Search);
