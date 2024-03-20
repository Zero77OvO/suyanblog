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
[cudatoolkit](https://developer.nvidia.com/cuda-toolkit-archive) 直接装
CUdnn：
[cudnn](https://developer.nvidia.com/rdp/cudnn-archive) 库函数，复制丢"/CUDA/v12.2/"就行
tensorRT:
[tensorRT](https://developer.nvidia.com/tensorrt) 同上，只丢include跟bin，然后配环境
python参考：[TensorRT安装记录（8.2.5）](https://blog.csdn.net/qq_37541097/article/details/114847600)
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

labelimg标签重置问题
打开\venv\Lib\site-packages\labelImg\labelImg.py 文件
在labelimg文件1252行 self.default_save_dir = dir_path 下面加入以下代码
~~~
        if dir_path is not None and len(dir_path) > 1:
            self.default_save_dir = dir_path
        
        # 加入以下代码
        files = os.listdir(dir_path)
        # 判断是否存在名为 class.txt 的文件
        if "classes.txt" in files:
            self.label_hist.clear()  # 不清空继续打开其他标注文件不会删除原来的
            with open(dir_path + "/classes.txt", 'r') as f:
                for line in f.readlines():
                    line = line.strip()
                    if self.label_hist is None:
                        self.label_hist = [line]
                    else:
                        self.label_hist.append(line)

~~~
然后每次打开记得重新选一下文件夹