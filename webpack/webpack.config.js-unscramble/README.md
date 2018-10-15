# webpack.config.js详解
## output
```
output: {
    <!-- 输出文件名称 -->
    filename: 'bundle.js',
    <!-- 输出文件目录（dist不存在node会创建） -->
    path: path.resolve(__dirname, 'dist')
}
```
[__dirname](http://nodejs.cn/api/modules.html#modules_dirname): 获取当前文件所在路径，等同于path.dirname(__filename)
```
console.log(__dirname);
// Prints: /Users/mjr
console.log(path.dirname(__filename));
// Prints: /Users/mjr
```
[path.resolve([..paths])](http://nodejs.cn/api/path.html#path_path_resolve_paths): 把一个路径或路径片段的序列解析为一个绝对路径
> * 给定的路径的序列是从右往左被处理的，后面每个 path 被依次解析，直到构造完成一个绝对路径
> * 如果处理完全部给定的 path 片段后还未生成一个绝对路径，则当前工作目录会被用上
> * 生成的路径是规范化后的，且末尾的斜杠会被删除，除非路径被解析为根目录
> * 长度为零的 path 片段会被忽略
> * 如果没有传入 path 片段，则 path.resolve() 会返回当前工作目录的绝对路径
```
path.resolve('/foo/bar', './baz');
// 返回: '/foo/bar/baz'

path.resolve('/foo/bar', '/tmp/file/');
// 返回: '/tmp/file'

path.resolve('wwwroot', 'static_files/png/', '../gif/image.gif');
// 如果当前工作目录为 /home/myself/node，
// 则返回 '/home/myself/node/wwwroot/static_files/gif/image.gif'
```
## module
> * webpack 根据正则表达式，来确定应该查找哪些文件，并将其提供给指定的 loader
```
module: {
    rules: [
        {
            test: /\.css$/,
            use: [
                'style-loader',
                'css-loader'
            ]
        },
        {
          test: /\.(png|svg|jpg|gif|jfif)$/,
          use: [
            'file-loader'
          ]
        }
    ]
}
```
### [loader](https://webpack.docschina.org/concepts/loaders/) 介绍
有三种使用 loader 的方式，loader的加载顺序是从右往左，从下往上,loader 支持链式传递。loader 链中每个 loader，都对前一个 loader 处理后的资源进行转换。loader 链会按照相反的顺序执行。第一个 loader 将（应用转换后的资源作为）返回结果传递给下一个 loader，依次这样执行下去。最终，在链中最后一个 loader，返回 webpack 所预期的 JavaScript。
> * 配置（推荐）：在 webpack.config.js 文件中指定 loader。
> * 内联：在每个 import 语句中显式指定 loader。
>   ```
>   import Styles from 'style-loader!css-loader?modules!./styles.css';
>   ```
> * CLI：在 shell 命令中指定它们。
### [css-loader](https://webpack.docschina.org/loaders/css-loader/)功能拓展--react css模块化[拓展阅读](https://github.com/camsong/blog/issues/5)
* 如果要对每个css-loader加配置，可以写成对象形成
* path:路径--name:对象名字--local:类名 
* 开发时可以这样命名，但是生产环境为了压缩效率，命名一般不会这么长

文件目录
```
├── src
│   ├── img.jfif
│   ├── index.js
│   └── style.css
```
webpack.config.js
```
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
                }
            ]
        }
    ]
}
```
在react中使用
```
import style from './style.css';
<div className={style.hello}></div>
```
编译效果
```
.src-style__hello--3lVs3 {
  color: red;
  background: url(f23adb6fd9e7d9eff102f7229c2f4fa5.jfif);
}
<div class="src-style__hello--3lVs3"></div>
```
### [url-loader](https://webpack.docschina.org/loaders/url-loader/) && [file-loader](https://webpack.docschina.org/loaders/file-loader/) [参考](http://www.cnblogs.com/ghost-xyx/p/5812902.html)
如果我们希望在页面引入图片（包括img的src和background的url）。当我们基于webpack进行开发时，引入图片会遇到一些问题

其中一个就是引用路径的问题。拿background样式用url引入背景图来说，我们都知道，webpack最终会将各个模块打包成一个文件，因此我们样式中的url路径是相对入口html页面的，而不是相对于原始css文件所在的路径的。这就会导致图片引入失败。这个问题是用file-loader解决的，file-loader可以解析项目中的url引入（不仅限于css），根据我们的配置，将图片拷贝到相应的路径，再根据我们的配置，修改打包后文件引用路径，使之指向正确的文件

另外，如果图片较多，会发很多http请求，会降低页面性能。这个问题可以通过url-loader解决。url-loader会将引入的图片编码，生成dataURl。相当于把图片数据翻译成一串字符。再把这串字符打包到文件中，最终只需要引入这个文件就能访问图片了。当然，如果图片较大，编码会消耗性能。因此url-loader提供了一个limit参数，小于limit字节的文件会被转为DataURl，大于limit的还会使用file-loader进行copy。

url-loader和file-loader是什么关系呢？简答地说，url-loader封装了file-loader。url-loader不依赖于file-loader，即使用url-loader时，只需要安装url-loader即可，不需要安装file-loader，因为url-loader内置了file-loader。通过上面的介绍，我们可以看到，url-loader工作分两种情况：1.文件大小小于limit参数，url-loader将会把文件转为DataURL；2.文件大小大于limit，url-loader会调用file-loader进行处理，参数也会直接传给file-loader。因此我们只需要安装url-loader即可。

用url-loader处理图片路径
```
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
<!-- 或者 -->
options: {
  name: 'image/[name]-[hash:5].[ext]',
}
```
会将图片都放在输出目录（dist）下的image目录下

### 其它一些loader作用简介
*   [css-loader](https://webpack.docschina.org/loaders/css-loader/): 处理css文件中的url()等
*   style-loader: 将编译完成的css插入html中
*   html-loader: 处理 <img src="./my-image.png" />