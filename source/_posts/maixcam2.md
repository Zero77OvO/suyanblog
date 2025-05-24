---
title: Maixcam,Trigger signal, code:SIGSEGV(11)! 报错
date: 2025-05-24
updated: 2025-05-24
type:
categories:
- 嵌入式
- maixpy
top_img: 
cover: 
---
1、今天在设计按键功能时，调用Find_rec函数处理图像，出现了出现了Trigger signal, code:SIGSEGV(11)!报错，


代码如下，部分省略
```
def find_rec(img):
    
    
    
    # img = cam.read()
    # img.lens_corr(strength=1.7)
    
    
    img_rec = image.image2cv(img, False, False).copy()
    
    gray_rec = cv2.cvtColor(img_rec, cv2.COLOR_RGB2GRAY)
    
    # 边缘检测
    edges = cv2.Canny(gray_rec, 150, 250)
    kernel = np.ones((4, 4), np.uint8)
    dilated = cv2.dilate(edges, kernel, iterations=1)

    # 轮廓检测
    contours, _ = cv2.findContours(dilated, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if len(contours) > 0:
        # 筛选出最大的轮廓
        largest_contour = max(contours, key=cv2.contourArea)
        
        epsilon = 0.02 * cv2.arcLength(largest_contour, True)
        approx = cv2.approxPolyDP(largest_contour, epsilon, True)
            
            # filtered_approx = remove_duplicate_points(approx)
        num_vertices = len(approx)

                        
    img_show = image.cv2image(img_rec, False, False)

    print("img OK")

    # disp.show(img_show)    
    return img_show

    ```


2、Find_rec 函数单独调用是正常使用的，放在UI里进行按键触发，就会出bug。

一开始以为图像已经被释放或修改，在多个地方print，处理后的图像传递引用img.copy副本，问题也没有解决

```
print("img format:", img.format())
print("img size:", img.width(), img.height())
print("img type:", type(img))
```

```
    if start_press:
        
        infoimg = image.Image(disp.width(), disp.height(), image.Format.FMT_RGB888)
        infoimg.draw_string(
            disp.width() // 2 - 80, disp.height() // 2, "EXITING...", 
            color=iRGB(255, 0, 0), scale=2
        )
        
        # processed_img = infoimg 
        
        processed_img = find_rec(img.copy())  # 传入新拷贝

        if Ex_fun_press:
            start_press = False
        
        if processed_img:
            # 显示前验证
            if processed_img.format() == image.Format.FMT_RGB888:
                print("format success")
                return True, processed_img.copy()
                
        # 失败时返回原始图像
        print("fail")
        return True, img.copy()
```

3、如果不调用Find_rec函数，而是新建一张图片，是可以正常显示的
说明不是外部逻辑问题，是函数内部出了问题

```
def find_rec(img):
    img_rec = image.image2cv(img, False, False).copy()
    img_show = image.cv2image(img_rec, False, False)
    print("img OK")
    return img_show

```

4、后面我删掉多余的处理函数，还是有问题
在 find_rec(img) 的最后，创建一个新的稳定图像对象，并将转换后的图像绘制到这个图像上，问题得到解决


```
def find_rec(img):
    img_rec = image.image2cv(img, False, False).copy()
    img_show = image.cv2image(img_rec, False, False)

   
    stable_img = image.Image(img_show.width(), img_show.height(), image.Format.FMT_RGB888)
    stable_img.draw_image(0, 0, img_show)

    return stable_img
```



**总结：为什么前面都“看着没问题但还是崩溃”**

cv2image() 返回的 image.Image 实际上是 C 层快速构造的临时对象，它不像用 image.Image() 构造的那样“稳定”可控。

所以 只要任何时候用过 cv2image()，在 return 之前必须 draw_image() 到一个新图像中，确保内存托管在 Python 层。





