const initialAuthState = {
    uid: '',
    oobCode: ''
};

export const authReducer = (state = initialAuthState, action) => {
    switch (action.type){
        case 'LOGIN':
            return {
                ...state,
                uid: action.uid
            };
        case 'LOGOUT':
            return {
                ...state,
                uid: ''
            };
        case 'VERIFIED_EMAIL_CODE':
            return {
                ...state,
                oobCode: action.oobCode
            };
        default:
            return state;
    }
};

export const imgUrlReducer = (state = '', action) => {
    switch (action.type){
        case 'GET_IMG_URL':
            return action.imgUrl;
        default:
            return state;
    }
};

const initialUIState = {
    menuIsOpen: false,
    searchIsOpen: false,
    notifsIsOpen: false,
    composeIsOpen: false,
    loginModalIsOpen: false,
    loginModalUI: 'signup'
};

export const uiStateReducer = (state = initialUIState, action) => {
    switch (action.type){
        case 'UI_TOGGLE_MENU':
            return {
                ...state,
                menuIsOpen: !state.menuIsOpen
            };
        case 'UI_TOGGLE_SEARCH':
            return {
                ...state,
                searchIsOpen: !state.searchIsOpen
            };
        case 'UI_TOGGLE_NOTIFS':
            return {
                ...state,
                notifsIsOpen: !state.notifsIsOpen
            };
        case 'UI_TOGGLE_COMPOSE':
            return {
                ...state,
                composeIsOpen: !state.composeIsOpen
            };
        case 'UI_TOGGLE_LOGIN_MODAL':
            return {
                ...state,
                loginModalIsOpen: !state.loginModalIsOpen
            };
        case 'UI_SWITCH_LOGIN_MODAL':
            return {
                ...state,
                loginModalUI: action.loginModalUI
            };
        case 'RESET_UI_STATE':
            return initialUIState;
        default:
            return state;
    }
};

export const errorsReducer = (state = null, action) => {
    switch (action.type){
        case 'ADD_ERROR_MESSAGE':
            return action.error;
        case 'RESET_ERROR_MESSAGE':
            return null;
        default:
            return state;
    }
};

const initialUserState = {
    uid: '',
    fbToken: '',
    email: '',
    firstName: '',
    lastName: '',
    displayName: '',
    timeZone: '',
    avatarPhoto: '',
    updatedAt: '',
    createdAt: ''
};

export const userReducer = (state = initialUserState, action) => {
    switch (action.type){
        case 'ADD_USER_DATA':
            return {
                ...state,
                ...action.data
            };
        case 'RESET_USER_DATA':
            return initialUserState;
        default:
            return state;
    }
};

const initialHeaderComposeState = {
    currentTab: 'post'
};

export const headerComposeReducer = (state = initialHeaderComposeState, action) => {
    switch (action.type){
        case 'HC_CHANGE_TAB':
            return {
                ...state,
                currentTab: action.tab
            };
        case 'HC_CREATE_FAKE_POST':
            return {
                ...state,
                post: action.postData
            };
        default:
            return state;
    }
};

const initialComposerState = {
    currentMenu: '',
    previewImage: '',
    imageFile: '',
    query: ''
};

export const composerReducer = (state = initialComposerState, action) => {
    switch (action.type){
        case 'COM_CHANGE_MENU':
            return {
                ...state,
                currentMenu: action.menu
            };
        case 'COM_PREVIEW_IMAGE':
            return {
                ...state,
                previewImage: action.image
            };
        case 'COM_SET_IMAGE_UPLOAD':
            return {
                ...state,
                imageFile: action.imageFile
            };
        case 'COM_UPDATE_SUGGESTION_QUERY':
            return {
                ...state,
                query: action.query
            };
        default:
            return state;
    }
};

const initialEmojiSelectorState = {
    currentTab: 'people',
    previousTab: 'people',
    currentTabTitle: 'Smileys & People',
    previousTabTitle: 'Smileys & People',
    currentTitleDisplay: 'Smileys & People',
    skinToneModifier: 'default',
    searchText: ''
};

export const emojiSelectorReducer = (state = initialEmojiSelectorState, action) => {
    switch (action.type){
        case 'ES_CHANGE_TAB':
            return {
                ...state,
                previousTab: state.currentTab,
                currentTab: action.tab
            };
        case 'ES_CHANGE_TAB_TITLE':
            return {
                ...state,
                previousTabTitle: state.currentTabTitle,
                currentTabTitle: action.tabTitle
            };
        case 'ES_CHANGE_TITLE_DISPLAY':
            return {
                ...state,
                currentTitleDisplay: action.titleDisplay
            };
        case 'ES_SEARCH_TEXT':
            return {
                ...state,
                searchText: action.searchText
            };
        case 'ES_MODIFY_SKIN_TONE':
            return {
                ...state,
                skinToneModifier: action.skinTone
            };
        default:
            return state;
    }
};

const initialGiphySelectorState = {
    status: 'default',
    currentTab: 'trending',
    images: [],
    imgLimit: 40,
    searchText: '',
    offset: 0
};

export const giphySelectorReducer = (state = initialGiphySelectorState, action) => {
    switch (action.type){
        case 'GIPHY_STATUS_FETCHING':
            return {
                ...state,
                status: 'fetching'
            };
        case 'GIPHY_STATUS_SUCCESS':
            return {
                ...state,
                status: 'success',
                offset: action.offset,
                images: action.images
            };
        case 'GIPHY_STATUS_FAILURE':
            return {
                ...state,
                status: 'failure'
            };
        case 'GIPHY_SEARCH_TEXT':
            return {
                ...state,
                images: [],
                offset: 0,
                searchText: action.searchText
            };
        case 'GIPHY_SWITCH_TABS':
            return {
                ...state,
                images: [],
                offset: 0,
                currentTab: action.tab
            };
        case 'GIPHY_RESET_STATE':
            return {
                ...state,
                status: 'default',
                currentTab: 'trending',
                images: [],
                searchText: '',
                offset: 0
            };
        case 'GIPHY_RESET_IMAGES':
            return {
                ...state,
                images: [],
                offset: 0
            };
        default:
            return state;
    }
};
