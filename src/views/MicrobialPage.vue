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

        <!-- 微生物科普视频区 -->
        <div class="video-player-container">
          <!-- 视频播放区域 -->
          <div class="video-wrapper">
            <video
              ref="videoPlayer"
              class="video-element"
              :poster="currentVideo.poster"
              controlsList="nodownload"
              preload="metadata"
            >
              您的浏览器不支持HTML5视频播放
            </video>

            <!-- 播放按钮覆盖层 -->
            <!-- <div class="video-overlay" @click="togglePlay">
              <div class="play-button"></div>
            </div> -->

            <!-- 视频加载状态 -->
            <div class="video-loading" v-if="isLoading">
              <div class="loading-spinner"></div>
            </div>

            <!-- 视频错误提示 -->
            <div class="video-error" v-if="hasError">
              <p>{{ errorMessage }}</p>
              <button @click="reloadVideo">重新加载</button>
            </div>
          </div>

          <!-- 视频控制栏 -->
          <div
            class="video-controls"
            :class="{ 'ui-hidden': !uiVisible }"
            v-show="uiVisible || !isFullscreen"
          >
            <!-- 播放/暂停按钮 -->
            <button class="control-btn play-btn" @click="togglePlay">
              <svg
                v-if="!isPlaying"
                viewBox="0 0 1024 1024"
                xmlns="http://www.w3.org/2000/svg"
                width="35"
                height="35"
              >
                <path
                  d="M930.925 518.775c0 210.246-170.428 380.646-380.659 380.646-210.232 0-380.688-170.4-380.688-380.646 0-210.245 170.456-380.659 380.688-380.659 210.231 0 380.659 170.414 380.659 380.659"
                  fill="#F7E946"
                ></path>
                <path
                  d="M513.888 73.273c-39.473 0-78.641 5.234-116.4 15.537a28.424 28.424 0 0 0-3.553 1.237c-0.729 0.136-1.458 0.292-2.186 0.487-33.977 9.295-72.846 25.719-103.7 42.872-13.645 7.61-18.562 24.833-10.966 38.478 5.193 9.294 14.806 14.529 24.75 14.529 4.64 0 9.363-1.146 13.728-3.563 26.876-14.957 61.493-29.656 91.104-37.749a28.49 28.49 0 0 0 3.497-1.211 28.407 28.407 0 0 0 2.242-0.499c32.897-8.991 67.039-13.548 101.484-13.548 211.861 0 384.223 172.348 384.223 384.196 0 211.859-172.361 384.223-384.223 384.223-211.834 0-384.168-172.363-384.168-384.223 0-57.358 12.32-112.519 36.6-163.952 6.657-14.115 0.635-30.978-13.507-37.648-14.143-6.671-30.992-0.635-37.648 13.507-27.873 59.029-42.016 122.325-42.016 188.094 0 243.06 197.719 440.792 440.738 440.792 243.046 0 440.793-197.732 440.793-440.792 0.001-243.034-197.746-440.767-440.792-440.767z"
                  fill="#213847"
                ></path>
                <path
                  d="M167.092 295.079a28.099 28.099 0 0 1-16.491-5.331c-12.678-9.129-15.551-26.794-6.436-39.472a442.718 442.718 0 0 1 68.972-75.574c11.712-10.233 29.666-8.99 39.887 2.804 10.247 11.794 8.977 29.652-2.818 39.9a387.472 387.472 0 0 0-60.133 65.906c-5.524 7.679-14.197 11.767-22.981 11.767zM392.019 696.373a28.196 28.196 0 0 1-13.645-3.509 28.287 28.287 0 0 1-14.64-24.776V359.991a28.288 28.288 0 0 1 14.64-24.777 28.239 28.239 0 0 1 28.754 0.87l243.765 154.063a28.275 28.275 0 0 1 13.176 23.907 28.255 28.255 0 0 1-13.176 23.906L407.128 691.994a28.279 28.279 0 0 1-15.109 4.379z m28.284-285.047v205.425l162.53-102.698-162.53-102.727z"
                  fill="#213847"
                ></path>
              </svg>
              <svg
                v-else
                viewBox="0 0 1024 1024"
                xmlns="http://www.w3.org/2000/svg"
                width="35"
                height="35"
              >
                <path
                  d="M512 0a512 512 0 1 0 512 512A513.536 513.536 0 0 0 512 0m-51.2 716.8H358.4V307.2h102.4z m204.8 0h-102.4V307.2h102.4z"
                  fill="#f5e965"
                ></path>
              </svg>
            </button>

            <!-- 进度条 -->
            <div class="progress-container">
              <input
                type="range"
                class="progress-slider"
                min="0"
                max="100"
                step="0.1"
                :value="progress"
                @input="seekVideoBySlider"
                @click="seekVideoByClick"
              />
              <div class="time-display">
                <span>{{ currentTime }}</span> <span>{{ duration }}</span>
              </div>
            </div>

            <!-- 音量控制 -->
            <div class="volume-container">
              <button class="control-btn volume-btn" @click="toggleMute">
                <svg
                  v-if="volume === 0 || isMuted"
                  viewBox="0 0 1024 1024"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                >
                  <path
                    d="M452.676893 78.69327c-15.654538-6.361895-34.744315-2.402723-46.544059 9.712199L205.211778 293.863864l-98.367355 0c-22.948665 0-41.554418 18.20871-41.554418 41.160445l0 353.999476c0 22.951735 18.605753 41.160445 41.554418 41.160445l98.367355 0L405.009244 935.642626c7.978718 8.198729 18.783809 12.670577 29.786397 12.670577 5.259794 0 12.812817-0.948605 17.881253-3.00852 15.663748-6.367011 28.157293-21.542642 28.157293-38.452777L480.834186 117.196189C480.834186 100.286054 468.340641 85.060281 452.676893 78.69327zM397.72535 804.584732 254.775614 659.84114c-7.822153-8.037047-20.807908-12.765745-32.024367-12.765745l-74.353428 0L148.397818 376.972701l74.353428 0c11.215436 0 24.201192-4.728698 32.024367-12.765745l142.949736-144.743592L397.72535 804.584732zM946.930717 636.423801c16.008602 16.447601 15.653515 42.762943-0.785899 58.774615-8.080026 7.864108-18.540262 11.780301-28.984125 11.780301-10.824533 0-21.635763-4.200672-29.78128-12.567223L767.838829 571.611679 648.299269 694.411493c-8.146541 8.365528-18.960841 12.567223-29.78128 12.567223-10.44898 0-20.904099-3.916193-28.984125-11.780301-16.439414-16.011672-16.795525-42.327014-0.785899-58.774615l121.091916-124.397195L588.746942 387.630435c-16.008602-16.447601-15.653515-42.762943 0.785899-58.774615 16.45988-16.011672 42.761919-15.646352 58.765405 0.785899l119.53956 122.800837 119.540583-122.800837c16.013719-16.45374 42.314735-16.793478 58.765405-0.785899 16.440437 16.011672 16.795525 42.327014 0.785899 58.774615L825.837778 512.026606 946.930717 636.423801z"
                    fill="#f5e965"
                  ></path>
                </svg>
                <svg
                  v-else-if="volume < 0.6"
                  viewBox="0 0 1024 1024"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                >
                  <path
                    d="M594.089623 68.470441c-15.912411-6.580882-33.207309-2.719948-45.369304 9.460466L339.53095 288.667515 235.458663 288.667515c-23.49511 0-42.538839 18.643616-42.538839 42.142819L192.919824 693.241854c0 23.49818 19.043728 42.142819 42.538839 42.142819l104.072287 0 210.193233 210.736609c8.143471 8.154727 19.033495 12.588713 30.116925 12.588713 5.473665 0 8.993838-1.00284 14.249539-3.179412 15.908318-6.585999 24.273846-22.056342 24.273846-39.269375L618.364493 107.790982C618.36347 90.577948 609.997941 75.05644 594.089623 68.470441zM533.275559 813.425074 385.275807 662.97962c-7.982812-7.994068-16.805758-12.684904-28.102035-12.684904l-79.165014 0 0-276.538267 79.165014 0c11.295254 0 20.119223-4.690836 28.102035-12.684904l147.999752-150.445454L533.275559 813.425074zM759.790526 692.192965c-8.403391 9.379625-20.026102 14.153348-31.702026 14.153348-10.111289 0-20.2543-3.583618-28.377304-10.860349-17.501606-15.687284-18.972097-42.587957-3.292999-60.086493 109.297288-121.970936 4.517897-241.702877 0-246.741637-15.679098-17.499559-14.208607-44.400233 3.292999-60.081377 17.48728-15.691377 44.404326-14.21577 60.074214 3.287883C815.626205 394.174478 887.488907 549.679158 759.790526 692.192965z"
                    fill="#f5e965"
                  ></path>
                </svg>
                <svg
                  v-else
                  viewBox="0 0 1024 1024"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                >
                  <path
                    d="M508.068458 68.448952c-15.960507-6.565533-33.750685-2.663666-45.892213 9.56382l-208.498638 210.654744L150.309354 288.667515c-23.503297 0-42.402739 18.642592-42.402739 42.141796L107.906615 693.241854c0 23.49818 18.899442 42.141796 42.402739 42.141796l103.369276 0 209.027687 210.654744c8.151657 8.206916 19.082614 12.671601 30.211069 12.671601 5.455245 0 9.903557-0.997724 15.151072-3.158946 15.939017-6.569626 25.281803-22.049179 25.281803-39.289841L533.350261 107.788935C533.351284 90.549296 524.007475 75.018577 508.068458 68.448952zM448.26235 813.019845 300.55424 663.061484c-7.990998-8.045233-17.817808-12.767791-29.15911-12.767791l-78.399581 0L192.995549 373.755426l78.399581 0c11.341303 0 21.168112-4.722558 29.15911-12.767791L448.26235 211.029274 448.26235 813.019845zM672.196539 692.103938c-8.410554 9.432837-20.074198 14.242376-31.79003 14.242376-10.07445 0-20.189831-3.553942-28.299533-10.783601-17.550725-15.639189-19.098987-42.534745-3.460822-60.07626 105.97666-118.880551 11.050684-234.291071-0.124843-247.058862-15.425318-17.629519-13.767562-44.48312 3.792373-59.987233 17.58654-15.510252 44.295855-13.963013 59.881832 3.505847C727.72011 394.229736 799.178605 549.661761 672.196539 692.103938zM800.394293 805.935496c-8.4126 9.431813-20.075221 14.242376-31.791054 14.242376-10.07445 0-20.189831-3.553942-28.299533-10.783601-17.550725-15.639189-19.097964-42.534745-3.459798-60.07626 208.05043-233.387491 8.526187-464.919728-0.067538-474.664673-15.523555-17.59268-13.912871-44.467771 3.641947-60.030212 17.567098-15.551184 44.3593-14.023388 59.977 3.490497C803.01191 221.048465 1059.402301 515.38612 800.394293 805.935496z"
                    fill="#f5e965"
                  ></path>
                </svg>
              </button>
              <div class="volume-slider-container">
                <input
                  type="range"
                  class="volume-slider"
                  min="0"
                  max="1"
                  step="0.01"
                  v-model="volume"
                  @input="updateVolume"
                />
              </div>
            </div>

            <!-- 全屏按钮 -->
            <button class="control-btn fullscreen-btn" @click="toggleFullscreen">
              <svg
                v-if="!isFullscreen"
                viewBox="0 0 1024 1024"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
              >
                <path
                  d="M229.8 163l55.7-55.7c6-6 2.4-16.2-6-17.2l-203.2-24c-6.5-0.8-12 4.7-11.3 11.3l24 203.2c1 8.4 11.3 11.9 17.2 6l55.4-55.4 169.6 169.4c3.9 3.9 10.4 3.9 14.3 0l53.8-53.6c3.9-3.9 3.9-10.4 0-14.3L229.8 163z m447.3 237.6c3.9 3.9 10.4 3.9 14.3 0L861 231.1l55.4 55.4c6 6 16.2 2.4 17.2-6l24-203c0.8-6.5-4.7-12-11.3-11.3l-203.2 24c-8.4 1-11.9 11.3-6 17.2l55.7 55.7-169.5 169.4c-3.9 3.9-3.9 10.4 0 14.3l53.8 53.8z m256.6 343.9c-1-8.4-11.3-11.9-17.2-6L861 794 691.4 624.5c-3.9-3.9-10.4-3.9-14.3 0l-53.8 53.6c-3.9 3.9-3.9 10.4 0 14.3L792.9 862l-55.7 55.7c-6 6-2.4 16.2 6 17.2l203.2 24c6.5 0.8 12-4.7 11.3-11.3l-24-203.1z m-588.1-120c-3.9-3.9-10.4-3.9-14.3 0L161.7 794l-55.4-55.4c-6-6-16.2-2.4-17.2 6l-24 203c-0.8 6.5 4.7 12.1 11.3 11.3l203.2-24c8.4-1 11.9-11.3 6-17.2l-55.7-55.5 169.6-169.4c3.9-3.9 3.9-10.4 0-14.3l-53.9-54z m0 0"
                  fill="#f5e965"
                ></path>
              </svg>
              <svg
                v-else
                viewBox="0 0 1024 1024"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
              >
                <path
                  d="M366.2 181.8c-1-8-10.8-11.4-16.5-5.7l-53.1 53.1L134.2 67c-3.8-3.8-10-3.8-13.7 0L69 118.3c-3.8 3.8-3.8 10 0 13.7l162.4 162.4-53.3 53.3c-5.7 5.7-2.3 15.5 5.7 16.5l194.6 23c6.2 0.7 11.5-4.5 10.8-10.8l-23-194.6z m12.3 453.3l-194.7 23c-8 1-11.4 10.8-5.7 16.5l53.3 53.3L69 890.1c-3.8 3.8-3.8 10 0 13.7l51.5 51.4c3.8 3.8 10 3.8 13.7 0l162.4-162.3 53.1 53.1c5.7 5.7 15.5 2.3 16.5-5.7l23-194.4c0.7-6.3-4.5-11.5-10.7-10.8z m269.4-248l194.7-23c8-1 11.4-10.8 5.7-16.5L795 294.4l162.4-162.3c3.8-3.8 3.8-10 0-13.7L905.9 67c-3.8-3.8-10-3.8-13.7 0L729.7 229.2l-53.1-53.1c-5.7-5.7-15.6-2.3-16.5 5.7l-23 194.5c-0.6 6.3 4.6 11.5 10.8 10.8zM795 727.8l53.3-53.3c5.7-5.7 2.3-15.5-5.7-16.5L648 635c-6.2-0.7-11.5 4.5-10.8 10.8l23 194.6c1 8 10.8 11.4 16.5 5.7l53.1-53.1 162.4 162.3c3.8 3.8 10 3.8 13.7 0l51.5-51.4c3.8-3.8 3.8-10 0-13.7L795 727.8z m0 0"
                  fill="#f5e965"
                ></path>
              </svg>
            </button>
          </div>

          <!-- 视频选集列表 -->
          <div class="video-playlist">
            <h4 class="playlist-title">视频选集</h4>
            <div class="playlist-items">
              <div
                v-for="(video, index) in videoList"
                :key="index"
                class="playlist-item"
                :class="{ active: currentVideoIndex === index }"
                @click="selectVideo(index)"
              >
                <div class="playlist-item-thumbnail">
                  <img :src="video.thumbnail" :alt="video.title" />
                  <span class="video-duration">{{ video.duration }}</span>
                </div>
                <div class="playlist-item-info">
                  <h5 class="video-title">{{ video.title }}</h5>
                  <!-- <p class="video-desc">{{ video.description }}</p> -->
                </div>
              </div>
              <div>
                <h1>
                  <p>更多内容敬请期待！😘</p>
                  <p>❗如有问题，请联系我们！联系时间：10:00-17:00</p>
                  <p>📮邮箱：yi774yi@163.com</p>
                </h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 微生物展示区 -->
      <section class="microbial-showcase">
        <h3 class="section-title">微生物大全</h3>
        <div class="microbes-cards">
          <!-- 这里可以添加微生物卡片，与HomePage.vue类似 -->
          <h2>
            <p>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;该版块还在开发中...🐼</p>
            <p>我们会在后续更新中添加更多的微生物内容，敬请期待！</p>
          </h2>
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
import { ref, onMounted, onUnmounted, computed } from "vue";

