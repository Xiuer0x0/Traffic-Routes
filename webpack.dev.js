const path = require('path');
const { merge: webpackMerge } = require('webpack-merge');
const commonConfig = require('./webpack.common');

const service = {
    // host: 'localhost',  // 限本地
    host: '0.0.0.0',    // 允許區網裝置連線
    port: 58080,
    get url() {
        const host = (this.host === '0.0.0.0') ? `localhost` : this.host;
        const port = (this.port) ? `:${this.port}` : '';

        return `http://${host}${port}`;
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
        openPage: [
            service.url,
        ],
    },
    plugins: [
    ],
});