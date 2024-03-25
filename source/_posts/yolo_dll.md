---
title: 【yolov8】Try using the full path with constructor syntax.
date: 2024-03-20 20:44:20
updated: 2024-03-20 20:44:20
type:
categories:
- 解决方案
- python
top_img:
cover: 
---
环境：
win11/Python3.10.13

今天在用python调用一个c++的dll库，尝试过以下方法
```
os.add_dll_directory("xxx.dll")

dll = ctypes.CDLL("xxx.dll", winmode=0)
```
无果，参考以下博客解决

使用开发者命令工具 Developer CMD Prompt for vs
```
dumpbin /DEPENDENTS D:\sofeware\anaconda\envs\python38\Lib\site-packages\PySmartCard\ReaderLib_64.dll
```
会显示缺少的dll文件，去C:\Windows\System32 目录下找找，没有就去下一个

[FileNotFoundError: Could not find module 'xxx.dll'. Try using the full path with constructor syntax. 调用ctypes库中dll报错问题解决、以及winerr 126找不到指定模块](https://www.cnblogs.com/weixinyu98/p/17610972.html)
还有一个找DLL的网站[DLLME](https://www.dllme.com/)
有个软件找文件的，叫[everything](https://www.voidtools.com/zh-cn/support/everything/)也好用


