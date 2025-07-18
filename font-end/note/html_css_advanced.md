# iframe 元素
用于在一个页面中嵌入另一个页面
属于**可替换元素**：
    - 通常为行盒
    - 通常现实的内容取决于元素的属性
    - css不能完全控制其中的样式
    - 具有行块盒的特点

## 属性
 - **src**: 嵌入的网页的链接
 - **frameborder**: 元素边框宽度
 - **name**: 
    为当前 iframe 命名，可以使用`a`元素进行关联。如：
    ```html
    <a href="https://www.baidu.com" target="myframe">百度</a>
    <iframe name="myframe" src="https://github.com/"></iframe>
    ```