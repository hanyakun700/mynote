## git
### git配置
Git初始化配置
    设置用户名：   git config --global user.name "<用户名>"
    设置用户邮箱： git config --global user.email "<电子邮件>"
git config --list 查看当前用户的配置

### 常用命令
初始化
1. git init 初始化项目后 把这个目录变成git可以管理的仓库
git remote add origin ssh://op@10.4.30.43:23/data/ut/codebase/ut-notes.git 关联一个远程库
git push -u origin master  把当前master分支推送到远程库 第一次要用-u 以后不需要 


### 修改 恢复 提交
git status 查看文件所处位置
    红色表示还未添加到暂存区或者还未被追踪
    绿色表示加到暂存区还未提交
  
未追踪 工作区 暂存区 本地仓库 远端仓库

未追踪或工作区 新建文件或对已有文件的修改
git add 由 未追踪或工作区 添加到 暂存区
git restore 1.txt 由 暂存区 添加到 工作区

暂存区
git commit 1.txt 由 暂存区 添加到 本地仓库
git restore --staged 1.txt 由 本地仓库 恢复到 暂存区

本地仓库 
git reset
git reset --hard HEAD 回退到当前版本 暂存区和工作区全部回退

git reset 和 get revert
reset会直接回退 其后的不保留
revert会只剔除某个版本 其后的保留


修改和  

git diff readme.txt 能够查看还未被提交到暂存区的文件做了哪些修改
git reset  --hard 版本号   回退版本 HEAD当前 HEAD^上一个
    回退版本后  工作区 暂存区分别会怎么变化

删除
    rm 1.txt
        如果是误删除了 checkout 找回来
    git rm 1.txt 删除
    git commit 


提交日志查看
git log --pretty=oneline 历史提交
git reflog 查看历史记录的版本号id 

### 分支相关操作
git branch -a 查看全部分支 
git checkout master 切换分支
git checkout -b hyktest 创建分支并切换
git branch -d hyktest 删除本地分支
git push origin --delete hyktest 删除远程分支 


代码拉取和合并
git fetch  origin hyktest  从线上拉取分支
git rebase origin hyktest  将线上的分支合并到本地
git push origin hyktest  将本地当前分支推到线上的hyktest分支
git push origin master --no-verify 不做相关检查

git pull = git fetch + git merge
merge 和 rebase区别
    rebase 等于是将之前的都合并到一起了
    merge还会保留之前的提交记录

#### 多个分支 合并
以hyktest合并到master为例子

1.切换到 hyktest 将其多次提交合并为一次
    git checkout hyktest 
    git rebase -i HEAD ~ 3 合并最近 3 次提交

2.切换到master 将 hyktest  合并到master后并提交
    git checkout master
    git fetch origin master 
    git rebase hyktest 
    git pull --rebase ?? 
    git push origin master

3.将 hyktest 删除
    git branch -d hyktest 删除本地分支
    git push origin --delete hyktest 删除远端分支

### 其他命令
设置分支关联  
git branch --set-upstream-to=origin/hyktest  #将本地分支与远程分支关联 
        本地有test分支，远程也有test分支，但是本地的test分支不是从远程拉取下来的，要关联两个分支使用命令


   git stash 把当前的工作隐藏起来 等以后恢复现场后继续工作

   git stash list 查看所有被隐藏的文件列表

   git stash apply 恢复被隐藏的文件，但是内容不删除

   git stash drop 删除文件

   git stash pop 恢复文件的同时 也删除文件
