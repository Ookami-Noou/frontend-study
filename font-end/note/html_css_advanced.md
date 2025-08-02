# iframe 元素
用于在一个页面中嵌入另一个页面
属于**可替换元素**：
    - 通常为行盒
    - 通常现实的内容取决于元素的属性
    - css不能完全控制其中的样式
    - 具有行块盒的特点

 - **src**: 嵌入的网页的链接
 - **frameborder**: 元素边框宽度
 - **name**: 
    为当前 iframe 命名，可以使用`a`元素进行关联。如：
    ```html
    <a href="https://www.baidu.com" target="myframe">百度</a>
    <iframe name="myframe" src="https://fanyi.baidu.com/mtpe-individual/multimodal/"></iframe>
    ```

# 资源嵌入元素
## object
用于在页面中显示一个资源

 - **data**: 资源路径
 - **type**: 资源类型的 [MIME](https://baike.baidu.com/item/MIME/2900607) 格式

### param 子元素
设置该object的一些参数

 - **name**: 参数名
 - **value**: 参数值


## embed
在页面中嵌入资源

 - **src**: 资源路径
 - **type**: 资源类型的 [MIME](https://baike.baidu.com/item/MIME/2900607) 格式
 - **quality**: 资源质量。如清晰度

## 兼容性
由于 `object` 与 `embed` 元素都存在兼容性问题，所以可以使用如下写法：
```html
    <object data="./example.swf" type="application/x-shockwave-flash">
        <param name="quality" value="high">
        <embed quality="high" src="./example.swf" type="application/x-shockwave-flash">
    </object>
```
这样如果成功解析了`object`，`embed`元素将无法被嵌入（因为`embed`元素**不能**作为`object`的子元素）；如果无法解析`object`元素，则会按行解析到`embed`元素

# 表单元素
主要用于收集用户数据的一系列元素

## input
**空元素**。主要用于输入

 - **type**: 输入框的类型
     |type|作用|兼容性问题|
     |:--:|:--|:--:|
     |text|普通文本输入框| |
     |password|密码框。把输入的内容替换为特定字符| |
     |data|日期选择框。|存在|
     |search|搜索框。|存在|
     |range|滑块。|存在|
     |color|颜色选择框。|
     |number|数字输入框。只能输入数字。|少量|
     |checkbox|多选框| |
     |radio|单选框| |
     |file|文件选择框。| |
     |reset|重置按钮。把一个区域所有东西还原到最初状态| |
     |button|普通按钮| |
     |submit|提交按钮| |
 - **value**: 输入框的值或按钮的显示内容
 - **placeholder**: *文本框*没有内容时显示的提示文本
 - **min**: 值为数字的输入框，数字的最小值
 - **max**: 值为数字的输入框，数字的最大值
 - **step**: 值为数字的输入框，数字的每一次向上或向下设置时增加或减少的步长
 - **name**: 输入框的名字，浏览器会根据该属性进行分组
 - **checked**: 布尔属性。表示单选框、复选款等默认选中

### 使用input制作按钮
当input值为 `reset`, `submit`, `button` 时，分别表示 【重置按钮】，【提交按钮】，【普通按钮】

## select
表示下拉列表选择框。通常与 `option` 元素配合使用

### option
下拉列表的选项

### optgroup
下拉列表的分组