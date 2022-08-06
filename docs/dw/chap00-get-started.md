# 新手上路

## 新手村任务

### 任务一: Mac 环境搭建

领取 Mac 电脑, 完成基本设置即可.

- 安装**企业微信**, **飞书**
- 安装**云安全访问服务** (SASE, 非常重要! 安装好以后, 建议长期开启)
- 安装**Chrome 浏览器**, **iTerm2**, **Sublime** 等常用工具软件

### 任务二: 记录我们的工作

1. 在终端 (Terminal/iTerm2) 中执行 `ssh-keygen -t rsa` (按默认方式, 一直回车即可), 生成 SSH 秘钥,
复制 `cat ~/.ssh/id_rsa.pub` 公钥的内容, 发给无忌, 让他追加到 dev1/dev2 机器的 `~/.ssh/authorized_keys` 文件中.
2. 提供公司邮箱地址, 找赵振开通阿里云子账号; 找无忌开通云效权限, 加入项目组; 找无忌加入堡垒机.
3. 把第 1 步中生成的公钥, 配置到云效->个人设置->SSH 公钥
4. 按 [技术文档, 快速上手](/essay/) 指引, 在本地运行起来
5. 在文档项目中, 创建你的工作记录文档, 目录 `ut-notes/docs/news/`
6. 记录下你的工作内容, 提交, 推送到服务器, 并发布
7. 浏览/阅读技术文档

文档对于一个团队非常重要, 你现在上手有多难, 文档就有多重要, 一起来维护文档吧!

### 任务三: 阅读文档, 整理文档

- 你当前正在看的这一系列文档
- [技术部新人须知](https://nowcoder.yuque.com/docs/share/d98cd1ad-fc33-4862-96a0-db16fab08823?#)
- [算法组新人入职流程](https://nowcoder.yuque.com/zsasxs/yp2bge/cs8o7f)

在阅读过程中, 任何你觉得有价值的内容, 以 Markdown 形式, 沉淀在这份文档仓库中!

## 相关服务器

- dev1 测试服务器, 登录方式 `ssh web@118.31.125.185`, 将 SSH 公钥提供给 mentor
- dev2 测试服务器, 登录方式 `ssh web@121.199.24.48`, 将 SSH 公钥提供给 mentor
- [全部服务器信息](https://nowcoder.yuque.com/zsasxs/yp2bge/lihnpe), 通过堡垒机登录: `ssh -p 60022 <username>@ciowjtwmqf-public.bastionhost.aliyuncs.com`, `<username>` 为邮箱 `@` 之前的部分.

## Python 开发环境

建议使用 `Python 3.7.11`, macOS 安装 `brew install python@3.7`; CentOS 服务器都已经安装好了, `python3 -V`; Ubuntu 可以使用如下共享

```sh
$ /nk_share/context/anaconda3/envs/python37/bin/python -V
Python 3.7.11
$ /nk_share/context/anaconda3/bin/python -V
Python 3.8.8
```

在服务器上使用 Python 时, 建议通过 venv 方式, 比如

```
mkdir ~/venv
cd ~/venv
/nk_share/context/anaconda3/envs/python37/bin/python -m venv venv-py37-tf1
source venv-py37-tf1/bin/activate
pip3 install -U pip 'setuptools<42' wheel
pip3 install -r requirements.txt
/home/web/venv/venv-py37-tf1/bin/python -V
```

也可以使用共享盘的环境@付凡

Python3.7环境OK了：
- Develop：`/nk_share/context/python_venv/python3.7/dev/bin/python`
- Release：`/nk_share/context/python_venv/python3.7/release/bin/python`

Python3.8环境OK了：
- Develop：`/nk_share/context/python_venv/python3.8/develop/bin/python`
- Release：`/nk_share/context/python_venv/python3.8/release/bin/python`

## Java 开发环境

Java 版本 1.8.0, Maven 版本 3.5.2, 服务器上有相关资源
```sh
ssh web@118.31.125.185
cd /nk_share/software
ls
```
locale 为 zh_CN, 注意服务器上 locale 的配置, 详情如下
```text
$ mvn -version
Apache Maven 3.5.2 (138edd61fd100ec658bfa2d307c43b76940a5d7d; 2017-10-18T15:58:13+08:00)
Maven home: /opt/apache-maven-3.5.2
Java version: 1.8.0_131, vendor: Oracle Corporation
Java home: /Library/Java/JavaVirtualMachines/jdk1.8.0_131.jdk/Contents/Home/jre
Default locale: zh_CN, platform encoding: UTF-8
OS name: "mac os x", version: "10.16", arch: "x86_64", family: "mac"
```

[私有maven仓库配置](https://packages.aliyun.com/repos/2132864-snapshot-rM8X5L/guide), 如果需要 deploy, 需要在 maven 项目中, 增加如下配置

```xml
<distributionManagement>
  <snapshotRepository>
    <id>rdc-snapshots</id>
    <url>https://packages.aliyun.com/maven/repository/2132864-snapshot-rM8X5L/</url>
  </snapshotRepository>
  <repository>
    <id>rdc-releases</id>
    <url>https://packages.aliyun.com/maven/repository/2132864-release-gYJMkT/</url>
  </repository>
</distributionManagement>
```

Protobuf 安装旧版本的方法
- 关闭 Brew 的自动更新后，使用 Brew 自动安装。可参考 [Protobuf 安装旧版本](https://zhiyuanbiji.cn/notes/d833cff766e5c3a305160ba5eef3ec9b)


Maven 项目 Build 时出现 "No compiler is provided in this environment" 的解决方法:
1. 进入 maven 下的 bin 目录，如：cd /usr/local/apache-maven-3.5.2
2. 修改 mvn 文件，添加 JAVA_HOME，如：
```text
cd /usr/local/apache-maven-3.5.2/bin
vim mvn
添加一行：JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk1.8.0_131.jdk/Contents/Home
```
