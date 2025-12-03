<template>
  <div class="home-page">
    <!-- 页面内容容器 -->
    <div class="page-content">
      <!-- 头部 -->
      <header class="header-section">
        <div class="header-icon">
          <!-- 替换为实际地球图标路径 -->
          <img class="rotate-image" src="../assets/homeIMG/earth-icon.png" alt="地球图标" />
        </div>
      </header>

      <!-- 欢迎语+搜索区 -->
      <section class="welcome-section">
        <h3 class="welcome-title">欢迎来到微观奇妙世界！</h3>
        <p class="welcome-desc">
          探索看不见的微生物王国，认识我们身体里的小小居民。这里有友善的益生菌朋友，也有调皮的病毒小怪兽，让我们一起开启奇妙的微观之旅吧！
        </p>
        <div class="search-box">
          <input
            type="text"
            v-model="searchText"
            placeholder="搜索微生物.."
            @keyup.enter="search"
          />
          <button class="search-btn" @click="search">
            <!-- 搜索图标 -->
            <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M512 9.55733333C234.56426667 9.55733333 9.55733333 234.56426667 9.55733333 512s225.00693333 502.44266667 502.44266667 502.44266667 502.44266667-225.00693333 502.44266667-502.44266667S789.43573333 9.55733333 512 9.55733333zM785.06666667 785.06666667c-7.64586667 7.64586667-16.93013333 10.92266667-26.76053334 10.92266666s-19.11466667-3.82293333-26.76053333-10.92266666l-144.72533333-144.72533334c-37.13706667 26.2144-82.46613333 42.05226667-131.61813334 42.05226667-125.06453333 0-227.19146667-102.12693333-227.19146666-227.19146667C228.01066667 330.1376 330.1376 228.01066667 455.20213333 228.01066667s227.19146667 102.12693333 227.19146667 227.19146666c0 49.152-15.83786667 94.48106667-42.05226667 131.61813334l144.72533334 144.72533333C799.81226667 746.2912 799.81226667 770.32106667 785.06666667 785.06666667z"
                fill="#facc15"
              ></path>
              <path
                d="M455.20213333 455.20213333m-151.27893333 0a29.54666667 29.54666667 0 1 0 302.55786667 0 29.54666667 29.54666667 0 1 0-302.55786667 0Z"
                fill="#facc15"
              ></path>
            </svg>
          </button>
          <!-- 语音图标 -->
          <div class="voice-container">
            <button class="voice-btn" @click="toggleVoiceRecognition">
              <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M510.727448 0c-281.748961 0-510.723192 228.974231-510.723192 510.723192s228.974231 510.723192 510.723192 510.723192 510.723192-228.974231 510.723192-510.723192-228.123026-510.723192-510.723192-510.723192zM407.731604 354.952618c0-57.030756 46.816293-103.847049 103.847049-103.847049 57.030756 0 103.847049 46.816293 103.847049 103.847049v172.79468c0 58.733167-45.113882 103.847049-103.847049 103.847049-57.030756 0-103.847049-46.816293-103.847049-103.847049V354.952618z m120.871156 344.738155v36.601829h86.822942c10.214464 0 17.024106 6.809643 17.024107 17.024106s-6.809643 17.024106-17.024107 17.024107H406.880399c-10.214464 0-17.024106-6.809643-17.024106-17.024107s6.809643-17.024106 17.024106-17.024106h86.822943v-36.601829c-86.822943-8.512053-155.770574-81.715711-155.770574-171.092269 0-10.214464 6.809643-17.024106 17.024106-17.024107s17.024106 6.809643 17.024107 17.024107c0 76.608479 62.137988 138.746467 138.746467 138.746467s138.746467-62.137988 138.746467-138.746467c0-10.214464 6.809643-17.024106 17.024107-17.024107s17.024106 6.809643 17.024106 17.024107c0.851205 90.227764-68.096426 162.580216-154.919368 171.092269z"
                  :fill="isRecognizing ? '#ff4d4f' : '#facc15'"
                ></path>
              </svg>
            </button>
            <!-- 语音识别波浪线 -->
            <div class="voice-wave" v-if="isRecognizing">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </section>

      <!-- 互动体验区 -->
      <section class="interactive-section">
        <h3 class="section-title">互动体验区</h3>
        <div class="interactive-cards">
          <!-- 微生物大作战 -->
          <div class="interactive-card">
            <!-- 游戏封面图路径 -->
            <img src="../assets/homeIMG/IMG@pintu.png" alt="微生物大作战" />
            <p>微生物大作战</p>
            <p class="card-desc">帮助益生菌打败有害病菌，完成健康挑战！</p>
            <button class="card-btn game-btn" @click="router.push('/jigsaw')">开始游戏</button>
          </div>
          <!-- 小小实验室 -->
          <div class="interactive-card">
            <!-- 实验室封面图路径 -->
            <img src="../assets/homeIMG/IMG@shiyan.png" alt="小小实验室" />
            <p>小小实验室</p>
            <p class="card-desc">使用虚拟显微镜观察各种微生物标本</p>
            <button class="card-btn lab-btn">进入实验室</button>
          </div>
        </div>
      </section>

      <!-- 认识微生物朋友 -->
      <section class="microbes-section">
        <h3 class="section-title">认识微生物朋友</h3>
        <div class="microbes-cards">
          <!-- 循环渲染微生物卡片 -->
          <div class="microbe-card" v-for="(item, idx) in microbes" :key="idx">
            <!-- 微生物图标路径 -->
            <div class="microbe-card-color"><img :src="item.img" :alt="item.name" /></div>
            <h4>{{ item.name }}</h4>
            <span class="microbe-tag" :style="{ background: item.tagBg }">{{ item.tag }}</span>
            <p class="microbe-desc">{{ item.desc }}</p>
            <button class="more-btn">了解更多</button>
          </div>
        </div>
      </section>

      <!-- 家长专区 -->
      <section class="parent-section">
        <h3 class="section-title">家长专区</h3>
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

      <!-- 底部版权 -->
      <footer class="footer">
        <div class="footer-logo">微观奇妙世界</div>
        <p>让孩子与科学更贴近</p>
        <p class="copyright">©2025 微观奇妙世界 保留所有权利</p>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

