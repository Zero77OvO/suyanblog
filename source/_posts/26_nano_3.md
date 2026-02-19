---
title: Jetson orin nano super YoloV8 (py）部署过程
date: 2025-12-29
updated: 2025-12-29
tags:
categories:
- 解决方案
top_img:
comments:
cover: 
---
据说在V8以上版本，就自带tensorrt加速了，于是选择了yolov8。
有c++跟python两个版本，先装个python的试试水

建议在miniconda环境下配置，比较方便。

环境 
JetPack 6.2
python 3.10
torch 2.20

# 1.安装ultralytics
```
pip install --upgrade pip
pip install ultralytics
```
# 2.安装gpu版本的torch
安装好后，自带的torch是cpu版本的，建议是换成gpu
运行
```
pip uninstall -y torch torchvision
```
卸载torch


由于pytorch官网提供的linux torch架构是X86的，jetson nano为arrch64，所以不能从pytorch官网下载
在[动物园](https://elinux.org/Jetson_Zoo)可以找到wheel文件，但是[在这](https://developer.download.nvidia.com/compute/redist/jp/)我只找到了torch，没有torchvision

最后在[这里](https://docs.ultralytics.com/guides/nvidia-jetson/)找到了线索
```
pip install https://github.com/ultralytics/assets/releases/download/v0.0.0/torch-2.5.0a0+872d972e41.nv24.08-cp310-cp310-linux_aarch64.whl
pip install https://github.com/ultralytics/assets/releases/download/v0.0.0/torchvision-0.20.0a0+afc54f7-cp310-cp310-linux_aarch64.whl
```
这样就算是装完了
# 3.配置环境变量
因为在conda环境下，默认是读不到系统自带的cuda跟tensorrt路径的，我们需要自己配置一下。
注意在运行一些pip install时候，不要安装上cuda 跟tensorrt了，pip安装的是用不了的
我们只需要配置一下环境变量就行

```
#找路径
find /usr -name "tensorrt" -type d 2>/dev/null
ls -la /usr/local/cuda

```
```
#cuda环境变量

vim ~/.bashrc   #把下面的几行导入保存，
                #请把路径替换成自己的，直接复制粘贴可能不太好用
```
```
export LD_LIBRARY_PATH=/usr/lib/aarch64-linux-gnu:$LD_LIBRARY_PATH
export CUDA_HOME=/usr/local/cuda-12.6
export PATH=/usr/local/cuda-12.6/bin:$PATH
```
```
#tensorrt环境变量
mkdir -p $CONDA_PREFIX/etc/conda/activate.d
vim $CONDA_PREFIX/etc/conda/activate.d/tensorrt.sh
export PYTHONPATH=/usr/lib/python3.10/dist-packages:$PYTHONPATH
export LD_LIBRARY_PATH=/usr/lib/aarch64-linux-gnu:/usr/local/cuda/lib64:$LD_LIBRARY_PATH
```
```
#检测是否正常
python - << 'EOF'
import tensorrt as trt
import pycuda.driver as cuda
print(trt.__version__)
EOF
```


# 4.下载yolo模型,并进行格式转换
去[这个地方](https://github.com/ultralytics/assets/releases/)就可以下到yolo的模型了
```
wget https://github.com/ultralytics/assets/releases/download/v0.0.0/yolov8n.pt
```
分别执行下面代码即可实现格式转换
```
#pt转onnx
yolo export model=yolov8n.pt format=onnx device=cpu
```
```
#onnx转engine
/usr/src/tensorrt/bin/trtexec \
  --onnx=yolov8n.onnx \
  --saveEngine=yolov8n.engine \
  --fp16
```

# 5.实现模型推理

下面是例程

```
from ultralytics import YOLO
import cv2
import time

model = YOLO("yolov8n.engine", task="detect")

cap = cv2.VideoCapture("Delta.mp4")

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    t0 = time.time()

    results = model(frame)   # TensorRT engine 推理

    fps = 1.0 / (time.time() - t0)

    annotated = results[0].plot()
    cv2.putText(
        annotated,
        f"FPS: {int(fps)}",
        (30, 50),
        cv2.FONT_HERSHEY_SIMPLEX,
        1,
        (0, 255, 0),
        2
    )

    cv2.imshow("YOLOv8 TensorRT", annotated)
    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()
```

# 参考
[Quick Start Guide: NVIDIA Jetson with Ultralytics YOLO11](https://docs.ultralytics.com/guides/nvidia-jetson/)
[Ultralytics YOLO Docs](https://docs.ultralytics.com/usage/python/)
[Jetson Zoo](https://elinux.org/Jetson_Zoo#PyTorch_.28Caffe2.29)
[Installing PyTorch for Jetson Platform](https://docs.nvidia.com/deeplearning/frameworks/install-pytorch-jetson-platform/index.html#install-multiple-versions-pytorch)
[nvidia pytorch download ](https://developer.download.nvidia.com/compute/redist/jp/)
[Jetson nano部署YOLOV8并利用TensorRT加速推理实现行人检测追踪](https://zhuanlan.zhihu.com/p/665546297)





<!-- yolo export model=yolov8n.pt format=engine device=0
yolo predict model=yolov8n.engine source=images/ device=0 -->
<br/>