// 视频播放器引用
const videoPlayer = ref(null);

// 视频状态
const isPlaying = ref(false);
const isLoading = ref(false);
const hasError = ref(false);
const errorMessage = ref("");
const isFullscreen = ref(false);
const currentVideoIndex = ref(0);
const uiVisible = ref(true);

// UI自动隐藏定时器
let uiHideTimer = null;

// 当前视频信息
const currentVideo = computed(() => {
  return videoList.value[currentVideoIndex.value] || {};
});

// 视频进度
const progress = ref(0);
const currentTime = ref("00:00");
const duration = ref("00:00");

// 音量控制
const volume = ref(0.8);
const isMuted = ref(false);
let originalVolume = 0.8;

// 视频选集数据
const videoList = ref([
  {
    id: 1,
    title: "大眼博士 微生物篇",
    description: "介绍微生物的基本概念和分类",
    url: "/videos/children/大眼博士_微生物.mp4",
    thumbnail: new URL("../assets/microbialIMG/大眼博士_微生物.png", import.meta.url).href,
    poster: new URL("../assets/microbialIMG/大眼博士_微生物.png", import.meta.url).href,
    duration: "03:43",
  },
  {
    id: 2,
    title: "向神秘微观世界进发",
    description: "深入了解微生物的生活习性",
    url: "/videos/children/向神秘微观世界进发_1.mp4",
    thumbnail: new URL("../assets/microbialIMG/向神秘微观世界进发_1.png", import.meta.url).href,
    poster: new URL("../assets/microbialIMG/向神秘微观世界进发_1.png", import.meta.url).href,
    duration: "08:52",
  },
  {
    id: 3,
    title: "微生物成员大不同",
    description: "探索益生菌对人体的益处",
    url: "/videos/children/微生物成员大不同_2.mp4",
    thumbnail: new URL("../assets/microbialIMG/微生物成员大不同_2.png", import.meta.url).href,
    poster: new URL("../assets/microbialIMG/微生物成员大不同_2.png", import.meta.url).href,
    duration: "09:48",
  },
  {
    id: 4,
    title: "皮肤上的亲密小伙伴",
    description: "了解病毒的基本结构和传播方式",
    url: "/videos/children/皮肤上的亲密小伙伴_3.mp4",
    thumbnail: new URL("../assets/microbialIMG/皮肤上的亲密小伙伴_3.png", import.meta.url).href,
    poster: new URL("../assets/microbialIMG/皮肤上的亲密小伙伴_3.png", import.meta.url).href,
    duration: "08:37",
  },
  {
    id: 5,
    title: "肚子里的拔河比赛",
    description: "探索微生物在自然界中的重要性",
    url: "/videos/children/肚子里的拔河比赛_4.mp4",
    thumbnail: new URL("../assets/microbialIMG/肚子里的拔河比赛_4.png", import.meta.url).href,
    poster: new URL("../assets/microbialIMG/肚子里的拔河比赛_4.png", import.meta.url).href,
    duration: "09:17",
  },
  {
    id: 6,
    title: "揪出致病的罪魁祸首",
    description: "了解致病微生物的危害",
    url: "/videos/children/揪出致病的罪魁祸首_5.mp4",
    thumbnail: new URL("../assets/microbialIMG/揪出致病的罪魁祸首_5.png", import.meta.url).href,
    poster: new URL("../assets/microbialIMG/揪出致病的罪魁祸首_5.png", import.meta.url).href,
    duration: "08:21",
  },
  {
    id: 7,
    title: "人体健康大作战",
    description: "了解微生物与人体健康的关系",
    url: "/videos/children/人体健康大作战_6.mp4",
    thumbnail: new URL("../assets/microbialIMG/人体健康大作战_6.png", import.meta.url).href,
    poster: new URL("../assets/microbialIMG/人体健康大作战_6.png", import.meta.url).href,
    duration: "08:21",
  },
  {
    id: 8,
    title: "寻找做美味的大厨",
    description: "了解微生物在食品制作中的作用",
    url: "/videos/children/寻找做美味的大厨_7.mp4",
    thumbnail: new URL("../assets/microbialIMG/寻找做美味的大厨_7.png", import.meta.url).href,
    poster: new URL("../assets/microbialIMG/寻找做美味的大厨_7.png", import.meta.url).href,
    duration: "09:39",
  },
  {
    id: 9,
    title: "小生命有大用途",
    description: "探索微生物在各行各业中的应用",
    url: "/videos/children/向神秘微观世界进发_8.mp4",
    thumbnail: new URL("../assets/microbialIMG/小生命有大用途_8.png", import.meta.url).href,
    poster: new URL("../assets/microbialIMG/小生命有大用途_8.png", import.meta.url).href,
    duration: "08:42",
  },
  {
    id: 10,
    title: "地球环境清洁工",
    description: "了解微生物在环境保护中的重要作用",
    url: "/videos/children/地球环境清洁工_9.mp4",
    thumbnail: new URL("../assets/microbialIMG/地球环境清洁工_9.png", import.meta.url).href,
    poster: new URL("../assets/microbialIMG/地球环境清洁工_9.png", import.meta.url).href,
    duration: "10:25",
  },
]);

