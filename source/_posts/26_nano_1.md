---
title: Jetson Nano配置指南
date: 2025-12-25
updated: 2025-12-25
tags:
categories:
- 解决方案
top_img:
comments:
cover: 
---

# 修复因snap版本更新导致浏览器无法正常启动的bug

## 问题 
Jetson Orin Nano刷机后无法打开chrome/firefox浏览器 ubuntu22.04

## 解决

执行以下命令即可（安装Snap 2.68.5并锁定，使其不会被snap或apt更新）
```
snap download snapd --revision=24724
sudo snap ack snapd_24724.assert
sudo snap install snapd_24724.snap
sudo snap refresh --hold snapd

```

安装谷歌浏览器
```
sudo apt update
sudp apt install chromium-browser
```
参考
[Jetson Orin Nano刷机后无法打开chrome/firefox浏览器](https://zhuanlan.zhihu.com/p/1936952595513049503)


# 修复鼠标加速度问题

## 解决

安装gnome-tweaks，在图形化界面调整加速度配置(Acceleration Profile)为flat

```
sudo apt install gnome-tweaks 

```

在 Linux 的输入系统（libinput）中，没有绝对的“关闭加速度”开关。

“平坦”模式 意味着加速度倍数为常数（通常是1），即鼠标光标的移动速度与你的手部物理移动速度严格成正比，这符合大多数人对“无加速”的期望。

“默认”或“自适应”模式则会在你移动更快时，施加一个非线性的加速倍数，导致难以精准控制。

# 安装其他应用

如果有适配的deb文件就直接去官网下载
包括qq vscode miniconda 都是可以装的


# windows跟jetson nano 通过网线实现文件夹共享

首先需要配置网络，保证双方可以ping通，这一部分网上攻略很多，不多赘述

Ubuntu系统，按如下步骤执行：
1.安装samba服务
```
sudo apt update
sudo apt install samba -y
```

2.创建共享目录
```
sudo mkdir -p /home/share  # 路径随意，下面也一样
sudo chmod -R 777 /home/share
```
3.配置samba服务
```
sudo vim /etc/samba/smb.conf
```

```
[sambashare]
   path = /home/share
   browseable = yes
   read only = no
   guest ok = no
   valid users = suyan
```

4.添加 Samba 用户
```
sudo smbpasswd -a name  # 将 'name' 替换为你的用户名,随便起个名字就行
```
系统会提示你设置 Samba 专用密码（可以与系统登录密码不同）。


5.重启samba服务和配置Linux防火墙
```
sudo systemctl restart smbd
sudo systemctl enable smbd # 开机自启
sudo ufw allow samba

```
6.在 Windows 上访问共享
打开文件资源管理器

在地址栏输入：\\192.168.x.x\（将 IP 换成你的 Nano IP）



## 参考

[Windows与Linux通过Samba共享文件夹](https://www.cnblogs.com/linux-wang/p/18817900)
[Jetson Nano教程之文件共享 samba](https://www.bilibili.com/video/BV1ya4y1n7k9)

[Jetson Nano教程之安装Samba服务](https://www.waveshare.net/study/article-1047-1.html)



# 修复unbuntu设置页面为竖屏，但启动页面为横屏

原因是GDM在登陆页面没有跟系统设置同步
下面刚好是把主机设置复制一份给GDM，完美解决问题

```
sudo cp ~/.config/monitors.xml /var/lib/gdm3/.config/monitors.xml
sudo chown gdm:gdm /var/lib/gdm3/.config/monitors.xml

```

<br/>