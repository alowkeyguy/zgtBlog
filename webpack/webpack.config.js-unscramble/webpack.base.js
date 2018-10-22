const path = require('path');
const HtmlWebpackPlugins = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  plugins: [
    // 清除dist文件夹
    new CleanWebpackPlugin(['dist']),
    // 生成新的html，并将生成的script，css导入（由于文件名一般会加入hash，所以手动写不太可能）
    new HtmlWebpackPlugins({
      title: 'output by HtmlWebpackPlugins'
    })
  ],
  output: {
    filename: '[name].bundle.js',
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