// 创建router实例
const router = useRouter();

// 搜索文本
const searchText = ref("");
// 语音识别状态
const isRecognizing = ref(false);
// 语音识别实例
let recognition = null;

// 初始化语音识别
const initRecognition = () => {
  if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "zh-CN";

    // 识别结果事件
    recognition.onresult = (event) => {
      const result = event.results[0][0].transcript;
      searchText.value = result;
      isRecognizing.value = false;
    };

    // 识别结束事件
    recognition.onend = () => {
      isRecognizing.value = false;
    };

    // 识别错误事件
    recognition.onerror = (event) => {
      console.error("语音识别错误:", event.error);
      isRecognizing.value = false;
    };
  } else {
    alert("您的浏览器不支持语音识别功能");
  }
};

// 切换语音识别状态
const toggleVoiceRecognition = () => {
  if (!recognition) {
    initRecognition();
  }

  if (isRecognizing.value) {
    // 停止识别
    recognition.stop();
    isRecognizing.value = false;
  } else {
    // 开始识别
    recognition.start();
    isRecognizing.value = true;
  }
};

// 百度搜索功能
const search = () => {
  if (searchText.value.trim()) {
    // 百度搜索URL格式
    const baiduUrl = `https://www.baidu.com/s?wd=${encodeURIComponent(searchText.value.trim())}`;
    // 打开新标签页进行搜索
    window.open(baiduUrl, "_blank");
    // 清空输入框
    searchText.value = "";
  }
};

// 微生物数据（使用new URL生成正确的图片URL）
const microbes = ref([
  {
    name: "乳酸菌",
    tag: "有益菌",
    tagBg: "#4CAF50",
    desc: "肠道里的好朋友，帮助消化食物，增强免疫力。",
    img: new URL("../assets/homeIMG/IMG@rsj.png", import.meta.url).href,
  },
  {
    name: "大肠杆菌",
    tag: "条件致病菌",
    tagBg: "#FFC107",
    desc: "大部分是无害的，但有些种类会引起腹泻。",
    img: new URL("../assets/homeIMG/IMG@dcgj.png", import.meta.url).href,
  },
  {
    name: "流感病毒",
    tag: "病毒",
    tagBg: "#F44336",
    desc: "引起感冒和流感的小坏蛋，要注意防护哦！",
    img: new URL("../assets/homeIMG/IMG@lgbd.png", import.meta.url).href,
  },
  {
    name: "酵母菌",
    tag: "真菌",
    tagBg: "#FF9800",
    desc: "让面包变得松软香甜的小魔法师！",
    img: new URL("../assets/homeIMG/IMG@jmj.png", import.meta.url).href,
  },
  {
    name: "链球菌",
    tag: "病菌",
    tagBg: "#F44336",
    desc: "有些种类会引起咽喉炎，要注意口腔卫生哦！",
    img: new URL("../assets/homeIMG/IMG@lqj.png", import.meta.url).href,
  },
  {
    name: "噬菌体",
    tag: "病毒",
    tagBg: "#F44336",
    desc: "专门吃细菌的病毒，是细菌的天敌哦！",
    img: new URL("../assets/homeIMG/IMG@sjt.png", import.meta.url).href,
  },
]);
</script>

