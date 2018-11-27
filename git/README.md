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
* `git checkout -b newbranch master`在本地master分支上切出newbranch分支，并将HEAD指向newbranch分支（切换到新分支）
* `git push origin newbranch`将本地分支推送至远程服务器`如果远程服务器该分支不存在，则会自动新建一个`
* `git merge --no-ff bug-1`使用--no-ff参数后，会执行正常合并，在Master分支上生成一个新节点。为了保证版本演进的清晰，推荐此方式
* `git push origin --delete test`删除远程分支
* `git branch -d test`删除本地分支
## 设置远程服务器的版本库地址
* `git remote -v` 查询所有远程版本库地址
* `git remote add origin url` 添加远程版本库
* `git remote remove origin` 删除远程版本库，如果要更改远程版本库链接，要先删除，再添加
## 版本回滚
### 此远程分支自己一个维护
就像区块链一样，所有仓库的代码在所有开发者本地都有一份，如果该分支一个人维护，可以这样搞，不用考虑其它人push的问题
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
##  本地保存修改
+   $ git add * 将所有修改加入暂存区
+   $ git commit -m '该次修改的说明' 将暂存区的修改永久保存到版本库

##  上传本地版本至远程版本库
+   $ git push origin master 
 
##  查看版本
+   $ git log
+   $ git log --oneline
+   $ git log --graph --oneline --decorate
 
##  版本回滚
+   $ git reset --hard commit_id 通过git log看到的某个提交开头的字符串就是commit_id 
 
##  多人协助 分支branch
+   $ git branch 查看所有分支名
+   
+   $ git branch new-branchName 以当前版本创建新分支
+   $ git branch -d branchName 删除分支
+   
+   $ git checkout branchNmae 切换分支   
 
##  合并分支
+   $ git merge other-branch-name 将其他分支合并到当前分支
+   如果两个分支的同一文件都有过修改，而且修改不相同，就会出现合并冲突，需要选择使用哪一个修改
+   打开命令行中提示有冲突的文件，Git用<<<<<<<，=======，>>>>>>>标记出不同分支的内容，删除这些标记，把文件修改成想要保存的，保存
+   提交
+   $ git add conflictFileName 或者 $ git add *
+   $ git commit -m '修改冲突说明'
 
##  多人开发流程
+   主分支master，也可以新建一个dev分支作为频繁修改的开发主分支，master作为稳定的版本主分支
+   每个人有一个自己的分支，开发时，切换到自己的分支，把修改提交到自己的分支
+   完成一个小修改后，需要汇总到主分支时，
    +   切换到主分支，使用pull，把主分支更新到与远程版本库一致
    +   使用merge，把个人分支合并到主分支
    +   使用push把主分支上传远程版本库
    +        git log --oneline 查看最新的commit_id
    +        切换到个人分支，git reset --hard commit_id，将个人分支指向最新提交
    +        
+   如果多人同一时刻汇总，后上传的人可能会因为冲突（自己合并时的主分支与现在远程主分支由于有人提交而不一致了）而上传失败，需要将主分支回滚到合并前，重新进行一次
+   如果多人开发需要修改的文件有较多交集，应当经常进行汇总，以免积累过多冲突

##  切换的develop分支，如果没有就新建个
+  $ git checkout -b develop origin/develop

##  其它
* 显示command的helpgit help <command>
* 提交修改内容git commit "message"
* 将工作文件修改提交到本地暂存区git add <file>
* 将本地主分支推到远程git push -u <remoteName> <localBrachName>
* 克隆远程仓库git clone <url>
* 初始化仓库git init
* 创建仓库git remote add <remoteName> <url>
* 删除远程仓库git remote rm <name>
* 修改远程主机名git remote rename <remoteName> <newRemoteName>
* 拉取远程仓库git pull <remoteName> <localBrachName>
* 修改远程仓库git remote set-url --push <remoteName> <newUrl>
* 获取远程仓库的更新git fetch <remoteName>
* 获取远程仓库特定分支的更新git fetch <remoteName> <brachName>