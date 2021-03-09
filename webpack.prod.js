const path = require('path');
const { merge: webpackMerge } = require('webpack-merge');
const commonConfig = require('./webpack.common');

module.exports = webpackMerge(commonConfig, {
    mode: 'production',
    plugins: [
    ],
});