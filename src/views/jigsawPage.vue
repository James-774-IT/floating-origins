<template>
  <div class="jigsaw-container">
    <!-- 图片选择界面 -->
    <div v-if="gameState === 'select-image'" class="select-image-container">
      <h2 class="title">选择拼图图片</h2>
      <div class="image-carousel">
        <button
          class="carousel-btn prev"
          @click="prevImage"
          aria-label="上一张图片"
          :disabled="currentImageIndex === 0"
        >
          &lt;
        </button>
        <div class="carousel-wrapper">
          <div class="carousel-items">
            <div
              v-for="(image, index) in images"
              :key="index"
              class="carousel-item"
              :class="{ active: currentImageIndex === index }"
              @click="selectImage(index)"
            >
              <img :src="image.src" :alt="image.alt" :aria-label="image.alt" />
              <div class="image-title">{{ image.title }}</div>
            </div>
          </div>
        </div>
        <button
          class="carousel-btn next"
          @click="nextImage"
          aria-label="下一张图片"
          :disabled="currentImageIndex === images.length - 1"
        >
          &gt;
        </button>
      </div>
      <button class="confirm-btn" @click="confirmImage" :disabled="!selectedImage">确认选择</button>
    </div>

    <!-- 难度选择界面 -->
    <div v-if="gameState === 'select-difficulty'" class="select-difficulty-container">
      <h2 class="title">选择拼图难度</h2>
      <div class="difficulty-options">
        <div
          v-for="difficulty in difficulties"
          :key="difficulty.level"
          class="difficulty-option"
          :class="{ active: selectedDifficulty === difficulty.level }"
          @click="selectDifficulty(difficulty.level)"
        >
          <h3>{{ difficulty.name }}</h3>
          <div class="difficulty-info">
            <span class="grid-size">{{ difficulty.gridSize }}×{{ difficulty.gridSize }}</span>
            <span class="estimated-time">{{ difficulty.estimatedTime }}</span>
          </div>
        </div>
      </div>
      <button class="start-btn" @click="startGame" :disabled="!selectedDifficulty">开始游戏</button>
    </div>

    <!-- 游戏界面 -->
    <div v-if="gameState === 'playing'" class="game-container">
      <!-- 顶部信息栏 -->
      <div class="top-bar">
        <div class="back-btn" @click="backToSelectImage" aria-label="返回选择拼图">
          返回选择拼图
        </div>
        <div class="timer">
          <span class="label">用时：</span>
          <span class="time">{{ formattedTime }}</span>
        </div>
        <div class="success-count">
          <span class="label">已成功完成：</span>
          <span class="count" :class="{ updated: isCountUpdated }"
            >{{ gameRecords.successCount || 0 }}次</span
          >
          <span class="game-status" :class="gameStatus.value">{{ gameStatusText }}</span>
          <button class="reset-count-btn" @click="resetSuccessCount" aria-label="重置成功次数">
            重置
          </button>
        </div>
        <div class="reset-btn" @click="resetGame" aria-label="重置游戏">重置游戏</div>
      </div>

      <!-- 游戏主区域 -->
      <div class="game-main">
        <!-- 左侧拼图块放置区域和拼图区域 -->
        <div class="game-area">
          <!-- 拼图区域 -->
          <div class="puzzle-area" ref="puzzleArea">
            <div
              v-for="(piece, index) in puzzlePieces"
              :key="index"
              class="puzzle-piece"
              :class="{ 'is-selected': selectedPieceIndex === index }"
              :style="getPieceStyle(piece, index)"
              @mousedown="startDrag($event, index)"
              @touchstart="startDrag($event, index)"
              :aria-label="`拼图碎片 ${index + 1}`"
            ></div>
          </div>
        </div>

        <!-- 侧边栏 -->
        <div class="sidebar">
          <!-- 缩略图预览 -->
          <div class="preview-section">
            <h3>原图预览</h3>
            <div class="preview-container" @click="togglePreview">
              <img :src="selectedImage.src" :alt="selectedImage.alt" class="preview-image" />
            </div>
          </div>

          <!-- 完成度 -->
          <div class="progress-section">
            <h3>完成度</h3>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: progress + '%' }"></div>
            </div>
            <div class="progress-text">{{ progress }}%</div>
          </div>

          <!-- 操作提示 -->
          <div class="instructions-section">
            <h3 @click="toggleInstructions">
              如何玩
              <span class="toggle-icon">{{ instructionsOpen ? "▼" : "▶" }}</span>
            </h3>
            <div v-if="instructionsOpen" class="instructions-content">
              <ul>
                <li>拖拽拼图碎片到正确位置</li>
                <li>碎片靠近正确位置时会自动吸附</li>
                <li>完成所有碎片拼接即可获胜</li>
                <li>点击重置按钮可重新开始游戏</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- 退出提示 -->
      <div v-if="showExitConfirm" class="exit-confirm-overlay">
        <div
          class="exit-confirm-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="exit-confirm-title"
        >
          <h3 id="exit-confirm-title">拼图还未完成！</h3>
          <p>退出将不保存此次记录</p>
          <div class="exit-confirm-buttons">
            <button class="btn continue" @click="continueGame" autofocus>继续拼图</button>
            <button class="btn exit" @click="confirmExit">确认退出</button>
          </div>
        </div>
      </div>

      <!-- 完成庆祝 -->
      <div v-if="showCompletion" class="completion-overlay">
        <div class="completion-content">
          <h2 class="celebration-text">恭喜您成功完成拼图！</h2>
          <div class="completion-time">用时：{{ formattedTime }}</div>
          <button class="btn play-again" @click="playAgain">再玩一次</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from "vue";

