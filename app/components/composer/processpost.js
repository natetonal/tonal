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
        && !postData.file
        && !postData.image){
        error = 'PRO TIP: People usually respond better to posts with content.';
    } else if (!postRaw.match(whitespaceRegex)
        && !postData.file
        && !postData.image){
        error = 'Your use of minimalism is superb, but the people demand something with a bit more substance.';
    } else if (emojiCount && emojiCount.length > maxEmoji){
        error = `Really? Are you being serious here with ${ emojiCount.length } emoji in your post?`;
    }

    return error;
};

// test link:
// http://ianfette.org
const checkIfLinksAreSafe = (links, post) => {
    if (!post) { return false; }

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
        if (Object.keys(response.data).length === 0 &&
            response.data.constructor === Object){
            return post;
        }

        return {
            error: true,
            title: `WARNING: ${ response.data.matches[0].threatType }`,
            message: 'The link you have attempted to post has been flagged for harmful or malicious content. Please refrain from posting links from these sites.'
        };
    })
    .catch(error => {
        return {
            error: true,
            title: 'Well this is embarassing.',
            message: 'There was an error checking the security of your post links. Please try again later.'
        };
    });
};

export const parsePost = (html, data, userData) => {
    let postData = { ...data };
    let assignTextToPreviousTag = false;
    let type;
    const post = [];
    const links = [];
    const hashtags = [];
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
                let updatedPost = post.pop();
                switch (type){
                    case 'link':
                        links.push({ url: text });
                        break;
                    case 'mention':
                        data.mentions.some(mention => {
                            if (mention.fullName === text){
                                updatedPost = {
                                    ...updatedPost,
                                    mention
                                };
                            }
                            return mention.fullName === text;
                        });
                        break;
                    case 'hashtag':
                        hashtags.push(text);
                        break;
                    default:
                        break;
                }
                post.push({
                    ...updatedPost,
                    value: text
                });
                assignTextToPreviousTag = false;
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

    if (links){
        return checkIfLinksAreSafe(links, post)
        .then(safePost => {
            if (!safePost.error){
                postData = {
                    ...postData,
                    hashtags,
                    likes: 0,
                    thread: false,
                    postEdited: false,
                    postEditedAt: false,
                    timeStamp: moment().format('LLLL'),
                    user: userData,
                    post: safePost,
                    raw: html
                };

                return postData;
            }

            return safePost;
        });
    }

    return {
        ...postData,
        hashtags,
        likes: 0,
        thread: false,
        postEdited: false,
        postEditedAt: false,
        timeStamp: moment().format('LLLL'),
        user: userData,
        raw: html,
        post
    };
};
