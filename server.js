var express = require('express');
var path = require('path');
var webpack = require('webpack');
var webpackMiddleware = require("webpack-dev-middleware");
var webpackConfig = require("./webpack.config.js");

// Create our app
var app = express();
const PORT = process.env.PORT || 3000;

app.use(function (req, res, next){
    if (req.headers['x-forwarded-proto'] === 'https') {
        res.redirect('http://' + req.hostname + req.url);
    } else {
        next();
    }
});

app.use('/favicon.ico', express.static(__dirname + '[route/to/favicon]'));

app.use('/bundle.js',express.static(path.join(__dirname, 'public/bundle.js')))

app.use('/*', express.static(path.join(__dirname, 'public')));
app.use(webpackMiddleware(webpack(webpackConfig), {
  quiet: false,
  lazy: false,
  publicPath: "/public/",
  watchOptions: {
      aggregateTimeout: 1000,
      poll: true
  },
  publicPath: webpackConfig.output.publicPath
}));
app.use(require("webpack-hot-middleware")(webpack(webpackConfig)));

app.listen(PORT, function () {
    console.log('Express server is up on port ' + PORT);
});