// 游戏状态管理
const gameState = ref("select-image"); // select-image, select-difficulty, playing
const currentImageIndex = ref(0);
const selectedImage = ref(null);
const selectedDifficulty = ref(null);
const selectedPieceIndex = ref(-1);
const showExitConfirm = ref(false);
const showCompletion = ref(false);
const instructionsOpen = ref(false);
const puzzleArea = ref(null);

// 图片数据
const images = [
  {
    src: new URL("../assets/jigsawIMG/IMG@1.png", import.meta.url).href,
    alt: "拼图图片1",
    title: "噬菌体",
  },
  {
    src: new URL("../assets/jigsawIMG/IMG@2.png", import.meta.url).href,
    alt: "拼图图片2",
    title: "乳酸菌",
  },
  {
    src: new URL("../assets/jigsawIMG/IMG@3.png", import.meta.url).href,
    alt: "拼图图片3",
    title: "流放线菌",
  },
  {
    src: new URL("../assets/jigsawIMG/IMG@4.png", import.meta.url).href,
    alt: "拼图图片4",
    title: "草履虫",
  },
  {
    src: new URL("../assets/jigsawIMG/IMG@5.png", import.meta.url).href,
    alt: "拼图图片5",
    title: " 酵母菌",
  },
  {
    src: new URL("../assets/jigsawIMG/IMG@6.png", import.meta.url).href,
    alt: "拼图图片6",
    title: "大肠杆菌",
  },
  {
    src: new URL("../assets/jigsawIMG/IMG@7.png", import.meta.url).href,
    alt: "拼图图片7",
    title: " 支原体",
  },
  {
    src: new URL("../assets/jigsawIMG/IMG@8.png", import.meta.url).href,
    alt: "拼图图片8",
    title: " 蓝细菌（蓝藻）",
  },
  {
    src: new URL("../assets/jigsawIMG/IMG@9.png", import.meta.url).href,
    alt: "拼图图片9",
    title: " 衣原体",
  },
];

// 难度数据
const difficulties = [
  {
    level: "easy",
    name: "简单",
    gridSize: 3,
    estimatedTime: "5-10分钟",
    timeRange: [5, 10],
  },
  {
    level: "medium",
    name: "一般",
    gridSize: 5,
    estimatedTime: "15-25分钟",
    timeRange: [15, 25],
  },
  {
    level: "hard",
    name: "困难",
    gridSize: 10,
    estimatedTime: "30-60分钟",
    timeRange: [30, 60],
  },
];

