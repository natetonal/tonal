import { push } from 'react-router-redux';

export const getPrevRoute = (route = '') => {
    return {
        type: 'RT_PREV_ROUTE',
        route
    };
};

export const pushToRoute = route => {
    return dispatch => {
        if (route){
            console.log('pushing to route: ', route);
            dispatch(push(`/${ route }`));
        }
    };
};