// 格式化时间（秒 -> mm:ss）
const formatTime = (seconds) => {
  if (isNaN(seconds)) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

// 播放/暂停切换
const togglePlay = () => {
  if (!videoPlayer.value) return;

  if (isPlaying.value) {
    videoPlayer.value.pause();
  } else {
    videoPlayer.value.play();
  }
};

// 播放状态变化处理
const handlePlay = () => {
  isPlaying.value = true;
};

const handlePause = () => {
  isPlaying.value = false;
};

// 进度更新
const handleTimeUpdate = () => {
  if (!videoPlayer.value) return;

  const current = videoPlayer.value.currentTime;
  const total = videoPlayer.value.duration;

  if (!isNaN(total)) {
    progress.value = (current / total) * 100;
    currentTime.value = formatTime(current);
    duration.value = formatTime(total);

    // 更新进度条CSS变量
    const progressSlider = document.querySelector(".progress-slider");
    if (progressSlider) {
      progressSlider.style.setProperty("--progress", progress.value + "%");
    }
  }
};

// 视频加载开始
const handleLoadStart = () => {
  isLoading.value = true;
  hasError.value = false;
};

// 视频加载完成
const handleLoadedData = () => {
  isLoading.value = false;
  hasError.value = false;
  duration.value = formatTime(videoPlayer.value.duration);
};

// 视频加载错误
const handleError = (e) => {
  isLoading.value = false;
  hasError.value = true;
  isPlaying.value = false;

  switch (e.target.error.code) {
    case e.target.error.MEDIA_ERR_ABORTED:
      errorMessage.value = "视频播放被中止";
      break;
    case e.target.error.MEDIA_ERR_NETWORK:
      errorMessage.value = "网络错误导致视频无法加载";
      break;
    case e.target.error.MEDIA_ERR_DECODE:
      errorMessage.value = "视频解码失败";
      break;
    case e.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
      errorMessage.value = "视频格式不支持";
      break;
    default:
      errorMessage.value = "视频播放出错，请稍后重试";
  }
};

// 视频结束处理
const handleEnded = () => {
  isPlaying.value = false;
  progress.value = 0;
  currentTime.value = "00:00";
};

// 进度条滑块拖拽跳转
const seekVideoBySlider = (e) => {
  if (!videoPlayer.value || isNaN(videoPlayer.value.duration)) return;

  const percent = e.target.value / 100;
  const newTime = percent * videoPlayer.value.duration;
  videoPlayer.value.currentTime = newTime;
};

// 进度条点击跳转
const seekVideoByClick = (e) => {
  if (!videoPlayer.value || isNaN(videoPlayer.value.duration)) return;

  const rect = e.target.getBoundingClientRect();
  const percent = (e.clientX - rect.left) / rect.width;
  const newTime = percent * videoPlayer.value.duration;
  videoPlayer.value.currentTime = newTime;
};

// 音量调节
const updateVolume = () => {
  if (!videoPlayer.value) return;

  videoPlayer.value.volume = volume.value;
  isMuted.value = volume.value < 0.01; // 使用宽松比较，解决浮点数精度问题
};

// 静音切换
const toggleMute = () => {
  if (!videoPlayer.value) return;

  if (isMuted.value) {
    // 取消静音，恢复原音量
    volume.value = originalVolume;
    isMuted.value = false;
  } else {
    // 静音，保存原音量
    originalVolume = volume.value;
    volume.value = 0;
    isMuted.value = true;
  }

  videoPlayer.value.volume = volume.value;
};

// 视频选集
const selectVideo = (index) => {
  if (!videoPlayer.value || index === currentVideoIndex.value) return;

  currentVideoIndex.value = index;
  loadVideo(index);
};

// 加载视频
const loadVideo = (index) => {
  if (!videoPlayer.value) return;

  const video = videoList.value[index];
  if (!video) return;

  isLoading.value = true;
  hasError.value = false;
  isPlaying.value = false;

  // 重置进度
  progress.value = 0;
  currentTime.value = "00:00";

  // 设置视频源
  videoPlayer.value.src = video.url;

  // 如果视频URL为空，显示错误
  if (!video.url) {
    handleError({ target: { error: { code: 4 } } });
    return;
  }
};

// 重新加载视频
const reloadVideo = () => {
  loadVideo(currentVideoIndex.value);
};

// 全屏切换
const toggleFullscreen = () => {
  const container = document.querySelector(".video-player-container");

  // 保存当前播放位置
  const currentTime = videoPlayer.value ? videoPlayer.value.currentTime : 0;
  const isPlayingState = isPlaying.value;

  if (!document.fullscreenElement) {
    // 进入全屏
    if (container.requestFullscreen) {
      container.requestFullscreen().then(() => {
        // 恢复播放位置和状态
        if (videoPlayer.value) {
          videoPlayer.value.currentTime = currentTime;
          if (isPlayingState) {
            videoPlayer.value.play();
          }
        }
      });
    } else if (container.webkitRequestFullscreen) {
      container.webkitRequestFullscreen();
      // WebKit不支持Promise，使用setTimeout恢复状态
      setTimeout(() => {
        if (videoPlayer.value) {
          videoPlayer.value.currentTime = currentTime;
          if (isPlayingState) {
            videoPlayer.value.play();
          }
        }
      }, 100);
    } else if (container.msRequestFullscreen) {
      container.msRequestFullscreen();
      // MS不支持Promise，使用setTimeout恢复状态
      setTimeout(() => {
        if (videoPlayer.value) {
          videoPlayer.value.currentTime = currentTime;
          if (isPlayingState) {
            videoPlayer.value.play();
          }
        }
      }, 100);
    }
  } else {
    // 退出全屏
    if (document.exitFullscreen) {
      document.exitFullscreen().then(() => {
        // 恢复播放位置和状态
        if (videoPlayer.value) {
          videoPlayer.value.currentTime = currentTime;
          if (isPlayingState) {
            videoPlayer.value.play();
          }
        }
      });
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
      // WebKit不支持Promise，使用setTimeout恢复状态
      setTimeout(() => {
        if (videoPlayer.value) {
          videoPlayer.value.currentTime = currentTime;
          if (isPlayingState) {
            videoPlayer.value.play();
          }
        }
      }, 100);
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
      // MS不支持Promise，使用setTimeout恢复状态
      setTimeout(() => {
        if (videoPlayer.value) {
          videoPlayer.value.currentTime = currentTime;
          if (isPlayingState) {
            videoPlayer.value.play();
          }
        }
      }, 100);
    }
  }
};

// 显示UI
const showUI = () => {
  uiVisible.value = true;
};

// 隐藏UI
const hideUI = () => {
  if (isFullscreen.value) {
    uiVisible.value = false;
  }
};

// 重置UI隐藏定时器
const resetUIHideTimer = () => {
  if (uiHideTimer) {
    clearTimeout(uiHideTimer);
  }
  showUI();
  uiHideTimer = setTimeout(hideUI, 3000);
};

// 全屏状态变化处理
const handleFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement;

  if (isFullscreen.value) {
    // 进入全屏，启动UI隐藏定时器
    resetUIHideTimer();
  } else {
    // 退出全屏，清除定时器，显示UI
    if (uiHideTimer) {
      clearTimeout(uiHideTimer);
      uiHideTimer = null;
    }
    showUI();
  }
};

