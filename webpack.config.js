const path = require('path');
const HtmlWebpackPlugin = require('path');

module.exports = {
    entry: {
        app: './src/js/main.js'
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: "main.bundle.js"
    },
    module: {
        rules: [{
            test: /\.js?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
                presets: ['env']
            }
        }]
    },
    devtool: 'cheap-module-eval-source-map'
}