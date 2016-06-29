const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const env = process.env.NODE_ENV || 'development';

const isBuild = env === 'production' || process.env.BUILD;

const clean = list => list.filter(l => l);

const withBuild = module => (isBuild ? module : null);

module.exports = {
    context: path.join(__dirname, './src'),
    entry: {
        app: './index.js'
    },
    output: {
        publicPath: '/',
        path: 'dist',
        filename: '[name].[hash].js'
    },
    resolve: {
        root: [path.resolve('./src'), path.resolve('./node_modules')],
        extensions: ['', '.js', '.jsx']
    },
    devtool: isBuild ? 'source-map' : 'eval',
    module: {
        loaders: [
            { test: /\.jsx?$/, loaders: ['react-hot', 'babel'], exclude: /node_modules/ },
            { test: /\.html$/, loader: 'raw' },
            { test: /\.css$/, loader: 'style!css' },
            { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff' },
            { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff' },
            { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream' },
            { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file' },
            { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml' },
            { test: /\.jpg$/, loader: 'url?limit=10000&minetype=image/jpg' },
            { test: /\.png$/, loader: 'url?limit=10000&minetype=image/png' },
            { test: /\.ico/, loader: 'url?limit=10000&minetype=image/x-icon' },
        ]
    },
    plugins: clean([
        new webpack.DefinePlugin({
            'process.env': { NODE_ENV: JSON.stringify(env) },
        }),
        new HtmlWebpackPlugin({ template: 'index.html', inject: 'body' }),
        withBuild(new webpack.optimize.OccurenceOrderPlugin()),
        withBuild(new webpack.NoErrorsPlugin()),
        withBuild(new webpack.optimize.DedupePlugin()),
        withBuild(new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            compress: { warnings: false }
        }))
    ])
};
