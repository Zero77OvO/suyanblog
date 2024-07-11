---
title: flask框架下的http图传
date: 2024-07-10
updated: 2024-07-10
type:
categories:
- 嵌入式
- 物联网
- 图传
top_img: 
cover: 
---
## Flask介绍：
Flask是一个使用python编写的轻量化web应用框架，它的作用主要用于开发Web应用程序。Web框架（Flask）致力于如何生成HTML代码，而Web服务器（nginx）用于处理和响应HTTP请求。
Socket则提供了一种网络通信的底层接口，允许开发人员直接访问网络协议栈，它提供了对网络套接字的编程接口，允许应用程序直接发送和接收数据包。

## HTTP图传:
关于实时视频传输，业界已经有非常多成熟方案，分别应用在不同需求场景。
例如RTMP 、RTSP、hls 、FFMPEG 、nginx-rtmp服务器
同时还会涉及到时音视频的底层传输协议问题（TCP，UDP，QUIC）
基本上原理就是有一个中转服务器（比如Nginx），FFMPEGD推流，html拉流。那Django干啥？控制页面拉流。或者说python干啥？拉流。还有一些是用opencv做推流的，

通过 stream 形式，将图片通过 http 协议输出到客户端。只要客户端支持 multipart/x-mixed-replace 头，就可以从响应中读取视频帧，chrome、Firefox 在这一点上有比较好的支持，只要使用 <img /> 标签就可以实现视频流效果：

下面是源码
```
import os
import re
import threading as th
import time

from iot import iRGB,cam
from maix import image,app

from flask import Flask, Response, redirect, url_for
from werkzeug.serving import make_server

flask_app = Flask(__name__)  # Flask app

pause_event = th.Event()
show_fps = False
quality = 70

class Server(object):
    
    def __init__(self) -> None:
        self.image_event = th.Event()
        self.running = False
        self.fpc = FPSCounter()
        flask_app.route("/")(self.http_index)
        flask_app.route("/stream")(self.http_stream)
        flask_app.route("/snapshot")(self.http_snapshot)

    def http_index(self):
        return redirect(url_for("http_stream"))

    def stream_worker(self):
        while self.running:
            while pause_event.is_set():
                time.sleep(1)
            self.img = cam.read()
            if show_fps:
                self.img.draw_string(
                    10, 10, f"{self.fpc.get():.3f}", color=iRGB(255, 0, 0), scale=2
                )
            self.jpg = self.img.to_jpeg(quality)
            if self.jpg is None:
                print("Encoding error!")
                app.set_exit_flag(True)
            self.image_event.set()

    def get_stream(self):
        while self.running:
            self.image_event.wait()
            self.image_event.clear()
            if self.jpg is None:
                continue
            self.fpc.update()
            yield (
                b"Content-Type: data/jpeg\r\n\r\n"
                + self.jpg.to_bytes(False)
                + b"\r\n\r\n--frame\r\n"
            )

    def get_snapshot(self):
        self.image_event.wait()
        self.image_event.clear()
        self.png = self.img.to_format(image.Format.FMT_PNG)
        return self.png.to_bytes()

    def http_stream(self):
        return Response(
            self.get_stream(), mimetype="multipart/x-mixed-replace; boundary=frame"
        )

    def http_snapshot(self):
        return Response(self.get_snapshot(), mimetype="image/png")

    def start_server(self, host, port, block=False):
        """
        Start the server non-blocking
        """
        assert not self.running, "Server already running"
        self.running = True
        self.stream_thread = th.Thread(target=self.stream_worker, daemon=True)
        self.stream_thread.start()
        self.server = make_server(host, port, flask_app, threaded=True, processes=1)
        self.server.log_startup()
        if block:
            self.server.serve_forever()
        else:
            self.server_thread = th.Thread(
                target=self.server.serve_forever, daemon=True
            )
            self.server_thread.start()

    def stop_server(self):
        """
        Stop the server
        """
        assert self.running, "Server not running"
        self.running = False
        self.server.shutdown()
        self.server_thread.join()
        self.stream_thread.join()


def get_ip_list():
    lst = []
    try:
        content = os.popen("ifconfig").read()
        for line in content.splitlines():
            if line.strip().startswith("inet"):
                res = re.search(r"addr:(\d+\.\d+\.\d+\.\d+)", line)
                if res:
                    lst.append(res.group(1))
    except Exception:
        pass
    return lst if lst else ["0.0.0.0"]

```



### 参考文章
[使用 multipart/x-mixed-replace 实现 http 实时视频流](https://segmentfault.com/a/1190000018563132)
[（python）【学习记录】http传输图片](https://blog.csdn.net/zhong1213/article/details/103982782)
[简易HTTP串流服务器2.0](https://maixhub.com/app/19)


[低延迟视频传输 UDP JPEG图像压缩 opencv](https://blog.csdn.net/blgpb/article/details/86642522)
[关于摄像头推流拉流的一些内容](https://www.cnblogs.com/lisicn/p/14582688.html)
[OpenCV Nginx 实现局域网视频推流/拉流](https://sinnammanyo.cn/stack/cv/opencv/apply/opencv-nginx-rtmp-pull-stream)

[TCP实时图像传输](https://blog.csdn.net/qq_42688495/article/details/108279618)


[计算机网络体系结构](https://sinnammanyo.cn/stack/cs/network/computer-network-architecture)
[HTTP 和 TCP 我知道，但是套接字是什么鬼？](https://segmentfault.com/a/1190000044953712)
[HTTP协议格式详解之报头(HTTP header)、请求正文(body)](https://blog.csdn.net/m0_74209411/article/details/137247093)
[HTTP Multipart 概述：一步步理解复杂数据传输](https://xie.infoq.cn/article/acb47cd99090db5779bb2012f)


