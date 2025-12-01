import "./assets/main.css";

import { createApp } from "vue"; // 导入 Vue 应用创建函数
import App from "./App.vue"; // 导入 App 组件
import router from "./router"; // 导入路由
// import { Particle } from "jparticles";
// 导入 Particle 插件
// import ElementPlus from "element-plus";
// import "element-plus/dist/index.css";
// import zhCn from "element-plus/es/locale/lang/zh-cn";

const app = createApp(App); // 创建 Vue 应用实例
app.use(router); // 注册路由
// app.use(Particle);
// 注册 Particle 插件
app.mount("#app"); // 挂载应用到 #app 元素

// app.use(ElementPlus, { size: "small", zIndex: 3000 });
// app.use(ElementPlus, {
//   locale: zhCn,
// });
