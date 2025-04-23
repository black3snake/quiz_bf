const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: './src/app.js',
    mode: "development",
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js',
        clean: true,
    },
    devServer: {
        static: '.dist',
        // {
        // directory: path.join(__dirname, 'public'),
        // },
        compress: true,
        port: 9000,
    },
    module: {
        rules: [
            {
                test: /\.less$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../' // Корректировка путей к ресурсам
                        }
                    },
                    'css-loader',
                    'less-loader'
                ],
                include: path.resolve(__dirname, 'src')
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./index.html"
        }),
        new CopyPlugin({
            patterns: [
                {from: "templates", to: "templates"},
                // {from: "styles", to: "styles"},
                {from: "fonts", to: "fonts"},
                {from: "images", to: "images"},
            ],
        }),
        new MiniCssExtractPlugin({
            filename: 'styles/[name].css' // Сохранение в папку styles
        })
    ],
    resolve: {
        extensions: ['.js', '.less'],
        modules: [
            path.resolve(__dirname, 'src'),
            'node_modules'
        ]
    }
};