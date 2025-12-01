<template>
  <div class="microbial-page">
    <!-- 页面内容容器 -->
    <div class="page-content">
      <!-- 头部 -->
      <header class="header-section">
        <div class="header-icon">
          <!-- 替换为实际微生物图标路径 -->
          <img src="../assets/homeIMG/earth-icon.png" alt="微生物图标" />
        </div>
      </header>

      <!-- 微生物世界内容 -->
      <section class="microbial-section">
        <h3 class="section-title">微生物世界</h3>
        <p class="section-desc">
          探索看不见的微生物王国，认识我们身体里的小小居民。这里有友善的益生菌朋友，也有调皮的病毒小怪兽，让我们一起开启奇妙的微观之旅吧！
        </p>

        <!-- 微生物分类 -->
        <div class="microbial-categories">
          <div class="category-card">
            <h4>细菌</h4>
            <p>地球上最古老的生物之一，形态多样，无处不在。</p>
          </div>
          <div class="category-card">
            <h4>病毒</h4>
            <p>必须寄生在其他生物体内才能生存的微小生物。</p>
          </div>
          <div class="category-card">
            <h4>真菌</h4>
            <p>包括酵母菌、霉菌和蘑菇等，与人类生活密切相关。</p>
          </div>
          <div class="category-card">
            <h4>原生生物</h4>
            <p>单细胞真核生物，如草履虫、变形虫等。</p>
          </div>
        </div>
      </section>

      <!-- 微生物展示区 -->
      <section class="microbial-showcase">
        <h3 class="section-title">常见微生物</h3>
        <div class="microbes-cards">
          <!-- 这里可以添加微生物卡片，与HomePage.vue类似 -->
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
// 微生物世界页面
</script>

<style scoped>
/* 全局基础样式 */
.microbial-page {
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

/* 微生物世界内容区 */
.microbial-section {
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

/* 微生物分类区 */
.microbial-categories {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
  padding: 0 20px;
}

.category-card {
  background: #fff;
  border-radius: 10px;
  padding: 15px;
  width: 250px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.category-card h4 {
  color: #1d4ed8;
  margin-bottom: 10px;
}

.category-card p {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

/* 微生物展示区 */
.microbial-showcase {
  padding: 20px;
}

.microbes-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px;
  justify-content: center;
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
