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

app.use(webpackMiddleware(webpack(webpackConfig), {
  quiet: false,
  lazy: false,
  stats: { color: true },
  watchOptions: {
      aggregateTimeout: 1000,
      poll: true
  },
  publicPath: webpackConfig.output.publicPath
}));

app.use('/', function (req, res, next) {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.use(require("webpack-hot-middleware")(webpack(webpackConfig)));

app.listen(PORT, function () {
    console.log('Express server is up on port ' + PORT);
});
