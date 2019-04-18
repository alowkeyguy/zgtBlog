# git
##  [配置](https://git-scm.com/book/zh/v2/%E8%B5%B7%E6%AD%A5-%E5%88%9D%E6%AC%A1%E8%BF%90%E8%A1%8C-Git-%E5%89%8D%E7%9A%84%E9%85%8D%E7%BD%AE) git config：
> 可以从五个不同的地方`读/写`配置，我们输入`git config`
```
Config file location
    --global              use global config file
    --system              use system config file
    --local               use repository config file
    -f, --file <file>     use given config file
    --blob <blob-id>      read config from given blob object
```
优先级从上到下`递增`，一般我用下面两种：

  * 全局配置
  ```
  $ git config --global user.name "Your Name"
  $ git config --global user.email "email@example.com"
  ```
  * 单个项目配置
  ```
  $ git config --local user.name "Your Name"
  $ git config --local user.email "email@example.com"
  ```
## 多人开发流程
根据项目、成员等来定，一些比较广泛做法：
* [分布式 Git - 分布式工作流程](https://git-scm.com/book/zh/v2/%E5%88%86%E5%B8%83%E5%BC%8F-Git-%E5%88%86%E5%B8%83%E5%BC%8F%E5%B7%A5%E4%BD%9C%E6%B5%81%E7%A8%8B)
* [Git分支管理策略](http://www.ruanyifeng.com/blog/2012/07/git.html)
* [Git由浅入深之分支管理](http://blog.codingplayboy.com/2017/04/06/git_branch/)
## 分支管理过程中常用命令
* `git branch newbranch dev`从dev分支切出newbranch
* `git branch newbranch` > `git checkout newbranch`新建并切换到newbranch，默认从当前HEAD所指向的分支切出
* `git checkout -b newbranch master`在本地master分支上切出newbranch分支，并将HEAD指向newbranch分支（切换到新分支），如果master有跟踪分支，则跟
* `git push origin newbranch`将本地分支推送至远程服务器`如果远程服务器该分支不存在，则会自动新建一个`
* `git merge --no-ff bug-1`使用--no-ff参数后，会执行正常合并，在Master分支上生成一个新节点。为了保证版本演进的清晰，推荐此方式
* `git push origin --delete test`删除远程分支
* `git branch -d test`删除本地分支
* `git branch -u 远端主机别名/远程分支名`修改跟踪关系
* `git checkout -b 本地分支名 远端主机别名/远程分支名`创建跟踪分支
* `git checkout --track 远端主机别名/远程分支名`当然也可以不指定分支名，使用远程分支同名
* `git tag -a 1.2`打个标签
## 设置远程服务器的版本库地址
* `git remote -v` 查询所有远程版本库地址
* `git remote add origin url` 添加远程版本库
* `git remote remove origin` 删除远程版本库，如果要更改远程版本库链接，要先删除，再添加
## 版本回滚
### 此远程分支自己一个维护
所有仓库的代码在所有开发者本地都有一份，如果该分支一个人维护，可以这样搞，不用考虑其它人push的问题
```
git log --oneline          //查看提交记录
git reset --hard <版本号>  //将本地回滚到指定版本
git push -f                // 强推--本地分支回滚后，版本将落后远程分支，必须使用强制推送覆盖远程分支，否则无法推送到远程分支
```
### 该分支多人维护
```
git revert HEAD      //撤销最近一次提交
git revert HEAD~1    //撤销上上次的提交，注意：数字从0开始
git revert 0ffaacc   //撤销0ffaacc这次提交
```
* revert 是撤销一次提交，所以后面的commit id是你需要回滚到的版本的前一次提交
* 使用revert HEAD是撤销最近的一次提交，如果你最近一次提交是用revert命令产生的，那么你再执行一次，就相当于撤销了上次的撤销操作，换句话说，你连续执行两次revert HEAD命令，就跟没执行是一样的
* 使用revert HEAD~1 表示撤销最近2次提交，这个数字是从0开始的，如果你之前撤销过产生了commi id，那么也会计算在内的。
* 如果使用 revert 撤销的不是最近一次提交，那么一定会有代码冲突，需要你合并代码，合并代码只需要把当前的代码全部去掉，保留之前版本的代码就可以了.
##  git 查看某个文件的修改记录
```
cd src  //切换到该文件目录下
git log --oneline -5 <fineName>
git show <版本号>
```
## [Git 基础 - 撤消操作](https://git-scm.com/book/zh/v2/Git-%E5%9F%BA%E7%A1%80-%E6%92%A4%E6%B6%88%E6%93%8D%E4%BD%9C)
* `git status`命令会有提示
##  本地保存修改
+   $ git add * 将所有修改加入暂存区
+   $ git commit -m '该次修改的说明' 将暂存区的修改永久保存到版本库
 
##  查看版本
+   $ git log
+   $ git log --oneline
+   $ git log --graph --oneline --decorate
 
## 标签
1.  添加标签
```
$ git tag -a v1.4 -m '标签注释'
```
2.  追加标签
```
$ git tag -a v1.2 9fceb02
```
> 默认情况下，git push 并不会把标签传送到远端服务器上，只有通过显式命令才能分享标签到远端仓库。其命令格式如同推送分支，运行 git push origin [tagname] 即可
>
> 如果要一次推送所有本地新增的标签上去，可以使用 --tags 选项

参考： 
* [基础 - 打标签](https://git-scm.com/book/zh/v1/Git-%E5%9F%BA%E7%A1%80-%E6%89%93%E6%A0%87%E7%AD%BE)