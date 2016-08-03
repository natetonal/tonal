// This is a mandatory settings file for Karma.
// Globbing pattern - path that includes asteriks to allow wildcard searching

// for Tonal, DEFNITELY check docs on this!!

// This can be used to log the karma output:
// logLevel: config.LOG_DEBUG,

var webpackConfig = require('./webpack.config.js');

module.exports = function(config){
    config.set({
        browserNoActivityTimeout: 20000,
        browsers: ['Chrome'],
        singleRun: true,
        frameworks: ['mocha'],
        files: [
            'node_modules/jquery/dist/jquery.min.js',
            'node_modules/foundation-sites/dist/foundation.min.js',
            'app/tests/**/*.test.jsx'
        ],
        preprocessors: {
            'app/tests/**/*.test.jsx': ['webpack', 'sourcemap']
        },
        reporters: ['mocha'],
        client: {
            mocha: {
                timeout: '5000'
            }
        },
        webpack: webpackConfig,
        webpackServer: {
            noInfo: true
        }
    });
};
