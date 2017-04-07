// HeaderCompose actions:

export const changeTab = (tab = '') => {
    return {
        type: 'HC_CHANGE_TAB',
        tab
    };
};

export const createFakePost = postData => {
    return {
        type: 'HC_CREATE_FAKE_POST',
        postData
    };
};
