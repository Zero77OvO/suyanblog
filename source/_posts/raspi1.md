---
title: 树莓派部署onnx模型实现数字识别
date: 2024-01-20 11:55:21
updated: 2024-01-20 11:55:21
type:
categories:
- 嵌入式
- 树莓派
top_img:
cover: https://www.freeimg.cn/i/2024/01/20/65ab3b9572bff.png
---
模型：yolov5-lite
python：3.7.10

电脑跑的pt然后转onnx

树莓派部署只需要安装opencv+onnxruntime即可
安装之前记得换源
~~~
pip config set global.index-url https://pypi.mirrors.ustc.edu.cn/simple/
pip config set install.trusted-host  https://pypi.mirrors.ustc.edu.cn/

pip install opencv-python
pip install onnxruntime
~~~

然后就能愉快的跑模型啦
虽然帧数不高，但是目前来看还够用
![yololite1.png](https://www.freeimg.cn/i/2024/01/20/65ab3b9572bff.png)