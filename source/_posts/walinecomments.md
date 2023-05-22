---
title: Vercel部署Waline，评论出现Fail to fetch的解决方案
date: 2023-05-22 21:42
updated: 2023-05-22 21:53
tags:
categories:
keywords:
description:
top_img:
comments:
cover: https://s2.loli.net/2023/05/18/JrO5VLgUToZMh2F.jpg
---
配置好Waline后，出现了本地评论正常，服务器上显示Fail to fetch的情况，F12控制台出现了如下情况。<br/>
![img](/pic/comment mistakes/mis1.png)<br/>
看了看应该是服务器端口跨域问题，网上一搜已经有解决方案了，下面是参考文章。<br/>
[好像终于懂了http-proxy-middleware为何能解决跨域问题](https://juejin.cn/post/6993644913900388359)<br/>
[react-解决 fetch 跨域问题](https://blog.csdn.net/qq_41956139/article/details/106564357)<br/>