import { push } from 'react-router-redux';

export const getPrevRoute = (route = '') => {
    return {
        type: 'RT_PREV_ROUTE',
        route
    };
};

export const pushToRoute = route => {
    return (dispatch, getState) => {
        const loc = getState().router.location.pathname;
        if (route && loc !== route){
            console.log('loc? ', loc);
            console.log('pushing to route: ', route);
            dispatch(push(`/${ route }`));
        }
    };
};