// 组件挂载
onMounted(() => {
  if (!videoPlayer.value) return;

  // 添加事件监听器
  videoPlayer.value.addEventListener("play", handlePlay);
  videoPlayer.value.addEventListener("pause", handlePause);
  videoPlayer.value.addEventListener("timeupdate", handleTimeUpdate);
  videoPlayer.value.addEventListener("loadeddata", handleLoadedData);
  videoPlayer.value.addEventListener("loadstart", handleLoadStart);
  videoPlayer.value.addEventListener("error", handleError);
  videoPlayer.value.addEventListener("ended", handleEnded);

  // 设置初始音量
  videoPlayer.value.volume = volume.value;

  // 监听全屏变化
  document.addEventListener("fullscreenchange", handleFullscreenChange);
  document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
  document.addEventListener("msfullscreenchange", handleFullscreenChange);

  // 监听鼠标移动和点击事件，重置UI隐藏定时器
  const videoContainer = document.querySelector(".video-player-container");
  if (videoContainer) {
    videoContainer.addEventListener("mousemove", resetUIHideTimer);
    videoContainer.addEventListener("click", resetUIHideTimer);
  }

  // 初始化加载第一个视频
  loadVideo(0);
});

// 组件卸载
onUnmounted(() => {
  if (!videoPlayer.value) return;

  // 移除事件监听器
  videoPlayer.value.removeEventListener("play", handlePlay);
  videoPlayer.value.removeEventListener("pause", handlePause);
  videoPlayer.value.removeEventListener("timeupdate", handleTimeUpdate);
  videoPlayer.value.removeEventListener("loadeddata", handleLoadedData);
  videoPlayer.value.removeEventListener("loadstart", handleLoadStart);
  videoPlayer.value.removeEventListener("error", handleError);
  videoPlayer.value.removeEventListener("ended", handleEnded);

  // 移除全屏监听器
  document.removeEventListener("fullscreenchange", handleFullscreenChange);
  document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
  document.removeEventListener("msfullscreenchange", handleFullscreenChange);

  // 移除鼠标事件监听器
  const videoContainer = document.querySelector(".video-player-container");
  if (videoContainer) {
    videoContainer.removeEventListener("mousemove", resetUIHideTimer);
    videoContainer.removeEventListener("click", resetUIHideTimer);
  }

  // 清除UI隐藏定时器
  if (uiHideTimer) {
    clearTimeout(uiHideTimer);
    uiHideTimer = null;
  }

  // 暂停视频
  videoPlayer.value.pause();
});
</script>

