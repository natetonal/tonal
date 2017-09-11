// Feed example:
//
// {
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

const initialState = {};

export default (state = initialState, action) => {
    switch (action.type){
        case 'FEED_ADD_POST':
            return {
                ...state,
                [action.feedId]: {
                    ...state[action.feedId],
                    data: {
                        ...state[action.feedId].data,
                        [action.postId]: action.data
                    }
                }
            };
        case 'FEED_UPDATE_POST':
            return {
                ...state,
                [action.feedId]: {
                    ...state[action.feedId],
                    data: {
                        ...state[action.feedId].data,
                        [action.postId]: {
                            ...state[action.feedId].data[action.postId],
                            ...action.data
                        }
                    }
                }
            };
        case 'FEED_ADD_DATA':
            return {
                ...state,
                [action.feedId]: {
                    ...state[action.feedId],
                    type: action.feedType,
                    data: action.data
                }
            };
        case 'FEED_UPDATE_STATUS':
            return {
                ...state,
                [action.feedId]: {
                    ...state[action.feedId],
                    status: action.status
                }
            };
        case 'FEED_REMOVE_POST':
            return {
                ...state,
                [action.feedId]: {
                    ...state[action.feedId],
                    data: Object.keys(state[action.feedId].data)
                        .filter(postId => postId !== action.postId)
                        .reduce((obj, postId) => {
                            obj[postId] = state[action.feedId].data[postId];
                            return obj;
                        }, {})
                }
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
