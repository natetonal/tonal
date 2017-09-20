const merge = require('webpack-merge');
const webpack = require('webpack');
const path = require('path');
const envFile = require('node-env-file');

const common = require('./webpack.config.common');

process.env.NODE_ENV = 'development';

try {
    envFile(`${ __dirname }/config/${ process.env.NODE_ENV }.env`);
} catch (e) {
    console.log('error joining path for envFile.', e);
}

console.log('process.env.NODE_ENV: ', process.env.NODE_ENV);
console.log('process.env.DATABASE_URL: ', process.env.DATABASE_URL);
console.log('output path: ', path.join(__dirname, 'public'));

module.exports = merge(common, {
    entry: [
        'react-hot-loader/patch', // activate HMR for React
        'webpack-dev-server/client?http://localhost:3000', // bundle the client for webpack-dev-server and connect to the provided endpoint
        'webpack/hot/only-dev-server', // bundle the client for hot reloading, only- means to only hot reload for successful updates
        'script-loader!jquery/dist/jquery.min.js',
        'script-loader!foundation-sites/dist/js/foundation.min.js',
        './app/app.jsx'
    ],
    devtool: 'cheap-module-eval-source-map',
    devServer: {
        contentBase: path.resolve(__dirname, 'public'),
        port: 3000,
        historyApiFallback: true,
        hot: true,
        publicPath: '/'
    },
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
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
    ]
});
