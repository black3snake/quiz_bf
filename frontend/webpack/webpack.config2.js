const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: './src/app.js',
    mode: "development",
    devtool: "inline-source-map",
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
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
    plugins: [
        new HtmlWebpackPlugin({
            template: "./index.html"
        }),
        new CopyPlugin({
            patterns: [
                {from: "templates", to: "templates"},
                {from: "styles", to: "styles"},
                {from: "fonts", to: "fonts"},
                {from: "images", to: "images"},
            ],
        }),
        new MiniCssExtractPlugin({
            filename: 'styles/[name].css' // Сохраняем в папку css с тем же именем
        })
    ],
    // module: {
    //     rules: [
    //         {
    //             test: /\.js$/,
    //             exclude: /node_modules/,
    //             use: {
    //                 loader: 'babel-loader',
    //                 options: {
    //                     targets: "defaults",
    //                     presets: [
    //                         ['@babel/preset-env']
    //                     ]
    //                 }
    //             }
    //         }
    //     ]
    // }
    module: {
        rules: [
            // {
            //     test: /\.less$/,
            //     use: [
            //         {
            //             loader: MiniCssExtractPlugin.loader,
            //             options: {
            //                 publicPath: '../' // Для корректных путей к ресурсам
            //             }
            //         },
            //         'css-loader',
            //         'less-loader'
            //     ]
            // }
            {
                test: /\.less$/,
                use: [
                    {loader: 'style-loader'},
                    {loader: 'css-loader'},
                    {loader: 'less-loader'},
                ],
                include: path.resolve(__dirname, 'src')
            },
        ]
    }
};