// 计时器
const startTime = ref(null);
const elapsedTime = ref(0);
const timerInterval = ref(null);

// 游戏记录
const gameRecords = ref({
  successCount: 0,
  lastCompletionTime: null,
});

// 游戏状态
const gameStatus = ref("not-started"); // not-started, playing, completed

// 计数更新动画状态
const isCountUpdated = ref(false);

// 拼图数据
const puzzlePieces = ref([]);
const gridSize = ref(5);
const pieceSize = ref(0);
const progress = ref(0);

// 拖拽相关
const isDragging = ref(false);
const dragOffset = ref({ x: 0, y: 0 });
const currentDifficulty = ref(null);

// 计算属性
const formattedTime = computed(() => {
  const minutes = Math.floor(elapsedTime.value / 60);
  const seconds = elapsedTime.value % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
});

const gameStatusText = computed(() => {
  if (gameState.value !== "playing") {
    return "还未开始";
  } else if (gameStatus.value === "completed" || showCompletion.value) {
    return "游戏已完成";
  } else {
    return "游戏进行中";
  }
});

// 图片选择相关方法
const scrollToImage = (index) => {
  nextTick(() => {
    const carouselWrapper = document.querySelector(".carousel-wrapper");
    const targetItem = document.querySelector(`.carousel-item:nth-child(${index + 1})`);
    if (carouselWrapper && targetItem) {
      const wrapperRect = carouselWrapper.getBoundingClientRect();
      const itemRect = targetItem.getBoundingClientRect();
      const scrollPosition =
        carouselWrapper.scrollLeft +
        (itemRect.left - wrapperRect.left) -
        (wrapperRect.width - itemRect.width) / 2;

      carouselWrapper.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  });
};

const prevImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--;
    scrollToImage(currentImageIndex.value);
  }
};

const nextImage = () => {
  if (currentImageIndex.value < images.length - 1) {
    currentImageIndex.value++;
    scrollToImage(currentImageIndex.value);
  }
};

const selectImage = (index) => {
  currentImageIndex.value = index;
  selectedImage.value = images[index];
  scrollToImage(index);
};

const confirmImage = () => {
  if (selectedImage.value) {
    gameState.value = "select-difficulty";
  }
};

// 难度选择相关方法
const selectDifficulty = (level) => {
  selectedDifficulty.value = level;
  const difficulty = difficulties.find((d) => d.level === level);
  if (difficulty) {
    gridSize.value = difficulty.gridSize;
    currentDifficulty.value = difficulty;
  }
};

// 游戏初始化
const startGame = () => {
  if (selectedDifficulty.value && selectedImage.value) {
    gameState.value = "playing";
    gameStatus.value = "playing";
    initPuzzle();
    startTimer();
    loadGameRecords();
  }
};

// 拼图初始化
const initPuzzle = () => {
  puzzlePieces.value = [];
  const difficulty = difficulties.find((d) => d.level === selectedDifficulty.value);
  if (!difficulty) return;

  // 更新gridSize.value
  gridSize.value = difficulty.gridSize;

  const areaWidth = 600;
  pieceSize.value = Math.floor(areaWidth / difficulty.gridSize);

  // 创建拼图碎片
  for (let row = 0; row < difficulty.gridSize; row++) {
    for (let col = 0; col < difficulty.gridSize; col++) {
      const piece = {
        originalRow: row,
        originalCol: col,
        currentRow: -1, // -1表示未放置在拼图区域
        currentCol: -1,
        x: 0,
        y: 0,
        isCorrect: false,
      };
      puzzlePieces.value.push(piece);
    }
  }

  // 打乱拼图并放置到左右两侧
  shufflePieces();
  // 计算初始完成度
  calculateProgress();
};

