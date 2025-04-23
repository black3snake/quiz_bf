const path = require('path');
const glob = require('glob');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

// Автоматическое создание entry points для всех LESS файлов
// const getLessEntries = () => {
//     return glob.sync('./**/*.less').reduce((entries, filePath) => {
//         const entryName = path.relative('./src', filePath).replace(/\.less$/, '');
//         entries[entryName] = filePath;
//         return entries;
//     }, {});
// };

module.exports = {
    entry: {
        // Главная точка входа для JS
        app: [
            './src/app.js',
            //..
            ],
        choice: './src/choice.less',
        common: './src/common.less',
        test2: './src/test2.less',

        // Динамические точки входа для LESS
        // ...getLessEntries()
    },
    mode: "development",
    devtool: "inline-source-map",
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'app.js',
        publicPath: '/',
        clean: true,
    },
    devServer: {
        static: '.dist',
        compress: true,
        port: 9000,
        // watchContentBase: true,
        // hot: true
    },
    module: {
        rules: [
            {
                test: /\.less$/,
                use: [
                    {loader: MiniCssExtractPlugin.loader},
                        // options: {
                        //     publicPath: '../' // Корректировка путей к ресурсам
                        // }},
                    {loader: 'css-loader'},
                    {loader: 'less-loader'},
                ],
                include: path.resolve(__dirname, 'src')
            },
            //Правило для обработки LESS файлов
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
            //     ],
            //     include: path.resolve(__dirname, 'src') // Указываем явно папку src
            //     // exclude: /node_modules/
            // },

            // Правило для обработки JS файлов (опционально с Babel)
            // {
            //     test: /\.js$/,
            //     exclude: /node_modules/,
            //     use: {
            //         loader: 'babel-loader',
            //         options: {
            //             presets: ['@babel/preset-env']
            //         }
            //     }
            // }
        ]
    },
    plugins: [
        // Очистка папки dist перед сборкой
        // new CleanWebpackPlugin(),

        // Плагин для извлечения CSS в отдельные файлы
        new MiniCssExtractPlugin({
            filename: 'styles/[name].css'
        }),
        new HtmlWebpackPlugin({
            template: "./index.html"
        }),
        // new CopyPlugin({
        //     patterns: [
        //         {from: "templates", to: "templates"},
        //         {from: "styles", to: "styles"},
        //         {from: "fonts", to: "fonts"},
        //         {from: "images", to: "images"},
        //     ],
        // }),
    ],
    // optimization: {
    //     splitChunks: {
    //         // Разделение общих зависимостей
    //         chunks: 'all',
    //         cacheGroups: {
    //             vendors: {
    //                 test: /[\\/]node_modules[\\/]/,
    //                 name: 'vendors',
    //                 chunks: 'all'
    //             },
    //             styles: {
    //                 name: 'styles',
    //                 test: /\.css$/,
    //                 chunks: 'all',
    //                 enforce: true
    //             }
    //         }
    //     }
    // }
};