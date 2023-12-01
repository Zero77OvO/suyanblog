---
title: 记一次stm32f103t8c6+openmv实现串口通信遇到的问题
date: 2023-12-01 15:20:23
updated: 
type:
categories:
- 解决方案
- stm32
top_img:
cover: 
---
单片机型号： stm32f103t8c6 
相机：OpenMV Cam H7(Stm32H743) OV5640

1.卡中断，stm32死机
---
usart1换到了usart2时候，stm会死机，debug发现卡B. 查了一下说是卡中断了，代码发现usart1没注释，注释完就没出现过卡中断情况了。

2.传参失败
---
代码如下

最开始一直传不进来参数，一直以为是代码问题，找了很久也没发现bug，去看了一下别人代码发现跟自己也是大差不差，debug也没发现什么问题，后来从usart1换到了usart2，自己相机还是废的，但是连了一下别人相机发现可以正常传参，排除软件问题。

<img src="https://s2.loli.net/2023/12/01/PBSwhUuKZsiJ78C.jpg" width="40%" height="40%" />
后来好奇用电表测了一下单片机rt tx引脚，输出3v3，嗯很对。但是openmv上的引脚只有0.3v，压根没输出啊对吧，后来用电表把引脚挨个测了一遍，就b10，b11引脚有输出，去找了一下引脚图发现这就是usart输出引脚，接上成功传参。

<img src="https://s2.loli.net/2023/12/01/iIgNewGqOnF3ZLE.jpg" width="80%" height="80%" />

ps:我都不知道这rx tx引脚标出来干啥的，真是害人不浅啊。

<img src="https://s2.loli.net/2023/12/01/KTru1sCk793FH2L.jpg" width="50%" height="50%" />