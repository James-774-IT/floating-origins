<template>
  <div class="app-container">
    <!-- 导航栏组件 -->
    <Navbar />
    <!-- 路由出口：匹配的路由组件会渲染在这里 -->
    <router-view />
    <!-- 全局定时提醒组件 -->
    <TimedReminder />
  </div>
</template>

<script setup>
import Navbar from "./components/NavbarP.vue"; // 导入导航栏组件
import TimedReminder from "./components/TimedReminder.vue"; // 导入定时提醒组件
</script>

<style>
/* 全局样式 */
.app-container {
  min-height: 100vh;
  background-color: #f0f8ff;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
}
</style>
