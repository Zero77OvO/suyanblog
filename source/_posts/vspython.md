---
title: python在vs中与cmd调用的版本不一致
date: 2024-01-07 14:14:12
updated: 2024-01-07 14:14:12
tags:
categories:
- python
- 解决方法
top_img: 
cover: 
---
python在vs中与cmd调用的版本不一致

现象：在anaconda配的环境里通过cmd装tensorflow-gpu时，终端显示配置成功了，但是在vs里不能正常运行，检查版本号也不一样。查阅资料后发现vs默认运行powershell终端，改成cmd后执行正常了。

python环境是用anaconda配置的

vs默认终端使用powershell，所以问题应该是Powershell(ps)与Command prompt (cmd)输入python调用的版本不一致的问题了。

目测ps调用python路径是按环境配置路径来的，而cmd则是按anaconda配置来的，所以出现了在两个终端python调用版本不一致的情况。

测试后发现，在cmd中使用conda activate指令是可以正常切py环境的，但是ps还是调用默认base环境(本机为3.11.5)。

参考[Powershell中激活Anaconda环境无效的解决办法](https://blog.csdn.net/weixin_43681778/article/details/109206108)后解决




