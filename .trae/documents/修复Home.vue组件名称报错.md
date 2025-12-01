# 修复Home.vue组件名称报错

## 问题分析
通过运行ESLint检查，发现Home.vue报错的原因是违反了`vue/multi-word-component-names`规则，该规则要求Vue组件名称必须使用多个单词，以避免与HTML元素冲突。

## 修复方案
将Home组件重命名为符合规则的多单词名称，推荐使用`HomePage`。

## 修复步骤
1. **重命名组件文件**：将`src/views/Home.vue`重命名为`src/views/HomePage.vue`
2. **更新路由配置**：修改`src/router/index.js`中的导入路径和组件引用
3. **检查其他引用**：确保项目中没有其他文件直接引用Home组件

## 预期结果
修复后，运行`npm run lint`命令将不再出现组件名称相关的错误，项目可以正常构建和运行。