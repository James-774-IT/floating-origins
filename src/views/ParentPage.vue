<template>
  <div class="parent-page">
    <!-- 页面内容容器 -->
    <div class="page-content">
      <!-- 头部 -->
      <header class="header-section">
        <div class="header-icon">
          <!-- 替换为实际家长专区图标路径 -->
          <img src="../assets/homeIMG/earth-icon.png" alt="家长专区图标" />
        </div>
      </header>

      <!-- 家长专区内容 -->
      <section class="parent-section-content">
        <h3 class="section-title">家长专区</h3>
        <p class="section-desc">
          欢迎来到家长专区！这里有丰富的教育资源和亲子活动，帮助您更好地引导孩子了解微生物世界。
        </p>
        
        <!-- 家长专区卡片 -->
        <div class="parent-cards">
          <!-- 教育资源 -->
          <div class="parent-card">
            <h4>教育资源</h4>
            <ul class="resource-list">
              <li>儿童微生物科普手册</li>
              <li>家庭微生物实验指南</li>
              <li>益生菌与健康的关系</li>
              <li>微生物世界相关视频</li>
            </ul>
            <div class="resource-btns">
              <button class="parent-btn">在线查看</button>
              <button class="parent-btn download-btn">立即下载</button>
            </div>
          </div>
          <!-- 亲子活动 -->
          <div class="parent-card">
            <h4>亲子活动</h4>
            <ul class="activity-list">
              <li>制作酸奶观察乳酸菌</li>
              <li>显微镜下的水滴世界</li>
              <li>微生物手抄报比赛</li>
              <li>家庭健康饮食计划</li>
            </ul>
            <button class="parent-btn join-btn">立即参与</button>
          </div>
          <!-- 专家问答 -->
          <div class="parent-card">
            <h4>专家问答</h4>
            <p class="qa-item">
              孩子多大可以开始学习微生物知识？<br />3岁以上的孩子可以通过游戏化的方式接触基础...
            </p>
            <p class="qa-item">
              如何在家进行简单的微生物观察？<br />可以利用放大倍数较高的设备，或制作简易显微镜...
            </p>
            <p class="qa-item">
              益生菌产品适合儿童吗？<br />选择适合儿童的产品，但不宜长期依赖，建议咨询儿科医生。
            </p>
          </div>
        </div>
      </section>

      <!-- 育儿小贴士 -->
      <section class="tips-section">
        <h3 class="section-title">育儿小贴士</h3>
        <div class="tips-content">
          <p>1. 鼓励孩子提问，培养科学探索精神</p>
          <p>2. 利用日常生活中的例子讲解微生物知识</p>
          <p>3. 参与亲子实验，增强孩子的动手能力</p>
          <p>4. 引导孩子养成良好的卫生习惯</p>
        </div>
      </section>

      <!-- 底部版权 -->
      <footer class="footer">
        <div class="footer-logo">微观奇妙世界</div>
        <p>让孩子与科学更贴近</p>
        <p class="copyright">©2023 微观奇妙世界 保留所有权利</p>
      </footer>
    </div>
  </div>
</template>

<script setup>
// 家长专区页面
</script>

<style scoped>
/* 全局基础样式 */
.parent-page {
  background-color: #f0f8ff;
  width: 1440px;
  margin: 0 auto;
  font-family: "微软雅黑", sans-serif;
  color: #333;
  padding: 20px;
  height: auto;
}

/* 页面内容容器 */
.page-content {
  width: 100%;
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 头部区域 */
.header-section {
  padding: 20px 40px;
  background: #e6f7ff;
  border-radius: 10px;
  margin: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  object-fit: cover;
}

.header-icon img {
  width: 256px;
  height: 256px;
  opacity: 1;
}

/* 家长专区内容区 */
.parent-section-content {
  text-align: center;
  padding: 0 20px 20px;
}

.section-title {
  color: #16a34a;
  font-size: 30px;
  font-weight: bold;
  margin: 30px 0 20px;
}

.section-desc {
  max-width: 800px;
  margin: 0 auto 20px;
  line-height: 1.5;
  font-size: 20px;
}

/* 家长专区卡片 */
.parent-cards {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
  padding: 0 20px;
}

.parent-card {
  background: #fff;
  border-radius: 10px;
  padding: 15px;
  width: 300px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.parent-card h4 {
  color: #e91e63;
  margin-bottom: 10px;
}

.resource-list,
.activity-list {
  list-style: none;
  padding: 0;
  margin: 0 0 15px;
  font-size: 14px;
  line-height: 1.8;
}

.resource-btns {
  display: flex;
  gap: 10px;
}

.parent-btn {
  border: none;
  background: #e91e63;
  color: #fff;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
}

.download-btn {
  background: #ff9800;
}

.join-btn {
  width: 100%;
}

.qa-item {
  font-size: 13px;
  margin: 10px 0;
  line-height: 1.5;
}

/* 育儿小贴士区 */
.tips-section {
  background: #fff8e1;
  padding: 20px;
  margin: 30px 20px;
  border-radius: 10px;
}

.tips-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: left;
}

.tips-content p {
  margin: 10px 0;
  font-size: 16px;
  line-height: 1.6;
}

/* 底部 */
.footer {
  background: #2c3e50;
  color: #fff;
  text-align: center;
  padding: 20px;
  margin-top: 30px;
}

.footer-logo {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
}

.copyright {
  font-size: 12px;
  opacity: 0.8;
}
</style>