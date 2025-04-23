const path = require('path');
const glob = require('glob');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// Автоматическое создание entry points для JS и LESS
const jsObj = {
    // JS файлы из папки js/
    app: glob.sync('./src/**/*.js').map(item => {
       return item.replace(/\\/g, '/').replace(/^(?!\.?\/)/, './');
    })
};
const entLess = {
    // LESS файлы из папки styles/
    ...glob.sync('./src/less/**/*.less').reduce((acc, filePath) => {
        const name = path.relative('./src/less', filePath).replace(/\.less$/, '');
        acc[name] = filePath.replace(/\\/g, '/').replace(/^(?!\.?\/)/, './');
        return acc;
    }, {})
};
const entries = {...jsObj, ...entLess};

module.exports = {
    entry: entries,
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        publicPath: '/'
    },
    module: {
        rules: [
            // Обработка JS файлов (с Babel)
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

            // Обработка LESS файлов
            {
                test: /\.less$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../'
                        }
                    },
                    'css-loader',
                    'less-loader'
                ]
            },

            // Обработка изображений и шрифтов
            {
                test: /\.(png|jpe?g|gif|svg|woff2?|ttf|eot)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/[hash][ext][query]'
                }
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: 'styles/[name].css'
        })
    ],
    optimization: {
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                },
                styles: {
                    name: 'styles',
                    test: /\.css$/,
                    chunks: 'all',
                    enforce: true
                }
            }
        }
    }
};