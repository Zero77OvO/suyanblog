---
title: [yolov8]解决Try using the full path with constructor syntax.
date: 2024-03-20 20:44:20
updated: 2024-03-20 20:44:20
type:
categories:
- 解决方案
- python
top_img:
cover: 
---
win11/Python3.10.13

今天在用python调用一个c++的dll库，尝试过以下方法
```
os.add_dll_directory("xxx.dll")

dll = ctypes.CDLL("xxx.dll", winmode=0)
```
无果之后，参考以下博客解决
[FileNotFoundError: Could not find module 'xxx.dll'. Try using the full path with constructor syntax. 调用ctypes库中dll报错问题解决、以及winerr 126找不到指定模块](https://www.cnblogs.com/weixinyu98/p/17610972.html)
还有一个找DLL的网站[DLLME](https://www.dllme.com/)
有个软件找文件的，叫everything也好用


