---
title: 解决Anaconda Navigator打不开
date: 2023-12-25 10:20:23
updated: 2023-12-25 10:20:23
type:
categories:
- 解决方案
- python
top_img:
cover: 
---
省流：用cmd启动，根据提示的报错信息进行修改，每个人环境都不一样，网上攻略也不一定都适合你


win11
python：3.11.5
Anaconda Navigator：2.5.1

今早上突然发现Anaconda Navigator打不开了，网上找了一圈也没解决，最后用cmd启动时候发现报了这么一行错误
```
ImportError: cannot import name 'Callable' from 'collections' (E:\tools\anaconda3\Lib\collections\__init__.py)
```
<img src="https://www.freeimg.cn/i/2024/01/07/659a466300a28.png" width="100%" height="80%" /><br/>
然后就去手动import一下
解决了
<img src="https://www.freeimg.cn/i/2024/01/07/659a4663200a7.png" width="80%" height="80%" /><br/>
