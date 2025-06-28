# WindowManager.LayoutParams.FLAGs

## 基础行为控制

1. `FLAG_NOT_FOCUSABLE` (8)
    - 使窗口不能获得输入焦点，不会接收按键事件
    - 通常用于通知栏、状态栏等不需要交互的窗口

2. `FLAG_NOT_TOUCHABLE` (16)
    - 窗口不接收任何触摸事件
    - 触摸事件会直接穿透到下层窗口

3. `FLAG_NOT_TOUCH_MODAL` (32)
    - 非触摸模态窗口，允许触摸事件传递到其他窗口
    - 通常与 `FLAG_NOT_FOCUSABLE` 一起使用

4. `FLAG_TOUCHABLE_WHEN_WAKING` (64)
    - 设备唤醒时窗口可触摸
    - 已启用。Android 5.0+ 使用 `FLAG_DISMISS_KEYGUARD` 代替

## 窗口显示特性类

5. `FLAG_DIM_BEHIND` (2)
    - 窗口后面的内容会变暗
    - 常用于对话框，突出显示当前窗口

6. `FLAG_BLUR_BEHIND` (4)
    - 窗口后面的内容会模糊
    - 部分设备可能不支持
    - 已弃用。建议使用 `RenderScript` 或自定义实现

7. `FLAG_DITHER` (4096)
    - 启用颜色抖动，改善低色彩深度设备的显示效果
    - 现代设备通常不需要

8. `FLAG_SECURE` (8192)
    - 防止窗口内容被截图或录屏
    - 常用于支付、密码等敏感界面

9. `FLAG_SCALED` (16384)
    - 窗口会根据像素密度自动缩放
    - 通常用于兼容旧应用

## 屏幕与电源管理类

10. `FLAG_KEEP_SCREEN_ON` (128)
    - 保持屏幕常亮，直到窗口关闭

11. `FLAG_TURN_SCREEN_ON` (2097152)
    - 窗口显示时自动点亮屏幕
    - 需要 `WAKE_LOCK` 权限

12. `FLAG_ALLOW_LOCK_WHILE_SCREEN_ON` (1)
    - 允许屏幕亮起时锁定设备
    - 不常用

## 布局与位置控制类

13. `FLAG_LAUOUT_IN_SCREEN` (256)
    - 窗口坐标相对于整个屏幕，而非应用区域
    
14. `FLAG_LAYOUT_NO_LIMITS` (512)
    - 允许窗口超出屏幕边界
    - 常用于特殊效果的悬浮窗

15. `FLAG_LAYOUT_INSET_DECOR` (65536)
    - 窗口内容会避开系统装饰区域（状态栏、导航栏）

16. `FLAG_LAYOUT_IN_OVERSCAN` (33554432)
    - 允许内容延伸到屏幕的 *overscan* 区域
    - 电视设备常用

17. `FLAG_LAYOUT_ATTACHED_IN_DECOR` (1073741824)
    - 窗口附加到 *decor view*, 影响系统栏颜色处理

## 输入法相关

18. `FLAG_ALT_FOCUSABLE_IM` (131072)
    - 窗口不会自动显示输入法
    - 需要手动请求显示输入法

## 安全与锁屏相关

19. `FLAG_SHOW_WHEN_LOCK` (524288)
    - 窗口可以在锁屏上显示
    - 常用于来电界面、闹钟等

20. `FLAG_DISMISS_KEYGUARD` (4194304)
    - 窗口显示时自动解除键盘锁
    - 需要 `DISABLE_KEYGUARD` 权限

## 系统栏相关

21. `FLAG_TRANSLUCENT_STATUS` (67108864)
    - 状态栏半透明，内容可延伸到状态栏下
    - 需要配合 `View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN` 使用

22. `FLAG_TRANSLUCENT_NAVIGATION` (134217728)
    - 导航栏半透明，内容可延伸到导航栏下
    - 需要配合 `View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION` 使用

23. `FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS` (Integer.MIN_VALUE)
    - 窗口负责绘制系统蓝背景
    - 通常与 `FLAG_TRANSLUCENT_STATUS` 或 `FLAG_TRANSLUCENT_NAVIGATION` 一起使用

## 其他特性

24. `FLAG_IGNORE_CHEEK_PRESSES` (23768)
    - 忽略脸颊触控（防止打电话时误触）

25. `FLAG_FULLSCREEN` (1024)
    - 全屏显示，隐藏状态栏
    - 已弃用。建议使用 `WindowManager.LayoutParams.FLAG_FULLSCREEN`

26. `FLAG_FORCE_NOT_FULLSCREEN` (2048)
    - 强制不全屏。即使请求了全屏

27. `FLAG_HARDWARE_ACCELERATED` (16777216)
    - 启用硬件加速渲染

28. `FLAG_LOCAL_FOCUS_MODE` (268435456)
    - 本地焦点模式。窗口仅接收本地输入事件

29. `FLAG_SPLIT_TOUCH` (8388608)
    - 启用[多点触控](./多点触控.md#多点触控multi-touch)[事件分割](./多点触控.md#两种多点触控事件分发模式)

30. `FLAG_WATCH_OUTSIDE_TOUCH` (262144)
    - 即使触摸事件发生在窗口外也能收到 `MotionEvent.ACTION_OUTSIDE`

