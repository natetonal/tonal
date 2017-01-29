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
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    'react-hot-loader/patch',
    'script!jquery/dist/jquery.min.js',
    'script!foundation-sites/dist/js/foundation.min.js',
    './app/app.jsx'
  ],
  externals: {
    jquery: 'jQuery'
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.ProvidePlugin({
      '$': 'jquery'
    //   'jQuery': 'jquery'
    }),
    new webpack.optimize.UglifyJsPlugin({
        compressor: {
            warnings: false
        }
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
    path: '/',
    filename: 'bundle.js',
    publicPath: 'http://localhost:3000/public/'
  },
  resolve: {
    root: __dirname,
    modulesDirectories: [
        'node_modules',
        './app/components',
        './app/api'
    ],
    alias: {
      app: 'app',
      applicationStyles: 'app/styles/app.scss',
      actions: 'app/actions/actions.jsx',
      store: 'app/store/configureStore.jsx',
      reducers: 'app/reducers/reducers.jsx'
    },
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
        {
            test: /\.jsx?$/,
            loaders: ['react-hot-loader/webpack', 'babel?' + JSON.stringify(babelQuery)],
            include: path.join(__dirname, 'app'),
            exclude: /(node_modules|bower_components)/
        },
        {
            test: /\.json$/,
            loader: "json-loader"
        },
        {
            test: /\.woff$|\.woff2$|\.ttf$|\.eot$|\.svg$/,
            loader: 'url',
            query:
            {
                name: 'app/styles/fonts/[name].[ext]'
            },
        },
        {
          test: /plugin\.css$/,
          loaders: [ 'style', 'css'],
        }
    ]
  },
  sassLoader: {
    includePaths: [
        path.resolve(__dirname, './node_modules/foundation-sites/scss')
    ]
  },
  stats: {
    assets: false,
    colors: true,
    version: false,
    hash: false,
    timings: false,
    chunks: false,
    chunkModules: false
  },
  devtool: process.env.NODE_ENV === 'production' ? undefined : 'cheap-module-eval-source-map'
};
