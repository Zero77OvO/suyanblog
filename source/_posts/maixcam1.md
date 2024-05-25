---
title: Maixcam本地部署训练
date: 2024-05-25
updated: 2024-05-25
type:
categories:
- 嵌入式
- maixpy
top_img: https://www.freeimg.cn/i/2024/05/25/6651b876660c7.jpg
cover: https://www.freeimg.cn/i/2024/05/25/6651b876660c7.jpg
---

1.YOLOv5本地部署训练
---
环境配置
anaconda python 3.8.19
cuda：12.4
显卡：3060 laptop 6g
驱动版本551.76

```
git clone https://github.com/ultralytics/yolov5
cd yolov5
pip install -r requirements.txt
pip install onnx
```
安装完成后，建议删除cpu版本的pytorch，使用gpu版本,训练会快一点
以下为GPU版本的pytorch安装，安装前请检查cuda版本
```
pip install torch==2.1.1 torchvision==0.16.1 torchaudio==2.1.1 --index-url https://download.pytorch.org/whl/cu121
```
装完运行train.py即可
训练参数没动过，有需求的话可以调
使用export.py将.pt文件转为.onnx
图像尺寸改为224 320 没试过其他尺寸，有兴趣可以试试

通过网址输入 netron.app 查看.onnx模型的三个输出
这里可能每个模型都不一样，后面模型量化时候需要用
![cam1.png](https://www.freeimg.cn/i/2024/05/25/66519ecc6a0ed.png)
```
/model.24/m.0/Conv_output_0
/model.24/m.1/Conv_output_0
/model.24/m.2/Conv_output_0 
```

2.Docker环境配置
---

接下来就需要在docker容器里进行操作了


TPU-MLIR需要在Docker环境开发，可以直接下载docker镜像(速度比较慢),参考如下命令：
```
docker pull sophgo/tpuc_dev:latest
```
或者可以从【TPU工具链工具包】中下载的docker镜像(速度比较快)，然后进行加载docker
```
docker load -i  docker_tpuc_dev_v3.2.tar.gz
```
离线包下载地址，可以用[winscp](https://winscp.net/eng/index.php)下载
```
sftp://218.17.249.213
username: cvitek_mlir_2023
password: 7&2Wd%cu5k
```
如果是首次使用Docker，可以执行下述命令进行安装和配置（仅首次执行）：
```
sudo apt install docker.io
sudo systemctl start docker
sudo systemctl enable docker
sudo groupadd docker
sudo usermod -aG docker $USER
newgrp docker
```
【进入docker环境】 确保安装包在当前目录，然后在当前目录创建容器如下：
```
docker run --privileged --name MYNAME -v $PWD:/workspace -it sophgo/tpuc_dev:latest
```
![cam6.png](https://www.freeimg.cn/i/2024/05/25/6651bc4ac27f8.png)
MYNAME 是容器名字，自己自定义就可以

3.TPU-MLIR量化环境搭建
---
```
https://github.com/sophgo/tpu-mlir/releases/tag/v1.7
上面网址下载
tpu-mlir-resource.tar 和 tpu_mlir-1.7-py3-none-any.whl 
```
放在你进容器时候所在的文件夹
```
pip install tpu_mlir-1.7-py3-none-any.whl
安装它的全部依赖
pip install tpu_mlir-1.7-py3-none-any.whl[all] 
```
再新建一个文件夹用来存放测试图片和onnx模型
![cam2.png](https://www.freeimg.cn/i/2024/05/25/6651b0d1664c6.png)

然后就可以开始量化模型了

```
执行下面命令ONNX 转 MLIR（记得output_names换为自己模型的输出，文件位置也需要根据自己情况来）
model_transform \
--model_name yolov5s \
--model_def num1.onnx \
--input_shapes [[1,3,224,320]] \
--mean 0.0,0.0,0.0 \
--scale 0.0039216,0.0039216,0.0039216 \
--keep_aspect_ratio \
--pixel_format rgb \
--output_names /model.24/m.0/Conv_output_0,/model.24/m.1/Conv_output_0,/model.24/m.2/Conv_output_0 \
--test_input images/num.png \
--test_result yolov5s_top_outputs.npz \
--mlir yolov5s.mlir

执行下面命令MLIR 转 INT8 模型，转 INT8 模型前需要跑 calibration, 得到校准表
run_calibration.py yolov5s.mlir \
    --dataset images \
    --input_num 100 \
    -o yolov5s_cali_table

接着执行下面
model_deploy \
--mlir yolov5s.mlir \
--quantize INT8 \
--calibration_table yolov5s_cali_table \
--processor cv181x \
--test_input yolov5s_in_f32.npz \
--test_reference yolov5s_top_outputs.npz \
--tolerance 0.85,0.45 \
--model yolov5s_cv181x_int8_sym.cvimodel
```
![cam5.jpg](https://www.freeimg.cn/i/2024/05/25/6651bc4aec3e8.jpg)

**yolov5s_cv181x_int8_sym.cvimodel**

这是我们需要的模型

4.模型测试
---

yolov5s_num1.mud内容如下，各位别忘了改label跟model名字
```
[basic]
[basic]
type = cvimodel
model = yolov5s_num1_cv181x_int8_sym.cvimodel

[extra]
model_type = yolov5
input_type = rgb
mean = 0, 0, 0
scale = 0.00392156862745098, 0.00392156862745098, 0.00392156862745098
anchors = 10,13, 16,30, 33,23, 30,61, 62,45, 59,119, 116,90, 156,198, 373,326
labels = one,two,three,four,five,six,seven,eight,nine,zero
```

运行代码
```
from maix import camera, display, image, nn, app

detector = nn.YOLOv5(model="/root/models/yolov5s_num1.mud")
cam = camera.Camera(detector.input_width(), detector.input_height(), detector.input_format())
dis = display.Display()
print("www")
print(detector.input_width(),detector.input_height(), detector.input_format())

while not app.need_exit():
    img = cam.read()
    objs = detector.detect(img, conf_th = 0.5, iou_th = 0.45)
    for obj in objs:
        img.draw_rect(obj.x, obj.y, obj.w, obj.h, color = image.COLOR_RED)
        msg = f'{detector.labels[obj.class_id]}: {obj.score:.2f}'
        img.draw_string(obj.x, obj.y, msg, color = image.COLOR_RED)
    dis.show(img)
```
连接cam跟电脑，把cvmodel和mud上传到/root/models/ 路径下
![cam3.png](https://www.freeimg.cn/i/2024/05/25/6651b8269c579.png)
实机运行如图
![cam4.jpg](https://www.freeimg.cn/i/2024/05/25/6651b876660c7.jpg)
感觉可玩性很高啊，等期末考完猛猛把玩一手


参考资料：
[MaixPy 自定义（离线训练） AI 模型和运行](https://wiki.sipeed.com/maixpy/doc/zh/vision/custmize_model.html)
[CV18xx芯片使用指南](https://tpumlir.org/docs/quick_start/09_cv18xx_guide.html#yolov5)
[yolov5编译ONNX模型](https://tpumlir.org/docs/quick_start/03_onnx.html)
[通用yolov5模型部署](https://doc.sophgo.com/cvitek-develop-docs/master/docs_latest_release/CV180x_CV181x/zh/01.software/TPU/YOLO_Development_Guide/build/html/3_Yolov5_development.html)
[利用tpu-mlir工具将深度学习算法模型转成算能科技平台.bmodel模型的方法步骤](https://blog.csdn.net/u013171226/article/details/135816063)
[量化与量化调优](https://doc.sophgo.com/sdk-docs/v23.09.01-lts/docs_latest_release/docs/tpu-mlir/quick_start/html/07_quantization.html)
[Yolov5 Detection On Milk-v Duo](https://forum.sophgo.com/t/yolov5-detection-on-milk-v-duo/246)
[CV181x/180x ISP 调试经验总结](https://forum.sophgo.com/t/cv181x-180x-isp/297)