// 打乱拼图碎片
const shufflePieces = () => {
  const shuffled = [...puzzlePieces.value];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // 将拼图块放置到拼图区域内，暂时不放置到左右两侧
  shuffled.forEach((piece, index) => {
    const row = Math.floor(index / gridSize.value);
    const col = index % gridSize.value;

    piece.currentRow = row;
    piece.currentCol = col;
    piece.x = col * pieceSize.value;
    piece.y = row * pieceSize.value;
    piece.isCorrect = piece.originalRow === row && piece.originalCol === col;
  });

  puzzlePieces.value = shuffled;
};

// 拖拽相关方法
const startDrag = (event, index) => {
  event.preventDefault();
  selectedPieceIndex.value = index;
  isDragging.value = true;

  const piece = puzzlePieces.value[index];
  const rect = puzzleArea.value.getBoundingClientRect();
  const clientX = event.clientX || event.touches[0].clientX;
  const clientY = event.clientY || event.touches[0].clientY;

  dragOffset.value = {
    x: clientX - rect.left - piece.x,
    y: clientY - rect.top - piece.y,
  };

  document.addEventListener("mousemove", drag);
  document.addEventListener("mouseup", endDrag);
  document.addEventListener("touchmove", drag);
  document.addEventListener("touchend", endDrag);
};

const drag = (event) => {
  if (!isDragging.value || selectedPieceIndex.value === -1) return;

  const clientX = event.clientX || event.touches[0].clientX;
  const clientY = event.clientY || event.touches[0].clientY;
  const rect = puzzleArea.value.getBoundingClientRect();

  let newX = clientX - rect.left - dragOffset.value.x;
  let newY = clientY - rect.top - dragOffset.value.y;

  // 限制在拼图区域内，但允许拖到左边
  newX = Math.min(newX, rect.width - pieceSize.value);
  newY = Math.max(0, Math.min(newY, rect.height - pieceSize.value));

  const piece = puzzlePieces.value[selectedPieceIndex.value];
  piece.x = newX;
  piece.y = newY;
};

const endDrag = () => {
  if (!isDragging.value || selectedPieceIndex.value === -1) return;

  isDragging.value = false;
  const piece = puzzlePieces.value[selectedPieceIndex.value];

  // 吸附效果
  const snapThreshold = 15;
  const targetCol = Math.round(piece.x / pieceSize.value);
  const targetRow = Math.round(piece.y / pieceSize.value);
  const targetX = targetCol * pieceSize.value;
  const targetY = targetRow * pieceSize.value;

  if (
    Math.abs(piece.x - targetX) <= snapThreshold &&
    Math.abs(piece.y - targetY) <= snapThreshold
  ) {
    // 直接吸附到目标位置，不交换其他碎片
    piece.x = targetX;
    piece.y = targetY;
    piece.currentRow = targetRow;
    piece.currentCol = targetCol;
  }

  // 更新碎片是否正确
  updatePiecesCorrectness();
  // 计算完成度
  calculateProgress();
  // 检查是否完成
  checkCompletion();

  selectedPieceIndex.value = -1;
  document.removeEventListener("mousemove", drag);
  document.removeEventListener("mouseup", endDrag);
  document.removeEventListener("touchmove", drag);
  document.removeEventListener("touchend", endDrag);
};

// 更新碎片是否正确
const updatePiecesCorrectness = () => {
  puzzlePieces.value.forEach((piece) => {
    const correctRow = Math.floor(piece.originalRow);
    const correctCol = Math.floor(piece.originalCol);
    piece.isCorrect = piece.currentRow === correctRow && piece.currentCol === correctCol;
  });
};

// 计算完成度
const calculateProgress = () => {
  const correctCount = puzzlePieces.value.filter((piece) => piece.isCorrect).length;
  progress.value = Math.round((correctCount / puzzlePieces.value.length) * 100);
};

// 检查是否完成
const checkCompletion = () => {
  const allCorrect = puzzlePieces.value.every((piece) => piece.isCorrect);
  if (allCorrect) {
    completeGame();
  }
};

// 完成游戏
const completeGame = () => {
  stopTimer();
  showCompletion.value = true;
  gameStatus.value = "completed";
  updateGameRecords();
};

