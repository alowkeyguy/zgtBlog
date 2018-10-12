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
        }
    ]
}
<!-- 或者 -->
module: {
    rules: [
        {
            test: /\.css$/,
            use: [
                { loader: 'style-loader' },
                {
                    loader: 'css-loader',
                    options: {
                        modules: true
                    }
                }
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

一些loader作用简介
*   [css-loader](https://webpack.docschina.org/loaders/css-loader/): 处理css文件中的url()等
*   style-loader: 将编译完成的css插入html中
*   less-loader: 将less文件编译成css
*   sass-loader: 将sass文件编译成css