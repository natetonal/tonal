import htmlparser from 'htmlparser2';
import moment from 'moment';
import axios from 'axios';

const entityTypes = /hashtag|link|mention/g;
const whitespaceRegex = /[^\s|&nbsp;|<\/?div>|<br>|\b|\B]/g;
const maxEmoji = 100;

export const validatePost = (postRaw, postData) => {
    let error = false;
    const emojiCount = postRaw.match(new RegExp('<img', 'g'));
    if (!postRaw
        && !postData.imageFile
        && !postData.previewImage){
        error = 'PRO TIP: People usually respond better to posts with content.';
    } else if (!postRaw.match(whitespaceRegex)){
        error = 'Your use of minimalism is superb, but the people demand something with a bit more substance.';
    } else if (emojiCount && emojiCount.length > maxEmoji){
        error = `Really? Are you being serious here with ${ emojiCount.length } emoji in your post?`;
    }

    return error;
};

const checkIfLinksAreSafe = (links, post) => {
    if (!post) { return false; }

    console.log('links sent to checkIfLinksAreSafe: ', links);
    const apiURL = 'https://safebrowsing.googleapis.com/v4/threatMatches:find';
    const key = process.env.API_KEY;
    const request = {
        client: {
            clientId: 'Tonal',
            clientVersion: '1.0.0'
        },
        threatInfo: {
            threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING'],
            platformTypes: ['ANY_PLATFORM'],
            threatEntryTypes: ['URL'],
            threatEntries: [links]
        }
    };

    return axios({
        method: 'post',
        url: apiURL,
        data: request,
        responseType: 'json',
        params: { key }
    })
    .then(response => {
        console.log('RESPONSE: ', response);
        if (Object.keys(response.data).length === 0 &&
            response.data.constructor === Object){
            console.log('these URLs are safe! returning post.');
            return post;
        }
    })
    .catch(error => {
        console.log('ERROR: ', error);
        return post;
    });
};

export const parsePost = (html, data, userData) => {
    let postData = { ...data };
    let assignTextToPreviousTag = false;
    let type;
    const post = [];
    const links = [];
    const parsedPost = new htmlparser.Parser({
        onopentag: (name, attribs) => {
            switch (name){
                case 'span':
                    if (attribs.class){
                        type = attribs.class.match(entityTypes)[0];
                        assignTextToPreviousTag = true;
                    }
                    post.push({
                        type,
                        ...attribs
                    });
                    break;
                case 'img':
                    post.push({
                        type: 'emoji',
                        ...attribs
                    });
                    break;
                case 'div':
                    post.push({
                        type: 'break'
                    });
                    break;
                default:
                    break;
            }
        },
        ontext: text => {
            if (assignTextToPreviousTag){
                const updatedPost = post.pop();
                post.push({
                    ...updatedPost,
                    value: text
                });
                assignTextToPreviousTag = false;
                if (type === 'link'){
                    console.log(`type is ${ type }, pushing ${ text }.`);
                    links.push({ url: text });
                }
            } else {
                post.push({
                    type: 'text',
                    text
                });
            }
        }
    }, { decodeEntities: false });
    parsedPost.write(html);
    parsedPost.end();

    console.log('links val: ', links);
    if (links){
        return checkIfLinksAreSafe(links, post)
        .then(safePost => {
            console.log('safePost: ', safePost);
            postData = {
                ...postData,
                likes: 0,
                thread: false,
                timeStamp: moment().calendar(),
                user: userData,
                post: safePost
            };

            return postData;
        });
    }

    return {
        ...postData,
        likes: 0,
        thread: false,
        timeStamp: moment().calendar(),
        user: userData,
        post
    };
};
