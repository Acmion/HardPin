module.exports = {
    entry: './src/index.js',
    output: {
        path: './dist/js/',
        filename: 'index.js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'to-string-loader',
                    'css-loader'
                ]
            }
        ]
    }
}