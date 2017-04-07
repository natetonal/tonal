import axios from 'axios';

// REMEMBER - you're using giphy dev mode. Get API KEY BEFORE DEPLOYMENT!
const giphyURI = {
    default: 'https://api.giphy.com/v1/stickers/trending',
    stickers_trending: 'https://api.giphy.com/v1/stickers/trending',
    stickers_search: 'https://api.giphy.com/v1/stickers/search',
    stickers_random: 'https://api.giphy.com/v1/stickers/random',
    gifs_trending: 'https://api.giphy.com/v1/gifs/trending',
    gifs_search: 'https://api.giphy.com/v1/gifs/search',
    gifs_random: 'https://api.giphy.com/v1/gifs/random',
};

// StickerSelection actions

export const changeSearchText = searchText => {
    return {
        type: 'GIPHY_CHANGE_SEARCH_TEXT',
        searchText
    };
};

export const switchTabs = tab => {
    return {
        type: 'GIPHY_SWITCH_TABS',
        tab
    };
};

export const resetImages = () => {
    return {
        type: 'GIPHY_RESET_IMAGES'
    };
};

export const resetState = () => {
    return {
        type: 'GIPHY_RESET_STATE'
    };
};

export const fetchImages = (mode, searchText) => {

    // Test API for Giphy. Get your own!!
    const api_key = 'dc6zaTOxFJmzC';

    // The type of image to pull
    // API ref: https://github.com/Giphy/GiphyAPI
    const imgType = 'fixed_width';

    // suffix for random requests:
    const imgSuffix = '_downsampled_url';

    // Modes should match the keys in the giphyURI object
    const getURI = giphyURI[mode] || giphyURI.default;

    return ((dispatch, getState) => {

        const limit = getState().giphySelector.imgLimit;
        const offset = getState().giphySelector.offset;
        const images = getState().giphySelector.images;
        const tab = getState().giphySelector.currentTab;
        const q = searchText;

        let params = {
            api_key,
            limit,
            offset
        };

        if (tab === 'search'){
            params = {
                ...params,
                q
            };
        }

        dispatch({ type: 'GIPHY_STATUS_FETCHING' });
        axios.get(getURI, { params })
        .then(response => {

            const { data } = response.data;
            if (Array.isArray(data)){
                data.forEach(item => {
                    images.push(item.images[imgType].url);
                });
            } else {
                images.push(data[`${ imgType }${ imgSuffix }`]);
            }

            dispatch({
                type: 'GIPHY_STATUS_SUCCESS',
                offset: limit + offset,
                images
            });
        })
        .catch(() => {
            dispatch({ type: 'GIPHY_STATUS_FAILURE' });
        });
    });
};
