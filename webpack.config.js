/* eslint-disable */
var webpack = require('webpack');
var path = require('path');
var envFile = require('node-env-file');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

console.log('process.env.NODE_ENV: ', process.env.NODE_ENV);

try {
    envFile(`${__dirname}/config/${process.env.NODE_ENV}.env`);
} catch(e) {
    console.log('error joining path for envFile.', e);
}

console.log('process.env.DATABASE_URL: ', process.env.DATABASE_URL);

const babelQuery = {
    presets: ['react', 'es2015', 'stage-0']
};

module.exports = {
    context: __dirname,
    entry: [
        'webpack-dev-server/client?http://localhost:3000',
        'webpack/hot/only-dev-server',
        'react-hot-loader/patch',
        'script-loader!jquery/dist/jquery.min.js',
        'script-loader!foundation-sites/dist/js/foundation.min.js',
        './app/app.jsx'
    ],
    externals: {
        jquery: 'jQuery'
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.ProvidePlugin({
            '$': 'jquery'
            //   'jQuery': 'jquery'
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
                'API_KEY': JSON.stringify(process.env.API_KEY),
                'AUTH_DOMAIN': JSON.stringify(process.env.AUTH_DOMAIN),
                'DATABASE_URL': JSON.stringify(process.env.DATABASE_URL),
                'STORAGE_BUCKET': JSON.stringify(process.env.STORAGE_BUCKET),
                'GITHUB_ACCESS_TOKEN': JSON.stringify(process.env.GITHUB_ACCESS_TOKEN)
            }
        })
    ],
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'bundle.js',
        publicPath: 'http://localhost:3000/public/'
    },
    resolve: {
        modules: [
            'node_modules',
            path.resolve(__dirname, 'app/components')
        ],
        alias: {
            app: path.resolve(__dirname, 'app'),
            applicationStyles: path.resolve(__dirname, 'app/styles/app.scss'),
            actions: path.resolve(__dirname, 'app/actions'),
            store: path.resolve(__dirname, 'app/store/configureStore.jsx'),
            reducers: path.resolve(__dirname, 'app/reducers/index.js')
        },
        extensions: ['.js', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.json$/,
                use: ['json-loader']
            },
            {
                test: /\.jsx?$/,
                include: path.join(__dirname, 'app'),
                exclude: /(node_modules|bower_components)/,
                use: [
                    'react-hot-loader/webpack',
                    'babel-loader?' + JSON.stringify(babelQuery)
                ]
            },
            {
                test: /\.woff$|\.woff2$|\.ttf$|\.eot$|\.svg$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'app/styles/fonts/[name].[ext]'
                        }
                    }
                ]
            },
            {
                test: /\.scss$/,
                include: path.resolve(__dirname, './node_modules/foundation-sites/scss'),
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            }
        ]
    },
    devtool: process.env.NODE_ENV === 'production' ? undefined : 'cheap-module-eval-source-map',
};


// sassLoader: {
//   includePaths: [
//       path.resolve(__dirname, './node_modules/foundation-sites/scss')
//   ]
// },