<style scoped>
/* 全局基础样式 */
.home-page {
  background-color: #f0f8ff;
  /* width: 1440px; */
  width: 100%;
  margin: 0 auto;
  min-height: 100vh;
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
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  object-fit: cover;
}

.header-icon img {
  width: 256px;
  height: 256px;
  opacity: 1;
}

/* 欢迎区 */
.welcome-section {
  text-align: center;
  padding: 0 20px 20px;
}
.welcome-title {
  color: #1d4ed8;
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 10px;
}
.welcome-desc {
  max-width: 800px;
  margin: 0 auto 20px;
  line-height: 1.5;
  font-size: 20px;
}
.search-box {
  display: flex;
  align-items: center;
  max-width: 500px;
  max-height: 45px;
  margin: 0 auto;
  background: #fff;
  border-radius: 20px;
  padding: 5px 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border: 1px solid #fde047;
}
.search-box input {
  flex: 1;
  border: none;
  outline: none;
  padding: 8px;
  border-radius: 20px;
  font-size: 16px;
}
.search-btn {
  background: none; /* 去掉按钮背景 */
  border: none; /* 去掉边框 */
  cursor: pointer; /* 鼠标悬浮显示手型 */
  width: 40px; /* SVG图标大小 */
  height: 40px;
  padding: 5px;
  border-radius: 50%;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6), -1px -1px 2px rgba(255, 255, 255, 0.2);
  transition: all 0.2s ease;
}
/* 悬浮修改SVG颜色 */
.search-btn:hover svg path {
  fill: #facc15c7; /* 悬浮时颜色加深 */
}
/* .search-btn:hover {
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.4), -0.5px -0.5px 1px rgba(255, 255, 255, 0.1);
  transform: translateY(1px);
} */
.search-btn:active {
  box-shadow: inset 1px 1px 2px rgba(0, 0, 0, 0.6), inset -1px -1px 2px rgba(255, 255, 255, 0.2);
  transform: translateY(2px);
}

.voice-btn {
  background: none; /* 去掉按钮背景 */
  border: none; /* 去掉边框 */
  cursor: pointer; /* 鼠标悬浮显示手型 */
  width: 40px; /* SVG图标大小 */
  height: 40px;
  padding: 5px;
  position: relative;
  z-index: 10;
  border-radius: 50%;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6), -1px -1px 2px rgba(255, 255, 255, 0.2);
  transition: all 0.2s ease;
  margin-left: 5px;
}
/* 悬浮修改SVG颜色 */
.voice-btn:hover svg path {
  fill: #facc15c7; /* 悬浮时颜色加深 */
}
/* .voice-btn:hover {
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.4), -0.5px -0.5px 1px rgba(255, 255, 255, 0.1);
  transform: translateY(1px);
} */
.voice-btn:active {
  box-shadow: inset 1px 1px 2px rgba(0, 0, 0, 0.6), inset -1px -1px 2px rgba(255, 255, 255, 0.2);
  transform: translateY(2px);
}

/* 语音容器 */
.voice-container {
  position: relative;
  display: flex;
  align-items: center;
}

/* 语音波浪线 */
.voice-wave {
  position: absolute;
  right: 5px;
  /* top: 40%; */
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 3px;
  height: 40px;
}

.voice-wave span {
  display: inline-block;
  width: 3px;
  height: 10px;
  background: #4a90e2;
  border-radius: 3px;
  animation: wave 1s ease-in-out infinite;
}

/* 波浪线动画 */
@keyframes wave {
  0%,
  100% {
    height: 10px;
    opacity: 0.5;
  }
  50% {
    height: 30px;
    opacity: 1;
  }
}

