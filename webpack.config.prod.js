const merge = require('webpack-merge');
const webpack = require('webpack');
const path = require('path');
const envFile = require('node-env-file');

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.config.common');

try {
    envFile(`${ __dirname }/config/${ process.env.NODE_ENV }.env`);
} catch (e) {
    console.log('error joining path for envFile.', e);
}

const publicPath = '/';

console.log('process.env.NODE_ENV: ', process.env.NODE_ENV);
console.log('process.env.DATABASE_URL: ', process.env.DATABASE_URL);

module.exports = merge(common, {
    entry: [
        './app/app.jsx'
    ],
    output: {
        path: path.join(__dirname, 'public'),
        filename: 'bundle.js',
        publicPath
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new UglifyJSPlugin({
            sourceMap: true
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV),
                API_KEY: JSON.stringify(process.env.API_KEY),
                AUTH_DOMAIN: JSON.stringify(process.env.AUTH_DOMAIN),
                DATABASE_URL: JSON.stringify(process.env.DATABASE_URL),
                STORAGE_BUCKET: JSON.stringify(process.env.STORAGE_BUCKET),
                GITHUB_ACCESS_TOKEN: JSON.stringify(process.env.GITHUB_ACCESS_TOKEN)
            }
        })
    ],
    devtool: 'nosources-source-map'
});
