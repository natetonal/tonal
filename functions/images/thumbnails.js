const mkdirp = require('mkdirp-promise');
// Include a Service Account Key to use a Signed URL
const gcs = require('@google-cloud/storage')({ keyFilename: 'service-account-credentials.json' });
const spawn = require('child-process-promise').spawn;
const path = require('path');
const os = require('os');
const fs = require('fs');

const THUMB_TYPES = {
    thumb: {
        maxHeight: 160,
        maxWidth: 160,
        suffix: '_t'
    },
    small: {
        maxHeight: 480,
        maxWidth: 480,
        suffix: '_s',
    },
    medium: {
        maxHeight: 760,
        maxWidth: 760,
        suffix: '_m',
    },
    large: {
        maxHeight: 1024,
        maxWidth: 1024,
        suffix: '_l',
    },
    xlarge: {
        maxHeight: 2048,
        maxWidth: 2048,
        suffix: '_x',
    },
};

/**
* When an image is uploaded in the Storage bucket We generate a thumbnail automatically using
* ImageMagick.
* After the thumbnail has been generated and uploaded to Cloud Storage,
* we write the public URL to the Firebase Realtime Database.
*/

// For now, this will only generate thumbnails for post images & images with three items in the split array.
// Format: image-directory/uid/basename
exports.generateThumbnails = (functions, admin) => {
    return functions.storage.object().onChange(event => {

        // What sort of data is on this incoming event?
        console.log('event.data? ', event.data);

        // File and directory paths.
        const filePath = event.data.name;
        const splitPath = filePath.split(path.sep);
        const fileDir = path.dirname(filePath);
        const fileName = path.basename(filePath);
        const fileKey = fileName.substring(0, fileName.lastIndexOf('.'));
        const tempLocalFile = path.join(os.tmpdir(), filePath);
        const tempLocalDir = path.dirname(tempLocalFile);
        const thumbTypes = THUMB_TYPES;

        console.log('filePath: ', filePath);

        // Exit if this is triggered on a file that is not an image.
        if (!event.data.contentType.startsWith('image/')) {
            console.log('This is not an image.');
            return;
        }

        // For now, exit if the path for this image doesn't break down to exactly three items.
        if (splitPath.length !== 3){
            console.log('This image needs to come from a path like dir/uid/basename.');
            return;
        }

        // Exit if the image is already a thumbnail (may need to change to "every")
        if (Object.keys(thumbTypes).some(type => fileName.substring(0, fileName.lastIndexOf('.')).endsWith(thumbTypes[type].suffix))){
            // Update the user-images object with this metadata.
            console.log('Already a Thumbnail.');
            return;
        }

        // Exit if this is a move or deletion event.
        if (event.data.resourceState === 'not_exists') {
            console.log('This is a deletion event.');
            return;
        }

        // Cloud Storage files.
        const bucket = gcs.bucket(event.data.bucket);
        const tmp = os.tmpdir();
        const file = bucket.file(filePath);

        Object.keys(thumbTypes).forEach(type => {
            const thisPathStr = `${ fileName.substring(0, fileName.lastIndexOf('.')) }${ thumbTypes[type].suffix }${ fileName.substring(fileName.lastIndexOf('.')) }`;
            const thumbFilePath = path.normalize(path.join(fileDir, thisPathStr));
            thumbTypes[type].thumbFile = bucket.file(thumbFilePath);
            thumbTypes[type].thumbFilePath = thumbFilePath;
            thumbTypes[type].tempLocalThumbFile = path.join(tmp, thumbFilePath);
        });

        // Create the temp directory where the storage file will be downloaded.
        return mkdirp(tempLocalDir)
        .then(() => {
            // Download file from bucket.
            return file.download({ destination: tempLocalFile });
        })
        .then(() => {
            console.log('The file has been downloaded to', tempLocalFile);
            // Generate a thumbnail using ImageMagick.
            return Promise.all(Object.keys(thumbTypes).map(type =>
                spawn('convert', [tempLocalFile, '-thumbnail', `${ thumbTypes[type].maxWidth }x${ thumbTypes[type].maxHeight }>`, thumbTypes[type].tempLocalThumbFile])
            ));
        })
        .then(() => {
            console.log('Thumbnail created at tempLocalThumbFile');
            // Uploading the Thumbnail.
            return Promise.all(Object.keys(thumbTypes).map(type =>
                bucket.upload(thumbTypes[type].tempLocalThumbFile, { destination: thumbTypes[type].thumbFilePath })
            ));
        })
        .then(() => {
            console.log('Thumbnail uploaded to Storage at tempFilePath');
            console.log('thumbTypes object: ', thumbTypes);
            // Once the image has been uploaded delete the local files to free up disk space.
            fs.unlinkSync(tempLocalFile);

            console.log('tempLocalFile unlinked');
            Object.keys(thumbTypes).forEach(type => {
                fs.unlinkSync(thumbTypes[type].tempLocalThumbFile);
            });

            // Get the Signed URLs for the thumbnail and original image.
            const config = {
                action: 'read',
                expires: '03-01-2500'
            };

            const fileArr = [file.getSignedUrl(config)];
            Object.keys(thumbTypes).forEach(type => {
                fileArr.push(thumbTypes[type].thumbFile.getSignedUrl(config));
            });

            return Promise.all(fileArr);
        })
        .then(results => {
            console.log('Got Signed URLs.', results);
            const originalUrl = results[0][0];

            const imgUrls = {
                original: originalUrl
            };

            results.shift();

            results.forEach((result, index) => {
                const type = Object.keys(thumbTypes)[index];
                imgUrls[type] = result[0];
            });

            console.log('updates going to db: ', imgUrls);

            // Get a key for a new Post.
            const userImgRef = admin.database().ref(`user-images/${ splitPath[1] }`);

            // Write the new post image data to the user images path.
            const updates = {};

            updates[`/${ fileKey }/thumbs`] = imgUrls;
            return userImgRef.update(updates);
        });
    });
};
