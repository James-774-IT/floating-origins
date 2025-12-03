import { createRouter, createWebHashHistory } from "vue-router";
import HomePage from "../views/HomePage.vue"; // 导入 HomePage 组件
import MicrobialPage from "../views/MicrobialPage.vue"; // 导入微生物世界组件
import ParentPage from "../views/ParentPage.vue"; // 导入家长专区组件
import JigsawPage from "../views/jigsawPage.vue"; // 导入拼图游戏组件
const routes = [
  {
    path: "/", // 默认路由（主页）
    name: "Home",
    component: HomePage,
  },
  {
    path: "/microbial", // 微生物世界路由
    name: "Microbial",
    component: MicrobialPage,
  },
  {
    path: "/parent", // 家长专区路由
    name: "Parent",
    component: ParentPage,
  },
  {
    path: "/jigsaw", // 拼图游戏路由
    name: "Jigsaw",
    component: JigsawPage,
  },
];

const router = createRouter({
  // 使用hash模式，支持直接打开HTML文件
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
