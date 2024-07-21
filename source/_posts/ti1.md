---
title: msp3507板子跑飞
date: 2024-07-16 
updated: 2024-07-21  
type:
categories:
- 嵌入式
- TI
top_img:
cover: 
---
至今没有解决，具体体现在 **引用变量** 进行 **运算** 时候就会内存跑飞，可能跟extern变量也有关系
等后面有时间了再解决一下

## 7月21日更新
据说是编译器的问题，尽量不要用keil，使用ccs进行工程配置使用，到目前来说没有遇到奇怪的现象

这块板子布局本身也不太合理。。但是必须要用啊- -

## 参考：

[STM32 Keil静态全局变量值被修改](https://blog.csdn.net/xinyz4104/article/details/118611065)
[单片机的变量竟然被无故修改了.](https://blog.csdn.net/phker/article/details/134056670)
[全局变量被未知原因改变的解决方法](https://blog.csdn.net/weixin_47221359/article/details/109390145)
[为什么我的DS18B20总是乱跳呢](https://zhidao.baidu.com/question/397854115.html)
[初始化设置为0 数字会乱跳](https://cn.bing.com/search?pglt=161&q=%E5%88%9D%E5%A7%8B%E5%8C%96%E8%AE%BE%E7%BD%AE%E4%B8%BA0+%E6%95%B0%E5%AD%97%E4%BC%9A%E4%B9%B1%E8%B7%B3&cvid=bb5ef59d9c634b349ac9fbe393e2c7e0&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIGCAEQABhAMgYIAhAAGEAyBggDEAAYQDIGCAQQABhAMgYIBRAAGEAyBggGEAAYQDIGCAcQABhAMgYICBAAGEDSAQkxMDEzOWowajGoAgiwAgE&FORM=ANNTA1&adppc=EDGEESS&PC=ASTS)
[又是一个奇葩问题——stm32 全局变量自己乱变](https://shequ.stmicroelectronics.cn/thread-622719-1-1.html)