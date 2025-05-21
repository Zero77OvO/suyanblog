---
title: mqtt及阿里云物联网学习
date: 2024-05-31 16:02:33
updated: 2024-06-11 16:47:33
type:
categories:
- 嵌入式
- 物联网
- 图传
top_img: 
cover: /pic/post/qrs.jpg
---
最近在准备嵌入式大赛的项目，需要用到多端的数据传输。本地可以使用usart传参，云端与设备之间则利用阿里云平台借助mqtt协议进行收发数据。
因为我们的项目还涉及图像传输，所以我们没有使用资料更多的esp8266模块而是选用自带摄像头的esp32-cam。


1.mqtt物联网通讯
---
esp32-cam端部署(c/c++)：

通过使用[aliyunmqtt库](https://blog.csdn.net/qq_43064082/article/details/105999645)，订阅目标产品设备的topic，从而接受来自目标产品设备发布的内容。同时通过topic可以发送json格式的信息，云端在接收以后通过格式解析出信息，从而达到收发的目的。
多个设备之间的传输则需要使用云产品流转，云产品流转类型的规则可以对设备上报的数据进行简单处理，并将处理后的数据流转到其他 Topic 或阿里云产品。
发送端则需要通过处理数据topic发送信息，而接收端则需要订阅转发数据topic从而接收发送信息。
<!-- ![1.png](/pic/post/qrs.jpg) -->
概念理解：
产品：
设备：
topic订阅：
产品云流转：

maixcam端(python):
---
1.阿里云物联网平台提供的python sdk 第三方库 aliyun-iot-linkkit，可惜由于不明原因，本地部署一直无法跟云端连接，即使是用官方例程也不行，遂放弃。
[阿里云Python Link SDK](https://help.aliyun.com/zh/iot/developer-reference/python-link-sdk-1)

刚才才看到，官方要求1.61，可能是paho-mqtt版本问题，当时没注意装的最新的2.10。

2.后来用paho-mqtt，版本是1.61，内容比阿里云官方的更简洁，配置完三个参数即可使用，[Paho-MQTT Python接入示例](https://help.aliyun.com/zh/iot/use-cases/use-the-paho-mqtt-library-for-python-to-connect-a-device-to-iot-platform)



上位机(微信小程序)：
---
我们的重点并不在前端上，所以为了节约开发时间与成本，我们选择了微信小程序作为我们的上位机。
mqtt部署资料参考[微信小程序使用MQTT.js连接阿里云IoT物联网平台](https://blog.csdn.net/ngl272/article/details/87887885)。

2.图传

最开始是espcam做图传，因为自带摄像头，价格相对也比较亲民，资料相对也多，开发(抄)的成本会低很多。
包括图传，esp跟微信小程序都有例程可以直接用。

功能都实现之后，感觉ov2640的摄像头太糊了，打算转用maixcam，这时候我才发现图传涉及的知识太多了。
flask，flv，rtmp，http流，以及图像数据的解析与发送，与上位机之间的交换等等。
图传内容太多了，挖个坑后面填


等后面都做完了，会把代码开源学习。

参考文章：
---
[ESP32 arduino方式连接阿里云](https://blog.csdn.net/qq_43064082/article/details/105999645)
[【3.微信小程序部分(已更完)】毕设：STM32+ESP8266-01S+阿里云+微信小程序 实现智能家居](www.bilibili.com/video/BV1EC411z71i)
[微信小程序使用MQTT.js连接阿里云IoT物联网平台](https://blog.csdn.net/ngl272/article/details/87887885)