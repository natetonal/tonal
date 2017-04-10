export const getImgUrl = path => {
    return (dispatch, getState => {
        const imgRef = storageRef.child(`assets/${ path }`);
        imgRef.getDownloadURL().then(imgUrl => {
            if (imgUrl){
                dispatch({
                    type: 'GET_IMG_URL',
                    imgUrl
                });
            }
        }).catch(error => {
        });
    });
};