// 计时器相关方法
const startTimer = () => {
  startTime.value = Date.now();
  timerInterval.value = setInterval(() => {
    elapsedTime.value = Math.floor((Date.now() - startTime.value) / 1000);
  }, 1000);
};

const stopTimer = () => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
    timerInterval.value = null;
  }
};

// 游戏记录相关方法

// 初始化游戏记录
const initializeGameRecord = () => {
  gameRecords.value = {
    successCount: 0,
    lastCompletionTime: null,
  };
  saveGameRecord(gameRecords.value);
};

// 保存游戏记录到localStorage
const saveGameRecord = (record) => {
  try {
    localStorage.setItem("jigsawGameRecords", JSON.stringify(record));
    // 同时保存备份
    localStorage.setItem("jigsawGameRecordsBackup", JSON.stringify(record));
  } catch (error) {
    console.error("保存游戏记录失败:", error);
  }
};

// 从localStorage获取游戏记录
const getGameRecord = () => {
  try {
    let records = localStorage.getItem("jigsawGameRecords");

    // 数据验证
    if (records) {
      const parsed = JSON.parse(records);
      if (validateGameRecord(parsed)) {
        return parsed;
      } else {
        console.error("游戏记录数据格式错误，尝试恢复备份");
        return restoreGameRecord();
      }
    } else {
      // 首次访问，初始化记录
      initializeGameRecord();
      return gameRecords.value;
    }
  } catch (error) {
    console.error("获取游戏记录失败:", error);
    return restoreGameRecord();
  }
};

// 验证游戏记录数据格式
const validateGameRecord = (record) => {
  if (!record || typeof record !== "object") {
    return false;
  }

  // 验证successCount字段
  if (typeof record.successCount !== "number" || record.successCount < 0) {
    return false;
  }

  // 验证lastCompletionTime字段
  if (record.lastCompletionTime !== null && typeof record.lastCompletionTime !== "string") {
    return false;
  }

  // 验证ISO 8601日期格式
  if (record.lastCompletionTime) {
    const date = new Date(record.lastCompletionTime);
    if (isNaN(date.getTime())) {
      return false;
    }
  }

  return true;
};

// 从备份恢复游戏记录
const restoreGameRecord = () => {
  try {
    const backup = localStorage.getItem("jigsawGameRecordsBackup");
    if (backup) {
      const parsed = JSON.parse(backup);
      if (validateGameRecord(parsed)) {
        gameRecords.value = parsed;
        saveGameRecord(parsed);
        return parsed;
      }
    }
  } catch (error) {
    console.error("恢复游戏记录失败:", error);
  }

  // 恢复失败，初始化默认记录
  initializeGameRecord();
  return gameRecords.value;
};

// 加载游戏记录
const loadGameRecords = () => {
  gameRecords.value = getGameRecord();
};

// 更新游戏记录
const updateGameRecords = () => {
  gameRecords.value.successCount += 1;
  gameRecords.value.lastCompletionTime = new Date().toISOString();
  saveGameRecord(gameRecords.value);

  // 触发计数更新动画
  isCountUpdated.value = true;
  setTimeout(() => {
    isCountUpdated.value = false;
  }, 500);
};

// 重置游戏
const resetGame = () => {
  initPuzzle();
  stopTimer();
  elapsedTime.value = 0;
  gameStatus.value = "playing";
  startTimer();
};

// 重置成功计数
const resetSuccessCount = () => {
  if (confirm("确定要重置成功次数吗？此操作不可恢复。")) {
    gameRecords.value.successCount = 0;
    gameRecords.value.lastCompletionTime = null;
    saveGameRecord(gameRecords.value);

    // 触发计数更新动画
    isCountUpdated.value = true;
    setTimeout(() => {
      isCountUpdated.value = false;
    }, 500);
  }
};

// 再玩一次
const playAgain = () => {
  showCompletion.value = false;
  gameState.value = "select-image";
  gameStatus.value = "not-started";
  selectedImage.value = null;
  selectedDifficulty.value = null;
  elapsedTime.value = 0;
  progress.value = 0;
};

