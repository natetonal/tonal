/* eslint-disable */
const webpack = require('webpack');
const path = require('path');

const babelQuery = {
    presets: ['react', 'es2015', 'stage-0']
};

module.exports = {
    entry: [
        'script-loader!jquery/dist/jquery.min.js',
        'script-loader!foundation-sites/dist/js/foundation.min.js'
    ],
    externals: {
        jquery: 'jQuery'
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.ProvidePlugin({
             '$': 'jquery'
        })
    ],
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
            reducers: path.resolve(__dirname, 'app/reducers/index.js'),
            router: path.resolve(__dirname, 'app/router'),
        },
        extensions: ['.js', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: [
                    'babel-loader?' + JSON.stringify(babelQuery)],
                include: path.join(__dirname, 'app'),
                exclude: /(node_modules|bower_components)/
            },
            {
               test   : /\.css$/,
               use: [
                   'style-loader',
                   'css-loader',
                   'resolve-url-loader'
               ]
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'resolve-url-loader'
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            includePaths: [
                                path.resolve(__dirname, 'node_modules/foundation-sites/scss'),
                                path.resolve(__dirname, 'app/styles')
                            ]
                        }
                    }
                ]
            },
            {
                test: /\.json$/,
                use: ['json-loader']
            },
            {
                test: /\.woff$|\.woff2$|\.ttf$|\.eot$|\.svg$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            name: 'app/styles/fonts/[name].[ext]'
                        }
                    }
                ]
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [
                    'file-loader?hash=sha512&digest=hex&name=[hash].[ext]',
                    'image-webpack-loader?bypassOnDebug&optipng.optimizationLevel=7&gifsicle.interlaced=false',
                ],
            }
        ]
    },
    performance: {
        hints: false
    }
};

// new webpack.LoaderOptionsPlugin({
//     options: {
//         // context: '/', // <- putting this line right under "options" did the trick
//         sassLoader: {
//             includePaths: [
//                  path.resolve(__dirname, 'node_modules/foundation-sites/scss'),
//                  path.resolve(__dirname, 'app/styles')
//             ]
//         }
//     }
// }),

// sassLoader: {
//   includePaths: [
//       path.resolve(__dirname, './node_modules/foundation-sites/scss')
//   ]
// },

// {
//   test: /\.scss$/,
//   use: [
//       'style-loader',
//       'css-loader',
//       'resolve-url-loader',
//       'sass-loader?sourceMap'
//   ]
// },

// {
//    test: /\.scss$/,
//    use: [
//        {
//            loader: 'style-loader'
//        },
//        {
//            loader: 'css-loader'
//        },
//        {
//            loader: 'resolve-url-loader'
//        },
//        {
//            loader: 'sass-loader',
//            options: {
//                includePaths: [path.resolve(__dirname, 'node_modules/foundation-sites/scss')]
//            }
//        }
//    ]
// },
