---
title: 关于py控制台输入与直接赋值，导致执行结果不一致的
date: 2024-10-06 20:33:20
updated: 2024-10-06 20:33:20
type:
categories:
- 解决方案
- python
top_img:
cover: 
---
RT


涉案代码
```

#这是一个用于显示菜单，并进行选择的代码

def choose(
        title: str,
        options: tuple | list,
        console: "ColorfulConsole",
        separate=None) -> str:
    screen = f"{title}:\n"
    row = 0
    for i, j in enumerate(options, start=1):
        screen += f"{i: >2d}. {j}\n"
        if separate and row in separate:
            screen += f"{'=' * 25}\n"
        row += 1
    return console.input(screen)

```

```
#  这是菜单选择功能代码

    def run(self, default_mode: list):
        self.default_mode = default_mode
        with suppress(ValueError):
            while self.running:
                if not (select := safe_pop(self.default_mode)):


                    select = choose(
                        "请选择采集功能",
                        [i for i, _ in self.__function],
                        self.console)

                    # select=5
                    # print(select)



                if select in {"Q", "q"}:
                    self.running = False
                elif not select:
                    break
                elif (n := int(select) - 1) in range(len(self.__function)):
                    self.__function[n][1](safe_pop(self.default_mode))

```

当我在控制台输入数字时，功能是可以正常调用的，但是在直接给 select变量赋值时功能执行不正常。

后来发现是 整数与字符串的原因

在使用 `choose()` 函数时，用户通过控制台进行输入，返回值是一个字符串。例如，如果用户输入 `5`，`select` 就是字符串 `"5"`。之后，代码会将 `select` 转换为整数并进行判断。

直接赋值的是一个整数，而不是字符串。如果不再通过控制台输入，代码依然会执行 `int(select)` 转换，但是这里的 `select` 已经是整数了，继续转换时会报错，因为 `int()` 函数需要处理字符串，而非整数。**这是为什么功能无法正常执行的原因**。

### 解决方案

1.如果直接赋值给 `select`，应该确保跳过 `int()` 转换部分，或者直接处理整数。

2.即使手动赋值给 `select`，确保它是字符串形式：

```python
select = "5"
```