// 返回选择拼图界面
const backToSelectImage = () => {
  if (gameState.value === "playing" && gameStatus.value === "playing" && !showCompletion.value) {
    showExitConfirm.value = true;
  } else {
    navigateToSelectImage();
  }
};

// 导航到选择拼图界面
const navigateToSelectImage = () => {
  gameState.value = "select-image";
  selectedImage.value = null;
  selectedDifficulty.value = null;
  elapsedTime.value = 0;
  progress.value = 0;
};

const continueGame = () => {
  showExitConfirm.value = false;
};

const confirmExit = () => {
  showExitConfirm.value = false;
  navigateToSelectImage();
};

// 监听页面离开事件
const handleBeforeUnload = (event) => {
  if (gameState.value === "playing" && gameStatus.value === "playing" && !showCompletion.value) {
    // 浏览器安全策略要求必须返回字符串
    event.preventDefault();
    event.returnValue = "拼图还未完成！退出将不保存此次记录";
    return "拼图还未完成！退出将不保存此次记录";
  }
};

// 监听浏览器后退按钮
const handlePopState = () => {
  if (gameState.value === "playing" && gameStatus.value === "playing" && !showCompletion.value) {
    // 显示自定义退出提示框
    showExitConfirm.value = true;
    // 阻止默认的后退行为
    history.pushState(null, null, window.location.href);
  }
};

// 添加页面可见性变化监听，处理用户切换标签页的情况
const handleVisibilityChange = () => {
  if (document.hidden && gameState.value === "playing" && !showCompletion.value) {
    // 可以在这里添加暂停游戏等逻辑
    console.log("游戏已暂停");
  }
};

// 缩略图预览
const togglePreview = () => {
  // 这里可以实现大图预览功能
  alert("大图预览功能");
};

// 操作提示
const toggleInstructions = () => {
  instructionsOpen.value = !instructionsOpen.value;
};

// 获取碎片样式
const getPieceStyle = (piece) => {
  const difficulty = difficulties.find((d) => d.level === selectedDifficulty.value);
  if (!difficulty || !selectedImage.value) return {};

  const backgroundPositionX = -piece.originalCol * pieceSize.value;
  const backgroundPositionY = -piece.originalRow * pieceSize.value;

  return {
    width: `${pieceSize.value}px`,
    height: `${pieceSize.value}px`,
    left: `${piece.x}px`,
    top: `${piece.y}px`,
    backgroundImage: `url(${selectedImage.value.src})`,
    backgroundSize: `${difficulty.gridSize * pieceSize.value}px ${
      difficulty.gridSize * pieceSize.value
    }px`,
    backgroundPosition: `${backgroundPositionX}px ${backgroundPositionY}px`,
    transition: "all 0.3s ease",
  };
};

// 键盘事件处理
const handleKeyDown = (event) => {
  if (showExitConfirm.value) {
    if (event.key === "Enter") {
      // Enter键触发默认按钮（继续拼图）
      continueGame();
    } else if (event.key === "Escape") {
      // Esc键关闭提示框
      continueGame();
    }
  }
};

// 生命周期钩子
onMounted(() => {
  window.addEventListener("beforeunload", handleBeforeUnload);
  window.addEventListener("popstate", handlePopState);
  document.addEventListener("visibilitychange", handleVisibilityChange);
  document.addEventListener("keydown", handleKeyDown);
  loadGameRecords();
});

onBeforeUnmount(() => {
  window.removeEventListener("beforeunload", handleBeforeUnload);
  window.removeEventListener("popstate", handlePopState);
  document.removeEventListener("visibilitychange", handleVisibilityChange);
  document.removeEventListener("keydown", handleKeyDown);
  stopTimer();
});
</script>

<style scoped>
.jigsaw-container {
  font-family: Arial, sans-serif;
  width: 100%;
  margin: 0 auto;
  padding: 20px;
  background-color: #f5f5f5;
  height: auto;
}

.title {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 2rem;
}

/* 图片选择界面 */
.select-image-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  width: 100%;
  box-sizing: border-box;
}

.image-carousel {
  position: relative;
  width: 100%;
  max-width: 100%;
  height: 300px;
  overflow: hidden;
  margin-bottom: 30px;
}

