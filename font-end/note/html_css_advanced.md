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

***
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

***
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
     |color|颜色选择框。| |
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

 - **multiple**: 布尔属性。允许多选

### option
下拉列表的选项

### optgroup
下拉列表的分组

## textarea
文本域/多行文本框。
可替换元素，但是显示的内容需要写在元素内部

 - **cols**: 列数。表示横向上多少文字
 - **rows**: 行数。纵向上显示多少行
 - **placeholder**: 无内容时的提示文本

## 按钮元素 button

 - **type**: 通常包含三种：
     - **reset**
     - **submit**：默认值
     - **button**

***

# 与表单元素配合的元素
## label
通常配合单选/多选框使用

 - 显式关联：使用**for**属性显式关联特定id的表单元素
     ```html
        <input name="gender" type="radio" id="male">
        <label for="male">男</label>
     ```
 - 隐式关联：将需要关联的内容写在label标签内部
     ```html
        <label>
            <input name="gender" type="radio">女
        </label>
     ```

## datalist
数据列表。该元素本身不会显示在页面上。通常用于和普通文本框配合使用。
自身定义**id**属性，通过**input**元素的**list**属性与之绑定，随后用户在输入时会根据输入的内容给出提示。

```html
<p>
    请输入你喜欢的语言：
    <input type="text" list="lang">
    <datalist id="lang">
        <option value="fontend">HTML+CSS+JavaScript</option>
        <option value="java">Java</option>
        <option value="cplusplus">C++</option>
    </datalist>
</p>
```

## form
通常情况下会将整个表单元素放置到form元素内部，当提交表单时会将form表单内部所有表单元素的内容以合适的方式提交到服务器

 - **action**：提交地址。默认提交至当前页面。
 - **method**: 提交方式。通常为 `GET` 或 `POST`

form表单中的数据相关内容需要添加 `name` 属性

## fieldset
表单分组。将部分表单内容作为一个分组分开显示。

```html
<fieldset>
    <legend>修改密码</legend>
    <p>
        账号：
        <input type="text" readonly>
    </p>
    <p>
        密码：
        <input type="password">
    </p>
    <p>
        新密码：
        <input type="password">
    </p>
    <p>
        新密码确认：
        <input type="password">
    </p>
</fieldset>
```

***
# 表单状态
 - **readonly**: 布尔属性，表示是否只读。不会改变表单显示样式
 - **disabled**: 布尔属性，表示是否禁用。会改变表单显示样式

***

# 美化表单元素

## 新的伪类

1. **focus**：元素聚焦时
