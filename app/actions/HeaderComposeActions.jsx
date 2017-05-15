// HeaderCompose actions:

export const changeTab = (tab = '') => {
    return {
        type: 'HC_CHANGE_TAB',
        tab
    };
};