.carousel-wrapper {
  overflow-x: auto;
  overflow-y: hidden;
  width: 100%;
  height: 100%;
  scrollbar-width: thin;
  scrollbar-color: #2196f3 #f5f5f5;
}

.carousel-wrapper::-webkit-scrollbar {
  height: 6px;
}

.carousel-wrapper::-webkit-scrollbar-track {
  background: #f5f5f5;
  border-radius: 3px;
}

.carousel-wrapper::-webkit-scrollbar-thumb {
  background: #2196f3;
  border-radius: 3px;
}

.carousel-wrapper::-webkit-scrollbar-thumb:hover {
  background: #1976d2;
}

.carousel-items {
  display: flex;
  transition: none;
  height: 100%;
  align-items: center;
}

.carousel-item {
  flex: 0 0 300px;
  height: 250px;
  margin: 0 10px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: white;
  opacity: 0.8;
  border: 3px solid transparent;
}

.carousel-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  opacity: 0.9;
}

.carousel-item.active {
  opacity: 1;
  border-color: #4caf50;
  box-shadow: 0 0 0 4px rgba(76, 175, 80, 0.3), 0 8px 16px rgba(0, 0, 0, 0.4);
  transform: translateY(-8px);
}

.carousel-item img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.image-title {
  text-align: center;
  padding: 10px;
  font-weight: bold;
  color: #333;
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10;
}

