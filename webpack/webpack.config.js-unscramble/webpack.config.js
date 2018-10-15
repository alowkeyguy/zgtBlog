const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
   module: {
     rules: [
       {
         test: /\.css$/,
         use: [
          { loader: 'style-loader' },
          {
              loader: 'css-loader',
              options: {
                  modules: true,
                  localIdentName: '[path][name]__[local]--[hash:base64:5]'
              }
          },
        ]
      },
      {
        test: /\.(png|svg|jpg|gif|jfif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name]-[hash:5].[ext]',
              outputPath: 'image/'
            }
          }
        ]
      }
     ]
   }
};