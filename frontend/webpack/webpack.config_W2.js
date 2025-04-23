const path = require('path');
const glob = require('glob');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { IgnoreEmitPlugin } = require('ignore-emit-webpack-plugin');

const jsObj = {
    main: glob.sync('./src/**/*.js').map(item =>
        item.replace(/\\/g, '/').replace(/^(?!\.?\/)/, './')
    )
};

const entLess = {
    ...glob.sync('./src/less/**/*.less').reduce((acc, filePath) => {
        const name = path.relative('./src/less', filePath).replace(/\.less$/, '');
        acc[name] = filePath.replace(/\\/g, '/').replace(/^(?!\.?\/)/, './');
        return acc;
    }, {})
};

const entries = { ...jsObj, ...entLess };

const lessEntryNames = Object.keys(entLess).map(name => `${name}.js`);

module.exports = {
    entry: entries,
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'less-loader'
                ]
            },
            {
                test: /\.js$/,
                use: ['babel-loader'],
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html'
        }),
        new CopyPlugin({
            patterns: [
                {from: "templates", to: "templates"},
                { from: 'fonts', to: 'fonts' },
                { from: 'images', to: 'images' }
            ]
        }),
        new MiniCssExtractPlugin({
            filename: 'styles/[name].css'
        }),
        new IgnoreEmitPlugin({
            files: lessEntryNames
        }),
],
resolve: {
    extensions: ['.js', '.less'],
        modules: [path.resolve(__dirname, 'src'), 'node_modules']
}
};