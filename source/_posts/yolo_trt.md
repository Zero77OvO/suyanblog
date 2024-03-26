---
title: dgxi截图-yolov8-c++部署-trt
date: 2024-03-25 17:04:20
updated: 2024-03-25 17:04:20
type:
categories:
- 解决方案
- python
top_img:
cover: 
---
很久之前刚接触深度学习跟opencv时候，就萌生了做一个ai自瞄的想法，可惜当时很忙，计划便被搁置了
近日终于有了时间，便将想法变现
网上资料找到的最优解好像是dgxi+yolov5c++部署+trt，但是yoloV8好像也不错，便去git上找到了源码[wang-xinyu/tensorrtx](https://github.com/wang-xinyu/tensorrtx)，可惜后来的部署并不顺利，Cmake的使用，以及lld文件的打包，还有模型转换之间的问题。后来实在没有头绪了，便去git上找到的大佬的整合版本[Monday-Leo/YOLOv8_Tensorrt](https://github.com/Monday-Leo/YOLOv8_Tensorrt)。有了之前部署的经验，配合上整合包部署的很顺利。

效果视频:[强的不是我，是yoloV8](https://www.bilibili.com/video/BV1ux421Q7un)



但这仅仅只是入门，并没有从源码或者是原理上去理解yolo与trt，还有dgxi截图的原理。
包括神经网络的构建，以及算法的实现，工程的构成。真正的内核还没学。

等后面如果有机会的话，再去做吧




用于实战还存在许多问题，比如识别精度不高，存在识别错误的情况。

自带pt->wts->engine //只能预测转官方的训练模型，自己练出来的不能进行.exe预测
后来就用py引导dll
用yolo官方pt转engine 有点问题不排除是模型问题所以 试了试pt官方转onnx，TR官方转engine/trt  还是有问题，应该是神经网络的原因
