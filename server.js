const express = require('express');
const path = require('path');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackConfig = require('./webpack.config.js');

// Create our app
const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  if (req.headers['x-forwarded-proto'] === 'https') {
    res.redirect('http://' + req.hostname + req.url);
  } else {
    next();
  }
});

app.use('/favicon.ico',
  express.static(path.join(__dirname, '[route/to/favicon]')));

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

app.use('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.use(require('webpack-hot-middleware')(webpack(webpackConfig)));

app.listen(PORT, () => {
  console.log('Express server is up on port ' + PORT);
});