.carousel-btn:hover {
  background-color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.carousel-btn.prev {
  left: 10px;
}

.carousel-btn.next {
  right: 10px;
}

.confirm-btn {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 1.1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.confirm-btn:hover {
  background-color: #45a049;
}

.confirm-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

/* 难度选择界面 */
.select-difficulty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.difficulty-options {
  display: flex;
  gap: 30px;
  margin-bottom: 30px;
  flex-wrap: wrap;
  justify-content: center;
}

.difficulty-option {
  background-color: white;
  border: 2px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  width: 200px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.difficulty-option:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.difficulty-option.active {
  border-color: #4caf50;
  background-color: #f0f8f0;
  box-shadow: 0 8px 16px rgba(76, 175, 80, 0.3);
}

.difficulty-option h3 {
  margin-top: 0;
  color: #333;
}

.difficulty-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 15px;
}

.grid-size {
  font-weight: bold;
  color: #4caf50;
}

.estimated-time {
  color: #666;
  font-size: 0.9rem;
}

.start-btn {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 1.1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.start-btn:hover {
  background-color: #45a049;
}

.start-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

/* 游戏界面 */
.game-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  padding: 15px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  gap: 20px;
  flex-wrap: wrap;
}

.timer,
.success-count {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.timer .label,
.success-count .label {
  font-weight: bold;
  color: #333;
}

.timer .time {
  font-size: 1.5rem;
  font-weight: bold;
  color: #4caf50;
}

.success-count .count {
  font-size: 1.2rem;
  color: #666;
  transition: all 0.3s ease;
}

.success-count .count.updated {
  animation: countUpdate 0.5s ease-in-out;
  color: #4caf50;
  font-weight: bold;
}

.success-count .game-status {
  font-size: 0.9rem;
  padding: 2px 8px;
  border-radius: 10px;
  background-color: #e0e0e0;
  color: #333;
  margin-left: 5px;
  transition: all 0.3s ease;
}

.success-count .game-status.playing {
  background-color: #ffeb3b;
  color: #333;
}

.success-count .game-status.completed {
  background-color: #4caf50;
  color: white;
}

.reset-count-btn {
  background-color: #ff9800;
  color: white;
  border: none;
  padding: 4px 8px;
  font-size: 0.9rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-left: 10px;
}

.reset-count-btn:hover {
  background-color: #f57c00;
}

.reset-count-btn:active {
  transform: translateY(1px);
}

@keyframes countUpdate {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.back-btn,
.reset-btn {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-btn:hover,
.reset-btn:hover {
  background-color: #da190b;
}

.back-btn {
  background-color: #2196f3;
}

.back-btn:hover {
  background-color: #0b7dda;
}

.game-main {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
}

.game-area {
  position: relative;
  width: calc(100% - 320px);
  min-width: 800px;
  height: 610px;
  background-color: #fafafa;
  border: 4px solid #2196f3;
  /* border-radius: 8px; */
  overflow: visible;
  display: flex;
  align-items: flex-start;
  box-sizing: border-box;
}

.puzzle-area {
  position: relative;
  width: 600px;
  height: 606px;
  background-color: #f0f0f0;
  border: 4px solid #4caf50;
  /* border-radius: 8px; */
  overflow: visible;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  cursor: grab;
  margin-left: auto;
  box-sizing: border-box;
}

.puzzle-area:active {
  cursor: grabbing;
}

.puzzle-piece {
  position: absolute;
  border: 2px solid #333333;
  cursor: move;
  box-sizing: border-box;
  background-repeat: no-repeat;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.puzzle-piece.is-selected {
  border: 2px solid #4caf50;
  box-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
  z-index: 10;
}

.sidebar {
  width: 300px;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.preview-section,
.progress-section,
.instructions-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.preview-section h3,
.progress-section h3,
.instructions-section h3 {
  margin-top: 0;
  color: #333;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.preview-container {
  width: 100%;
  height: 200px;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.preview-container:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.progress-bar {
  width: 100%;
  height: 20px;
  background-color: #f0f0f0;
  border-radius: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #4caf50;
  transition: width 0.3s ease;
}

.progress-text {
  text-align: center;
  font-weight: bold;
  color: #4caf50;
  font-size: 1.2rem;
}

.instructions-content {
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.instructions-content ul {
  margin: 0;
  padding-left: 20px;
}

.instructions-content li {
  margin-bottom: 5px;
  color: #666;
}

.toggle-icon {
  font-size: 0.8rem;
  color: #666;
}

/* 退出提示 */
.exit-confirm-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.exit-confirm-modal {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  text-align: center;
  max-width: 400px;
  width: 90%;
}

.exit-confirm-modal h3 {
  margin-top: 0;
  color: #f44336;
}

.exit-confirm-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 20px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.btn.continue {
  background-color: #4caf50;
  color: white;
}

.btn.continue:hover {
  background-color: #45a049;
}

.btn.exit {
  background-color: #f44336;
  color: white;
}

.btn.exit:hover {
  background-color: #da190b;
}

.btn.play-again {
  background-color: #4caf50;
  color: white;
  margin-top: 20px;
  padding: 12px 24px;
  font-size: 1.1rem;
}

.btn.play-again:hover {
  background-color: #45a049;
}

/* 完成庆祝 */
.completion-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.completion-content {
  text-align: center;
  z-index: 1001;
}

.celebration-text {
  font-size: 3rem;
  color: white;
  margin-bottom: 20px;
  animation: fadeIn 1s ease-in;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.completion-time {
  font-size: 2rem;
  color: #4caf50;
  margin-bottom: 30px;
  font-weight: bold;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .game-main {
    flex-direction: column;
    align-items: center;
  }

  .sidebar {
    width: 100%;
    max-width: 600px;
  }
}

@media (max-width: 768px) {
  .jigsaw-container {
    padding: 10px;
  }

  .image-carousel {
    width: 100%;
    max-width: 500px;
  }

  .carousel-items {
    gap: 10px;
  }

  .carousel-item {
    flex: 0 0 200px;
  }

  .puzzle-area {
    width: 100%;
    max-width: 400px;
    height: 400px;
  }

  .top-bar {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }

  .difficulty-options {
    flex-direction: column;
    align-items: center;
  }

  .difficulty-option {
    width: 100%;
    max-width: 300px;
  }
}

@media (max-width: 480px) {
  .carousel-item {
    flex: 0 0 150px;
  }

  .puzzle-area {
    max-width: 300px;
    height: 300px;
  }

  .celebration-text {
    font-size: 2rem;
  }

  .completion-time {
    font-size: 1.5rem;
  }
}
</style>
