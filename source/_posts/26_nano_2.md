---
title: Jetson orin nano super 刷机过程记录
date: 2025-12-27
updated: 2025-12-27
tags:
categories:
- 解决方案
top_img:
comments:
cover: 
---

发现自己nano上没有预装CUDA 跟tensorrt，
自行搜索配置完总是遇到很奇怪的问题
后面发现cuda跟tensorrt都是刷系统时候预装的
配环境被折磨两天于是决定刷机，发现网上教程也很少
故记录之
# 1.安装SDK Manager
官网下载SDK[SDK Manager](https://developer.nvidia.com/sdk-manager),现在有win版本的，直接装win主机上，就不用开虚拟机了。
下载完安装好，就可以用SDK进行刷机了

# 2.Nano接线操作顺序
nano关机，先用跳线帽短接3-4引脚(rec,gnd)，让nano进入recover模式。务必保证短接，不然连接会出问题。

![nano1.png](/pic/post/nano1.png)

再通过type-c口连接电脑，nano插电开机，电脑打开sdk应该就能检测到你的nano类型了，检测到什么就选什么，不要乱选。

然后勾选你要下载的插件，选自动安装就可以了。

# 3.系统镜像安装
Jetson Linux是系统镜像
Components里勾选你需要的部件，下载安装即可，这一步应该是全自动的

# 4.系统部件安装
安装完系统镜像后，nano应该是可以正常开机进入系统的，此时使用wifi进行联网，保证主机从机在一个网络下
```
sudu apt-get update #更新一下

```

然后使用
```
ip a  
```
找到nano的ip，在安装部件时候，如图所示，选择Ethernet，把ip换成你通过指令查到的ip
![nano2.png](/pic/post/nano2.png)
![nano3.png](/pic/post/nano3.png)

等待安装完成即可，十分漫长
## 参考

[新手入门Jetson开发第一关：学会刷机](https://cloud.tencent.com/developer/article/2292985)
[Nvidia Jetson orin nano super 版本刷机教学](https://www.bilibili.com/video/BV1g3kmYFEPk)


<br/>