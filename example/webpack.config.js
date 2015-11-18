var path = require("path");

module.exports = {
    entry: './example.js',
    output: {
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {test: /\.js$/, loader: "babel"},
            {test: /\.css$/, loader: "style!css"}
        ]
    }
};
