# Intent.FLAGS

## 注意事项
1. `Intent` 的优先级高于 AndroidManifest 中的 `launchMode`
2. 从非Activity上下文启动 Activity 时 ***必须*** 使用[FLAG_ACTIVITY_NEW_TASK](#1-flag_activity_new_task)
3. 什么是**任务栈**(Task)
> 任务栈是一组关联的 Activity 的集合（用户视角的**应用**）
4. 什么是**返回栈**(Back Task)
> 返回栈是同一任务栈内的 Activity 导航顺序

## 核心常量

### 1. FLAG_ACTIVITY_NEW_TASK
- 从新任务栈中启动 Activity
- 若任务已存在该 Activity，则直接将其调到前台而非创建新实例。除非配合 [FLAG_ACTIVITY_MULTIPLE_TASK](#6-flag_activity_multiple_task)
> 应用场景：
> 从非Activity上下文（如Service，ApplicationContext）中启动Activity
> 作为任务的根Activity（如从通知启动）

### 2. FLAG_ACTIVITY_SINGLE_TOP
- 若目标 Activity 已位于栈顶，则复用该实例（调用 `onNewIntent()`）
- 等效于在 AndroidManifest 中设置 `launchMode="singleTop"`
> 应用场景：
> 避免重复创建栈顶的 Activity

### 3. FLAG_ACTIVITY_CLEAR_TOP
- 如果目标 Activity 已位于任务栈中，则清除其上所有 Activity ，使其成为栈顶
- 默认调用其 onNewIntent() 方法，而不是销毁并重建它
- 若配合 [FLAG_ACTIVITY_SINGLE_TOP](#3-flag_activity_clear_top)

### 4. FLAG_ACTIVITY_REORDER_TO_FRONT
- 若目标 Acticity 已在任务栈中，则将其移到栈顶（不销毁其他 Activity ）
> 应用场景:
> 复用已存在的 Activity 实例（如从设置页返回时避免重复创建）

***
## 任务栈管理

### 5. FLAG_ACTIVITY_CLEAR_TASK
- 启动前清空整个任务栈（需要与 [FLAG_ACTIVITY_NEW_TASK](#1-flag_activity_new_task)结合）
> 应用场景：
> 重置任务栈（如用户退出登录后跳转到登录页）

### 6. FLAG_ACTIVITY_MULTIPLE_TASK
- 强制创建新任务栈（需要与 [FLAG_ACTIVITY_NEW_TASK](#1-flag_activity_new_task)结合）
- **慎用**。可能造成混乱
> 应用场景：
> 允许多个相同 Activity 实例存在于独立任务栈

### 7. FLAG_ACTIVITY_TASK_ON_HOME
- 新任务栈置于 Home Activity 之上。用户返回时直接回到桌面。
- 新任务栈位于原有任务栈和系统桌面之间。用户点击回退时直接回到系统桌面
> 应用场景：
> 从应用深层页面启动新任务（如分享功能）

***
## 其他
### 8. FLAG_ACTIVITY_NO_HISTORY
- 启动的 Activity 不会被保留在任务栈中（用户离开后自动销毁）
> 应用场景：
> 临时页面（如授权页）

### 9. FLAG_ACTIVITY_EXCLUDE_FROM_RECENTS
- Activity 所在的任务栈不会出现在“最近任务”列表中
> 应用场景：
> 敏感页面（如支付页）

### 10. FLAG_ACTIVITY_NO_ANIMATION
- 禁用 Activity 切换动画
> 应用场景：
> 需要快速无感跳转时。

### 11. FLAG_ACTIVITY_FORWARD_RESULT
- 将 `startActivityForResult()` 的结果传递给下一个 Activity
- A → B → C，C 的结果直接返回给 A
- C 返回后，如果 B 未被销毁，则被带到前台；如果已被销毁，则直接回到 A
- 无论 B 是否被销毁，其都不会收到 C 的结果
- 无论 A 是否位于前台，都会收到来自 C 的返回并开始处理（此时应谨慎更新 UI）


