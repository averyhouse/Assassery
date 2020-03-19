const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        },
        {
            test: /\.css$/,
            use: [
                'style-loader',
                'css-loader',
            ]
        },
        {
            test: /\.(png|svg|jpg|gif)$/,
            use: [
                'url-loader',
            ]
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin({
        cleanAfterEveryBuildPatterns: ['static']
      })
    ]
  };