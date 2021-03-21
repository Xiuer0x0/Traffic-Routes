const path = require('path');
const { merge: webpackMerge } = require('webpack-merge');
const commonConfig = require('./webpack.common');

const service = {
    host: 'localhost',
    port: 58080,
    get url() {
        const port = (this.port) ? `:${this.port}` : '';

        return `http://${this.host}${port}`;
    },
};

module.exports = webpackMerge(commonConfig, {
    mode: 'development',
    watch: true,
    devtool: 'source-map',
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        inline: true,
        host: service.host,
        port: service.port,
        hot: true,
        open: {
            app: [
                'chrome',
                '--user-data-dir=./chromeTempDevUser',
                '--incognito',
            ],
        },
        // openPage: [service.url, './test.html'],
        // historyApiFallback: {
        //     rewrites: [
        //         { from: /./, to: service.url },
        //     ],
        // },
    },
    plugins: [
    ],
});