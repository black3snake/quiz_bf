const path = require('path');
const glob = require('glob');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const {IgnoreEmitPlugin} = require('ignore-emit-webpack-plugin');
const {CleanWebpackPlugin} = require("clean-webpack-plugin");


// const getLessEntries = () => {
//     return glob.sync('./src/less/**/*.less').reduce((entries, filePath) => {
//         const entryName = path.relative('./src/less', filePath).replace(/\.less$/, '');
//         entries[entryName] = filePath.replace(/\\/g, '/').replace(/^(?!\.?\/)/, './');
//         return entries;
//     }, {});
// };
const optimization = () => {
    const config = {
        splitChunks: {
            chunks: 'all'
        }
    }
}

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const cssLoaders = extra => {
    const loaders = [
        {
            loader: MiniCssExtractPlugin.loader,
            options: {
                // hmr: isDev,
                // reloadAll: true
            },
        },
        'css-loader'
    ]
    if (extra) {
        loaders.push(extra)
    }
    return loaders
}

module.exports = {
    entry: './src/app.js',
        // {
    //     // Главная точка входа для JS
    //     main: './src/app.js',
    //
    //     // Динамические точки входа для LESS
    //     // ...getLessEntries(),
    // },

    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js',
        publicPath: '/',
        clean: true,
    },
    devServer: {
        static: '.dist',
        // {
        // directory: path.join(__dirname, 'public'),
        // },
        compress: true,
        port: 9000,
        hot: isDev,
    },
    module: {
        rules: [
            {
                test: /\.less$/,
                use: cssLoaders('less-loader'),
            },
            {
                test: /\.(png|jpg|svg|gif)$/,
                use: ['file-loader']
            },
            {
                test: /\.(ttf|woff|woff2|eot)$/,
                use: ['file-loader']
            },
            // Правило для обработки JS файлов (опционально с Babel)
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            // {
            //     test: /\.js$/,
            //     use: ['babel-loader'],
            //     exclude: /node_modules/
            // }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
            minify: {
                collapseWhitespace: isProd, // оптимизация
            }
        }),
        new CopyPlugin({
            patterns: [
                {from: "templates", to: "templates"},
                {from: 'fonts', to: 'fonts'},
                {from: 'images', to: 'images'}
            ]
        }),
        new MiniCssExtractPlugin({
            filename: 'styles/[name].css'
        }),
        new CleanWebpackPlugin(),
        // new IgnoreEmitPlugin({
        //     files: lessEntryNames
        // }),
    ],
    optimization: optimization(),
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
    // },
    resolve: {
        extensions: ['.js', '.less'],
        modules: [path.resolve(__dirname, 'src'), 'node_modules']
    }
}