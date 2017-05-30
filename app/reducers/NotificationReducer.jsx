const initialState = {
    status: false,
    newNotifsCount: 0,
    data: false
};

export default (state = initialState, action) => {
    switch (action.type){
        case 'NOTIFS_COUNT_NEW_NOTIFS':
            return {
                ...state,
                newNotifsCount: action.newNotifsCount
            };
        case 'NOTIFS_ADD_NOTIF_TO_LIST':
            return {
                ...state,
                data: {
                    ...state.data,
                    [action.key]: action.post
                }
            };
        case 'NOTIFS_ADD_DATA':
            return {
                ...state,
                data: action.data
            };
        case 'NOTIFS_REMOVE_NOTIF_FROM_LIST':
            return {
                ...state,
                data: Object.keys(state.data)
                    .filter(key => key !== action.key)
                    .reduce((obj, key) => {
                        obj[key] = state.data[key];
                        return obj;
                    }, {})
            };
        case 'NOTIFS_UPDATE_STATUS':
            return {
                ...state,
                status: action.status
            };
        default:
            return state;
    }
};