/* 为每个波浪线设置不同的动画延迟 */
.voice-wave span:nth-child(1) {
  animation-delay: 0s;
}

.voice-wave span:nth-child(2) {
  animation-delay: 0.1s;
}

.voice-wave span:nth-child(3) {
  animation-delay: 0.2s;
}

.voice-wave span:nth-child(4) {
  animation-delay: 0.3s;
}

.voice-wave span:nth-child(5) {
  animation-delay: 0.4s;
}

/* 互动体验区 */
.section-title {
  text-align: center;
  color: #16a34a;
  font-size: 30px;
  font-weight: bold;
  margin: 30px 0 20px;
}
.interactive-cards {
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
  padding: 0 20px;
}
.interactive-card {
  background: #fff;
  border-radius: 10px;
  padding: 15px;
  width: 300px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-size: 24px;
}
.interactive-card img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 10px;
}
.card-desc {
  font-size: 16px;
  color: #666;
  margin: 10px 0;
  text-align: left; /* 强制左对齐 */
}
.card-btn {
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  color: #fff;
  cursor: pointer;
  font-size: 16px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6), -1px -1px 2px rgba(255, 255, 255, 0.2);
  transition: all 0.2s ease;
  /* display: block; 转为块级元素，独占一行
  text-align: left; 按钮内部文字左对齐（若按钮有文字） */
}
.game-btn {
  background: #fb923c;
}
.lab-btn {
  background: #9c27b0;
}
.card-btn:hover {
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.4), -0.5px -0.5px 1px rgba(255, 255, 255, 0.1);
  transform: translateY(1px);
}
.card-btn:active {
  box-shadow: inset 1px 1px 2px rgba(0, 0, 0, 0.6), inset -1px -1px 2px rgba(255, 255, 255, 0.2);
  transform: translateY(2px);
}

/* 微生物卡片区 */
.microbes-cards {
  width: 1152px;
  height: 776px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  padding: 0 20px;
  max-width: 1200px;
  margin: 0 auto;

  display: flex; /* 启用Flex布局 */
  flex-wrap: wrap; /* 超出宽度自动换行（可选，防止卡片挤在一起） */
  gap: 20px; /* 卡片之间的间距 */
  padding: 20px;
}
.microbe-card {
  background: #fff;
  border-radius: 10px;
  padding: 15px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  width: calc(33.33% - 20px); /* 三列布局，减去gap的宽度 */
  /* min-width: 200px; 防止卡片过窄（适配小屏幕） */
}
.microbe-card-color {
  background-color: #effbf6;
}
.microbe-card img {
  width: 160px;
  height: 160px;
  margin-top: 8px;
}
.microbe-tag {
  display: inline-block;
  color: #fff;
  font-size: 12px;
  padding: 3px 8px;
  border-radius: 4px;
  margin: 5px 0;
}
.microbe-desc {
  font-size: 13px;
  color: #666;
  margin: 10px 0;
}
.more-btn {
  border: 1px solid #18e370;
  color: #fff;
  background-color: #4ade80;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6), -1px -1px 2px rgba(255, 255, 255, 0.2);
  transition: all 0.2s ease;
}
.more-btn:hover {
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.4), -0.5px -0.5px 1px rgba(255, 255, 255, 0.1);
  transform: translateY(1px);
}
.more-btn:active {
  box-shadow: inset 1px 1px 2px rgba(0, 0, 0, 0.6), inset -1px -1px 2px rgba(255, 255, 255, 0.2);
  transform: translateY(2px);
}

/* 家长专区 */
.parent-section {
  background: #fff8e1;
  padding: 20px;
  margin: 30px 20px;
  border-radius: 10px;
}
.parent-cards {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
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
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6), -1px -1px 2px rgba(255, 255, 255, 0.2);
  transition: all 0.2s ease;
}
.download-btn {
  background: #ff9800;
}
.join-btn {
  width: 100%;
}
.parent-btn:hover {
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.4), -0.5px -0.5px 1px rgba(255, 255, 255, 0.1);
  transform: translateY(1px);
}
.parent-btn:active {
  box-shadow: inset 1px 1px 2px rgba(0, 0, 0, 0.6), inset -1px -1px 2px rgba(255, 255, 255, 0.2);
  transform: translateY(2px);
}
.qa-item {
  font-size: 13px;
  margin: 10px 0;
  line-height: 1.5;
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
