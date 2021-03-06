var HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    mode: 'development',
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /(node_modules|bower_compontents)/,
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
            '@': path.resolve(__dirname, 'src/'),
        }
    },
    plugins: [new HtmlWebpackPlugin({
        template: './src/index.html'
    })],
    
    devServer: {
        historyApiFallback: true,
        port:6070
    },
    
    externals: {
        // global app config object
        config: JSON.stringify({
            apiUrl: 'http://localhost:6069',
            synonymDictUrl:'http://thesaurus.altervista.org/thesaurus/v1',
            wikiUrl:'https://en.wikipedia.org/'
        })
    },
    
}