const express = require('express');
const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('./webpack.config.js');

// Create our app
const PORT = process.env.PORT || 3000;

const app = new WebpackDevServer(webpack(webpackConfig), {
  publicPath: webpackConfig.output.publicPath,
  hot: true,
  historyApiFallback: true,
  stats: {
    colors: true
  }
});

app.use('/favicon.ico',
  express.static(path.join(__dirname, '[route/to/favicon]')));

app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.listen(PORT, () => {
  console.log('Webpack Dev server is up on port ' + PORT);
});