<style scoped>
/* 全局基础样式 */
.microbial-page {
  background-color: #f0f8ff;
  /* width: 1440px; */
  width: 100%;
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

/* 微生物视频区 */
.microbial-categories {
}

/* 视频播放器样式 */
.video-player-container {
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
  background: #f5f5f5;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 视频播放区域 */
.video-wrapper {
  position: relative;
  width: 100%;
  background: #000;
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

.video-element {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #000;
}

/* 播放按钮覆盖层 */
/* .video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.3);
  opacity: 1;
  transition: opacity 0.3s ease;
  cursor: pointer;
}

.video-overlay:hover {
  background: rgba(0, 0, 0, 0.4);
}

.video-element.playing + .video-overlay {
  opacity: 0;
  pointer-events: none;
} */

/* 播放按钮样式 */
/* .play-button {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.play-button:hover {
  transform: scale(1.1);
  background: rgba(255, 255, 255, 1);
}

.play-button::before {
  content: "";
  position: absolute;
  left: 30px;
  top: 20px;
  width: 0;
  height: 0;
  border-top: 20px solid transparent;
  border-bottom: 20px solid transparent;
  border-left: 30px solid #333;
} */

/* 视频加载状态 */
.video-loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.7);
  z-index: 10;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 视频错误提示 */
.video-error {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  z-index: 10;
  padding: 20px;
  text-align: center;
}

.video-error p {
  margin-bottom: 20px;
  font-size: 16px;
  line-height: 1.5;
}

.video-error button {
  padding: 8px 16px;
  background: #4a90e2;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s ease;
}

.video-error button:hover {
  background: #357abd;
}

/* 视频控制栏 */
.video-controls {
  display: flex;
  align-items: center;
  background: #2c3e50;
  padding: 10px 15px;
  gap: 10px;
  transition: opacity 0.3s ease, transform 0.3s ease;
  opacity: 1;
  transform: translateY(0);
}

/* 全屏模式下UI隐藏样式 */
:fullscreen .video-controls,
:-webkit-full-screen .video-controls,
:-moz-full-screen .video-controls,
:-ms-fullscreen .video-controls {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

/* UI隐藏状态 */
:fullscreen .video-controls.ui-hidden,
:-webkit-full-screen .video-controls.ui-hidden,
:-moz-full-screen .video-controls.ui-hidden,
:-ms-fullscreen .video-controls.ui-hidden {
  opacity: 0;
  transform: translateY(20px);
  pointer-events: none;
}

/* 控制按钮通用样式 */
.control-btn {
  background: transparent;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: background 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* 进度条样式 */
.progress-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.progress-slider {
  width: 100%;
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  outline: none;
  transition: height 0.2s ease;
  cursor: pointer;
}

.progress-slider:hover {
  height: 8px;
  background: rgba(255, 255, 255, 0.3);
}

.progress-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 12px;
  height: 12px;
  background: #fff;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s ease;
}

.progress-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.progress-slider::-moz-range-thumb {
  width: 12px;
  height: 12px;
  background: #ffffff;
  border-radius: 50%;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s ease;
}

.progress-slider::-moz-range-thumb:hover {
  transform: scale(1.2);
}

.progress-slider::-webkit-slider-runnable-track {
  background: linear-gradient(
    to right,
    #4a90e2 0%,
    #4a90e2 var(--progress),
    rgba(255, 255, 255, 0.2) var(--progress),
    rgba(255, 255, 255, 0.2) 100%
  );
  border-radius: 3px;
}

.progress-slider::-moz-range-track {
  background: linear-gradient(
    to right,
    #4a90e2 0%,
    #4a90e2 var(--progress),
    rgba(255, 255, 255, 0.2) var(--progress),
    rgba(255, 255, 255, 0.2) 100%
  );
  border-radius: 3px;
}

/* 时间显示 */
.time-display {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #fff;
  opacity: 0.8;
}

/* 音量控制样式 */
.volume-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.volume-slider-container {
  width: 100px;
  transition: width 0.3s ease;
  overflow: hidden;
}

.volume-container:hover .volume-slider-container {
  width: 100px;
}

.volume-slider {
  width: 100%;
  height: 4px;
  -webkit-appearance: none;
  appearance: none;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  outline: none;
  transition: background 0.3s ease;
}

.volume-slider:hover {
  background: rgba(255, 255, 255, 0.3);
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 12px;
  height: 12px;
  background: #fff;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s ease;
}

.volume-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.volume-slider::-moz-range-thumb {
  width: 12px;
  height: 12px;
  background: #fff;
  border-radius: 50%;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s ease;
}

.volume-slider::-moz-range-thumb:hover {
  transform: scale(1.2);
}

/* 视频选集列表 */
.video-playlist {
  padding: 20px;
  background: #fafafa;
}

.playlist-title {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 18px;
  font-weight: bold;
}

.playlist-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
  /* 限制最大高度，超出部分滚动 */
  max-height: 300px;
  overflow-y: auto;
}

/* 滚动条样式 */
.playlist-items::-webkit-scrollbar {
  width: 6px;
}

.playlist-items::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.playlist-items::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.playlist-items::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* 选集项样式 */
.playlist-item {
  display: flex;
  gap: 15px;
  padding: 12px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.playlist-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.playlist-item.active {
  border-color: #4a90e2;
  background: #f0f8ff;
}

/* 选集缩略图 */
.playlist-item-thumbnail {
  position: relative;
  width: 120px;
  height: 68px;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 6px;
  background: #f0f0f0;
}

.playlist-item-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.playlist-item:hover .playlist-item-thumbnail img {
  transform: scale(1.05);
}

/* 视频时长 */
.video-duration {
  position: absolute;
  bottom: 4px;
  right: 4px;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  font-size: 10px;
  padding: 2px 4px;
  border-radius: 2px;
}

/* 选集信息 */
.playlist-item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;
}

.video-title {
  margin: 0;
  color: #333;
  font-size: 14px;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* .video-desc {
  margin: 0;
  color: #666;
  font-size: 12px;
  line-height: 1.4;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
} */

/* 响应式设计 */
@media (max-width: 768px) {
  .video-player-container {
    max-width: 100%;
    margin: 0;
  }

  .video-controls {
    padding: 8px 10px;
    gap: 8px;
  }

  .control-btn {
    padding: 6px;
  }

  .control-btn svg {
    width: 16px;
    height: 16px;
  }

  .volume-slider-container {
    width: 60px;
  }

  .volume-container:hover .volume-slider-container {
    width: 80px;
  }

  .playlist-item {
    flex-direction: column;
    gap: 10px;
  }

  .playlist-item-thumbnail {
    width: 100%;
    height: auto;
    aspect-ratio: 16 / 9;
  }

  .video-title {
    font-size: 16px;
  }

  /* .video-desc {
    font-size: 13px;
  } */
}

@media (max-width: 480px) {
  .video-controls {
    padding: 6px 8px;
    gap: 5px;
  }

  .progress-container {
    gap: 3px;
  }

  .time-display {
    font-size: 10px;
  }

  .playlist-items {
    max-height: 250px;
  }

  .playlist-item {
    padding: 10px;
  }

  .video-title {
    font-size: 14px;
  }

  /* .video-desc {
    font-size: 12px;
  } */
}

/* 全屏模式样式 */
:fullscreen .video-player-container,
:-webkit-full-screen .video-player-container,
:-moz-full-screen .video-player-container,
:-ms-fullscreen .video-player-container {
  max-width: 100%;
  width: 100%;
  height: 100%;
  margin: 0;
  border-radius: 0;
  background: #000;
}

:fullscreen .video-wrapper,
:-webkit-full-screen .video-wrapper,
:-moz-full-screen .video-wrapper,
:-ms-fullscreen .video-wrapper {
  height: calc(100vh - 60px);
}

:fullscreen .video-element,
:-webkit-full-screen .video-element,
:-moz-full-screen .video-element,
:-ms-fullscreen .video-element {
  height: 100%;
  object-fit: contain;
}

:fullscreen .video-playlist,
:-webkit-full-screen .video-playlist,
:-moz-full-screen .video-playlist,
:-ms-fullscreen .video-playlist {
  display: none;
}

/* 修复Safari浏览器的全屏问题 */
@media screen and (-webkit-min-device-pixel-ratio: 0) {
  :fullscreen .video-controls {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
  }
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
