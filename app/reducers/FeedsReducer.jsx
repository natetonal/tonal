// Feed example:
//
// editing: (postId),
// feeds: {
//     feedId1: {
//         type: "post",
//         status: "fetching",
//         data: false
//     },
//     feedId2: {
//         type: "main",
//         status: "success",
//         data: { ...data }
//     }
// }

const initialState = {
    editing: false,
    feeds: false
};

export default (state = initialState, action) => {
    switch (action.type){
        case 'FEED_ADD_POST':
            return {
                ...state,
                feeds: {
                    ...state.feeds,
                    [action.feedId]: {
                        ...state.feeds[action.feedId],
                        data: {
                            ...state.feeds[action.feedId].data,
                            [action.postId]: action.data
                        }
                    }
                }
            };
        case 'FEED_UPDATE_POST':
            return {
                ...state,
                feeds: {
                    ...state.feeds,
                    [action.feedId]: {
                        ...state.feeds[action.feedId],
                        data: {
                            ...state.feeds[action.feedId].data,
                            [action.postId]: {
                                ...state.feeds[action.feedId].data[action.postId],
                                ...action.data
                            }
                        }
                    }
                }
            };
        case 'FEED_ADD_DATA':
            return {
                ...state,
                feeds: {
                    ...state.feeds,
                    [action.feedId]: {
                        ...state.feeds[action.feedId],
                        type: action.feedType,
                        data: action.data
                    }
                }
            };
        case 'FEED_UPDATE_STATUS':
            return {
                ...state,
                feeds: {
                    ...state.feeds,
                    [action.feedId]: {
                        ...state.feeds[action.feedId],
                        status: action.status
                    }
                }
            };
        case 'FEED_REMOVE_POST':
            return {
                ...state,
                feeds: {
                    ...state.feeds,
                    [action.feedId]: {
                        ...state.feeds[action.feedId],
                        data: Object.keys(state.feeds[action.feedId].data)
                            .filter(postId => postId !== action.postId)
                            .reduce((obj, postId) => {
                                obj[postId] = state.feeds[action.feedId].data[postId];
                                return obj;
                            }, {})
                    }
                }
            };
        case 'FEED_EDIT_POST':
            return {
                ...state,
                editing: action.postId
            };
        default:
            return state;
    }
};

// const initialState = {
//     status: false,
//     data: false,
//     editing: false
// };
//
// export default (state = initialState, action) => {
//     switch (action.type){
//         case 'FEED_ADD_POST':
//         case 'FEED_UPDATE_POST':
//             return {
//                 ...state,
//                 data: {
//                     ...state.data,
//                     [action.key]: action.post
//                 }
//             };
//         case 'FEED_ADD_DATA':
//             return {
//                 ...state,
//                 data: action.data
//             };
//         case 'FEED_REMOVE_POST':
//             return {
//                 ...state,
//                 data: Object.keys(state.data)
//                     .filter(key => key !== action.key)
//                     .reduce((obj, key) => {
//                         obj[key] = state.data[key];
//                         return obj;
//                     }, {})
//             };
//         case 'FEED_EDIT_POST':
//             return {
//                 ...state,
//                 editing: action.postId
//             };
//         case 'FEED_UPDATE_STATUS':
//             return {
//                 ...state,
//                 status: action.status
//             };
//         default:
//             return state;
//     }
// };
