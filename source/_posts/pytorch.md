---
title: 深度学习环境部署
date: 2024-02-07 19:53:20
updated: 2024-02-07 19:53:20
type:
categories:
- 解决方案
- python
top_img:
cover: 
---
由于种种事故导致anaconda重装好几次了，每次都要翻攻略去配置环境，今天整合一下，找资源也方便

CUDA：

cuddn：
[cudatoolkit](https://developer.nvidia.com/cuda-toolkit-archive)

opencv：
~~~
pip install opencv-python
~~~

pytorch：
[离线pytorch包下载](https://download.pytorch.org/whl/torch/)

pytorch 一键安装：
~~~
pip install torch==2.1.1 torchvision==0.16.1 torchaudio==2.1.1 --index-url https://download.pytorch.org/whl/cu121
~~~
[官方网站](https://pytorch.org/get-started/previous-versions/)
[github](https://github.com/pytorch/vision#installation)