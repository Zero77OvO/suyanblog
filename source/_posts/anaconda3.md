---
title: 解决Anaconda Navigator打不开
date: 2023-12-25 10:20:23
updated: 
type:
categories:
- 解决方案
- python
top_img:
cover: 
---
python：3.11.5
Anaconda Navigator：2.5.1

今早上突然发现Anaconda Navigator打不开了，网上找了一圈也没解决，最后用cmd启动时候发现报了这么一行错误
ImportError: cannot import name 'Callable' from 'collections' (E:\tools\anaconda3\Lib\collections\__init__.py)
然后就去手动import一下
解决了

 