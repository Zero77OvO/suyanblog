---
title: Git
date: 2024-16-16 10:02:33
updated: 2024-16-16 10:02:33
type:
categories:
- 未来日记
top_img:
cover: 
---

使用以下命令，提交代码到远程仓库时，
```
git push -u origin master
```
遇到如下问题：
```
fatal: unable to access 'https://github.com/xxx/': Failed to connect to github.com port 443: Timed out
```
解决方法：
---
设置代理再取消代理
```
git config --global https.proxy
git config --global --unset https.proxy
```
再次提交
```
git push -u origin master
```