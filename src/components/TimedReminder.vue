<template>
  <div class="timed-reminder">
    <!-- 提示框 -->
    <div v-if="showReminder" class="modal-overlay" @click="closeReminder">
      <div class="modal-content reminder-modal" @click.stop>
        <div class="modal-header">
          <div class="modal-icon reminder-icon">🌙</div>
          <h3 class="modal-title">温馨提示</h3>
          <button class="close-btn" @click="closeReminder">&times;</button>
        </div>
        <div class="modal-body">
          <p class="time-text">{{ currentTime }}</p>
          <p class="message-text">{{ reminderMessage }}</p>
        </div>
        <div class="modal-footer">
          <button class="confirm-btn reminder-btn" @click="closeReminder">知道啦</button>
        </div>
      </div>
    </div>

    <!-- 警告框 -->
    <div v-if="showWarning" class="modal-overlay" @click="closeWarning">
      <div class="modal-content warning-modal" @click.stop>
        <div class="modal-header">
          <div class="modal-icon warning-icon">⚠️</div>
          <h3 class="modal-title">警告</h3>
          <button class="close-btn" @click="closeWarning">&times;</button>
        </div>
        <div class="modal-body">
          <p class="message-text">{{ warningMessage }}</p>
        </div>
        <div class="modal-footer">
          <button class="confirm-btn warning-btn" @click="closeWarning">我错了</button>
        </div>
      </div>
    </div>

    <!-- 权限引导 -->
    <div v-if="showPermissionGuide" class="modal-overlay" @click="closePermissionGuide">
      <div class="modal-content permission-modal" @click.stop>
        <div class="modal-header">
          <div class="modal-icon permission-icon">🔔</div>
          <h3 class="modal-title">权限设置</h3>
          <button class="close-btn" @click="closePermissionGuide">&times;</button>
        </div>
        <div class="modal-body">
          <p class="message-text">请允许浏览器显示通知，以便接收定时提醒。</p>
          <p class="guide-text">1. 点击浏览器地址栏左侧的锁图标</p>
          <p class="guide-text">2. 在通知权限中选择"允许"</p>
        </div>
        <div class="modal-footer">
          <button class="confirm-btn permission-btn" @click="requestNotificationPermission">
            立即设置
          </button>
          <button class="cancel-btn" @click="closePermissionGuide">稍后再说</button>
        </div>
      </div>
    </div>

    <!-- 日志查看 -->
    <div v-if="showLogs" class="modal-overlay" @click="closeLogs">
      <div class="modal-content logs-modal" @click.stop>
        <div class="modal-header">
          <div class="modal-icon logs-icon">📋</div>
          <h3 class="modal-title">历史日志</h3>
          <button class="close-btn" @click="closeLogs">&times;</button>
        </div>
        <div class="modal-body logs-body">
          <div class="logs-container">
            <div v-for="(log, index) in logs" :key="index" class="log-item">
              <span class="log-time">{{ formatLogTime(log.time) }}</span>
              <span :class="['log-type', log.type]">{{
                log.type === "reminder" ? "提示" : "警告"
              }}</span>
              <span class="log-status">{{ log.status }}</span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="confirm-btn logs-btn" @click="clearLogs">清空日志</button>
          <button class="cancel-btn" @click="closeLogs">关闭</button>
        </div>
      </div>
    </div>

    <!-- 免打扰设置 -->
    <div class="settings-panel">
      <button class="settings-btn" @click="toggleSettings">⚙️</button>
      <div v-if="showSettings" class="settings-content">
        <div class="setting-item">
          <label for="do-not-disturb">免打扰模式</label>
          <input
            type="checkbox"
            id="do-not-disturb"
            v-model="doNotDisturb"
            @change="saveSettings"
          />
        </div>
        <div class="setting-item">
          <label for="view-logs">查看日志</label>
          <button class="view-logs-btn" @click="showLogs = true">查看</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

// 原始消息常量，用于重置消息内容
const ORIGINAL_REMINDER_MESSAGE = "🤗时间不早啦，该睡觉觉咯😴，明天再来探索吧！🐼";
const ORIGINAL_WARNING_MESSAGE = "我要生气了💢，快去睡觉❗❗❗，我相信你是最乖的好宝宝😘";

// 状态管理
const showReminder = ref(false);
const showWarning = ref(false);
const showPermissionGuide = ref(false);
const showLogs = ref(false);
const showSettings = ref(false);
const doNotDisturb = ref(false);
const currentTime = ref("");
const reminderMessage = ref(ORIGINAL_REMINDER_MESSAGE);
const warningMessage = ref(ORIGINAL_WARNING_MESSAGE);

// 日志管理
const logs = ref([]);
const MAX_LOGS = 20; // 最大日志数量

// 定时器管理
let reminderTimer = null;
let warningTimer = null;
let backgroundTimer = null;

// 计算当前时间格式
const formatDateTime = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// 格式化日志时间（UTC转本地时间）
const formatLogTime = (isoTime) => {
  const date = new Date(isoTime);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// 记录日志
const logEvent = (type, status) => {
  const log = {
    time: new Date().toISOString(),
    type,
    status,
  };
  logs.value.unshift(log);

  // 日志轮转
  if (logs.value.length > MAX_LOGS) {
    logs.value = logs.value.slice(0, MAX_LOGS);
  }

  // 本地存储
  localStorage.setItem("timedReminderLogs", JSON.stringify(logs.value));
};

// 显示提示框
const showReminderModal = () => {
  if (doNotDisturb.value) {
    logEvent("reminder", "被免打扰模式阻止");
    return;
  }

  const now = new Date();
  currentTime.value = formatDateTime(now);
  // 添加前缀：现在已经“系统时间”了
  const timePrefix = `现在已经“${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes()
  ).padStart(2, "0")}”了`;
  reminderMessage.value = `${timePrefix}${reminderMessage.value}`;
  showReminder.value = true;
  logEvent("reminder", "成功显示");
};

// 显示警告框
const showWarningModal = () => {
  if (doNotDisturb.value) {
    logEvent("warning", "被免打扰模式阻止");
    return;
  }

  const now = new Date();
  // 添加前缀：现在已经“系统时间”了
  const timePrefix = `⏱️已经“${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes()
  ).padStart(2, "0")}”哟，`;
  warningMessage.value = `${timePrefix}${warningMessage.value}`;
  showWarning.value = true;
  logEvent("warning", "成功显示");
};

// 关闭提示框
const closeReminder = () => {
  showReminder.value = false;
  // 重置消息内容
  reminderMessage.value = ORIGINAL_REMINDER_MESSAGE;
  logEvent("reminder", "用户关闭");
};

// 关闭警告框
const closeWarning = () => {
  showWarning.value = false;
  // 重置消息内容
  warningMessage.value = ORIGINAL_WARNING_MESSAGE;
  logEvent("warning", "用户关闭");
};

// 关闭权限引导
const closePermissionGuide = () => {
  showPermissionGuide.value = false;
};

// 关闭日志
const closeLogs = () => {
  showLogs.value = false;
};

// 清空日志
const clearLogs = () => {
  logs.value = [];
  localStorage.removeItem("timedReminderLogs");
};

// 请求通知权限
const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      logEvent("system", "通知权限已授予");
    } else {
      logEvent("system", "通知权限被拒绝");
    }
    // 无论权限结果如何，都关闭弹窗
    closePermissionGuide();
  } catch (error) {
    logEvent("system", `请求权限失败: ${error.message}`);
    // 出错时也关闭弹窗
    closePermissionGuide();
  }
};

// 检测通知权限
const checkNotificationPermission = () => {
  if (!("Notification" in window)) {
    logEvent("system", "浏览器不支持通知");
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  } else if (Notification.permission === "denied") {
    showPermissionGuide.value = true;
    logEvent("system", "通知权限已被拒绝");
    return false;
  } else {
    requestNotificationPermission();
    return false;
  }
};

// 计算下一次提醒时间
const calculateNextReminderTime = () => {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();

  // 每日21:00至23:59，每30分钟一次
  if (hour >= 21 && hour < 24) {
    // 计算当前小时内的下一个30分钟点
    let nextMinute, nextHour;
    if (minute < 30) {
      nextMinute = 30;
      nextHour = hour;
    } else if (minute < 60) {
      nextMinute = 0;
      nextHour = hour + 1;
    } else {
      nextMinute = 0;
      nextHour = hour + 1;
    }

    // 如果超过23:59，设置为明天21:00
    if (nextHour >= 24) {
      const nextDay = new Date(now);
      nextDay.setDate(nextDay.getDate() + 1);
      nextDay.setHours(21, 0, 0, 0);
      return nextDay;
    }

    const nextTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      nextHour,
      nextMinute,
      0,
      0
    );

    // 确保下次提醒时间在当前时间之后
    if (nextTime <= now) {
      if (nextHour === 23 && nextMinute === 0) {
        // 如果是23:00，下一次是23:30
        return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 30, 0, 0);
      } else if (nextHour === 23 && nextMinute === 30) {
        // 如果是23:30，下一次是明天21:00
        const nextDay = new Date(now);
        nextDay.setDate(nextDay.getDate() + 1);
        nextDay.setHours(21, 0, 0, 0);
        return nextDay;
      } else {
        // 其他情况，下一次是下一个30分钟点
        return new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          nextHour + 1,
          nextMinute === 0 ? 30 : 0,
          0,
          0
        );
      }
    }

    return nextTime;
  } else {
    // 设置为今天21:00
    const today21 = new Date(now);
    today21.setHours(21, 0, 0, 0);

    // 如果今天21:00已过，设置为明天21:00
    if (today21 <= now) {
      today21.setDate(today21.getDate() + 1);
    }

    return today21;
  }
};

// 计算下一次警告时间
const calculateNextWarningTime = () => {
  const now = new Date();
  const hour = now.getHours();

  // 每日0:00至6:00，每小时一次，最后一次在5:00
  if (hour >= 0 && hour < 6) {
    // 下一个小时
    const nextHour = hour + 1;

    // 如果超过6:00，设置为明天0:00
    if (nextHour >= 6) {
      const nextDay = new Date(now);
      nextDay.setDate(nextDay.getDate() + 1);
      nextDay.setHours(0, 0, 0, 0);
      return nextDay;
    }

    const nextTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), nextHour, 0, 0, 0);

    // 确保下次警告时间在当前时间之后
    if (nextTime <= now) {
      if (nextHour === 5) {
        // 如果是5:00，下一次是明天0:00
        const nextDay = new Date(now);
        nextDay.setDate(nextDay.getDate() + 1);
        nextDay.setHours(0, 0, 0, 0);
        return nextDay;
      } else {
        // 其他情况，下一次是下一个小时
        return new Date(now.getFullYear(), now.getMonth(), now.getDate(), nextHour + 1, 0, 0, 0);
      }
    }

    return nextTime;
  } else {
    // 设置为今天0:00
    const today0 = new Date(now);
    today0.setHours(0, 0, 0, 0);

    // 如果今天0:00已过，设置为明天0:00
    if (today0 <= now) {
      today0.setDate(today0.getDate() + 1);
    }

    return today0;
  }
};

// 检查是否需要立即触发提醒
const checkImmediateReminder = () => {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();

  logEvent("system", `检查是否需要立即触发提醒: ${formatDateTime(now)}`);

  // 检查是否在提醒时段（21:00-23:59）
  if (hour >= 21 && hour < 24) {
    logEvent("system", `当前时间在提醒时段内: ${hour}:${minute}`);
    // 检查是否在30分钟的整数倍
    if (minute === 0 || minute === 30) {
      logEvent("system", `分钟为30的整数倍，触发提醒: ${minute}`);
      showReminderModal();
    }
  }

  // 检查是否在警告时段（0:00-6:00）
  if (hour >= 0 && hour < 6) {
    logEvent("system", `当前时间在警告时段内: ${hour}:${minute}`);
    // 检查是否在整点
    if (minute === 0) {
      logEvent("system", `分钟为0，触发警告: ${minute}`);
      showWarningModal();
    }
  }
};

// 启动提醒定时器
const startReminderTimer = () => {
  // 清除现有定时器
  if (reminderTimer) {
    clearTimeout(reminderTimer);
  }

  // 计算下一次提醒时间
  const nextReminder = calculateNextReminderTime();
  const now = new Date();
  const delay = nextReminder - now;

  logEvent("system", `提醒定时器已设置，下次触发时间: ${formatDateTime(nextReminder)}`);

  // 设置定时器，确保延迟时间为正数
  reminderTimer = setTimeout(() => {
    showReminderModal();
    // 递归调用，继续设置下一次提醒
    startReminderTimer();
  }, Math.max(delay, 0));
};

// 启动警告定时器
const startWarningTimer = () => {
  // 清除现有定时器
  if (warningTimer) {
    clearTimeout(warningTimer);
  }

  // 计算下一次警告时间
  const nextWarning = calculateNextWarningTime();
  const now = new Date();
  const delay = nextWarning - now;

  logEvent("system", `警告定时器已设置，下次触发时间: ${formatDateTime(nextWarning)}`);

  // 设置定时器，确保延迟时间为正数
  warningTimer = setTimeout(() => {
    showWarningModal();
    // 递归调用，继续设置下一次警告
    startWarningTimer();
  }, Math.max(delay, 0));
};

// 后台任务检查
const checkBackgroundTasks = () => {
  // 检查是否需要重新设置定时器
  checkImmediateReminder();
  startReminderTimer();
  startWarningTimer();
};

// 保存设置
const saveSettings = () => {
  localStorage.setItem(
    "timedReminderSettings",
    JSON.stringify({
      doNotDisturb: doNotDisturb.value,
    })
  );
  logEvent("system", `设置已保存: 免打扰模式=${doNotDisturb.value}`);
};

// 加载设置
const loadSettings = () => {
  const settings = localStorage.getItem("timedReminderSettings");
  if (settings) {
    const parsedSettings = JSON.parse(settings);
    doNotDisturb.value = parsedSettings.doNotDisturb || false;
  }
};

// 加载日志
const loadLogs = () => {
  const savedLogs = localStorage.getItem("timedReminderLogs");
  if (savedLogs) {
    logs.value = JSON.parse(savedLogs);
  }
};

// 切换设置面板
const toggleSettings = () => {
  showSettings.value = !showSettings.value;
};

// 组件挂载时初始化
onMounted(() => {
  // 加载设置和日志
  loadSettings();
  loadLogs();

  // 检查通知权限
  checkNotificationPermission();

  // 启动定时器
  startReminderTimer();
  startWarningTimer();

  // 设置后台任务检查（每5分钟检查一次）
  backgroundTimer = setInterval(checkBackgroundTasks, 5 * 60 * 1000);

  // 监听系统时间变化
  window.addEventListener("timeupdate", checkBackgroundTasks);

  logEvent("system", "定时提醒功能已启动");
  logEvent("system", `当前系统时间: ${formatDateTime(new Date())}`);

  // 页面加载弹窗功能：每次页面加载时，5秒后自动弹窗
  // 设置定时器，5秒后自动弹窗
  setTimeout(() => {
    const now = new Date();
    const hour = now.getHours();

    // 根据当前时间判断显示提醒还是警告
    if (hour >= 21 && hour < 24) {
      // 提醒时段
      showReminderModal();
    } else if (hour >= 0 && hour < 6) {
      // 警告时段
      showWarningModal();
    } else {
      // 其他时段，默认显示提醒
      showReminderModal();
    }
  }, 5000); // 5秒后弹窗
});

// 组件卸载时清理
onUnmounted(() => {
  // 清除所有定时器
  if (reminderTimer) {
    clearTimeout(reminderTimer);
  }
  if (warningTimer) {
    clearTimeout(warningTimer);
  }
  if (backgroundTimer) {
    clearInterval(backgroundTimer);
  }

  // 移除事件监听
  window.removeEventListener("timeupdate", checkBackgroundTasks);

  logEvent("system", "定时提醒功能已关闭");
});
</script>

<style scoped>
/* 全局样式 */
.timed-reminder {
  position: relative;
  z-index: 1000;
}

/* 模态遮罩 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;
}

/* 模态窗口 */
.modal-content {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  animation: modalFadeIn 0.3s ease-out;
  display: flex;
  flex-direction: column;
  max-height: 80vh;
}

/* 提示框样式 */
.reminder-modal {
  border-left: 5px solid #4ade80;
  background-color: #f0fdf4;
}

/* 警告框样式 */
.warning-modal {
  border-left: 5px solid #f87171;
  background-color: #fef2f2;
}

/* 权限引导框样式 */
.permission-modal {
  border-left: 5px solid #3b82f6;
  background-color: #eff6ff;
}

/* 日志框样式 */
.logs-modal {
  border-left: 5px solid #6b7280;
  background-color: #f9fafb;
}

/* 模态窗口头部 */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e5e7eb;
}

/* 模态窗口图标 */
.modal-icon {
  font-size: 24px;
  margin-right: 10px;
}

.reminder-icon {
  color: #4ade80;
}

.warning-icon {
  color: #f87171;
}

.permission-icon {
  color: #3b82f6;
}

.logs-icon {
  color: #6b7280;
}

/* 模态窗口标题 */
.modal-title {
  flex: 1;
  margin: 0;
  font-size: 20px;
  font-weight: bold;
}

.reminder-modal .modal-title {
  color: #166534;
}

.warning-modal .modal-title {
  color: #991b1b;
}

.permission-modal .modal-title {
  color: #1d4ed8;
}

.logs-modal .modal-title {
  color: #374151;
}

/* 关闭按钮 */
.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6b7280;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background-color: #e5e7eb;
}

/* 模态窗口内容 */
.modal-body {
  margin-bottom: 20px;
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* 日志内容区 */
.logs-body {
  flex: 1;
  overflow-y: auto;
  max-height: none;
}

.logs-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.log-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  font-size: 14px;
}

.log-time {
  flex: 1;
  color: #6b7280;
}

.log-type {
  padding: 4px 8px;
  border-radius: 12px;
  font-weight: bold;
  text-align: center;
  min-width: 40px;
}

.log-type.reminder {
  background-color: #dcfce7;
  color: #166534;
}

.log-type.warning {
  background-color: #fee2e2;
  color: #991b1b;
}

.log-status {
  flex: 1;
  text-align: right;
  color: #6b7280;
}

/* 时间文本 */
.time-text {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #374151;
}

/* 消息文本 */
.message-text {
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 10px;
  color: #374151;
}

/* 引导文本 */
.guide-text {
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 5px;
  color: #6b7280;
  padding-left: 20px;
  position: relative;
}

.guide-text::before {
  content: "•";
  position: absolute;
  left: 0;
  color: #3b82f6;
  font-weight: bold;
}

/* 模态窗口底部 */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 15px;
  border-top: 1px solid #e5e7eb;
}

/* 按钮样式 */
.confirm-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: all 0.2s;
}

.reminder-btn {
  background-color: #4ade80;
  color: white;
}

.reminder-btn:hover {
  background-color: #22c55e;
}

.warning-btn {
  background-color: #f87171;
  color: white;
}

.warning-btn:hover {
  background-color: #ef4444;
}

.permission-btn {
  background-color: #3b82f6;
  color: white;
}

.permission-btn:hover {
  background-color: #2563eb;
}

.logs-btn {
  background-color: #6b7280;
  color: white;
}

.logs-btn:hover {
  background-color: #4b5563;
}

.cancel-btn {
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  background-color: white;
  color: #374151;
  transition: all 0.2s;
}

.cancel-btn:hover {
  background-color: #f3f4f6;
}

/* 设置面板 */
.settings-panel {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 999;
}

/* 设置按钮 */
.settings-btn {
  /* 增大尺寸和内边距 */
  padding: 15px;
  width: 50px;
  height: 50px;
  /* 确保图标居中 */
  display: flex;
  align-items: center;
  justify-content: center;
  /* 基础样式 */
  border: none;
  border-radius: 50%;
  /* 渐变背景增强立体感 */
  background: linear-gradient(145deg, #4361ee, #3b82f6);
  color: white;
  font-size: 24px;
  cursor: pointer;
  /* 多层阴影增强立体感 */
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3);
  /* 平滑过渡 */
  transition: all 0.3s ease;
}

.settings-btn:hover {
  /* 悬停时的渐变变化 */
  background: linear-gradient(145deg, #3b82f6, #4361ee);
  /* 增强阴影和提升效果 */
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.4);
  /* 轻微放大和上移 */
  transform: translateY(-3px) scale(1.05);
}

.settings-btn:active {
  /* 点击时的按压效果 */
  transform: translateY(1px) scale(0.98);
  /* 减弱阴影，营造按压感 */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

/* 设置内容 */
.settings-content {
  position: absolute;
  bottom: 60px;
  right: 0;
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  border: 1px solid #e5e7eb;
}

/* 设置项 */
.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f3f4f6;
}

.setting-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

/* 设置项标签 */
.setting-item label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

/* 查看日志按钮 */
.view-logs-btn {
  padding: 5px 10px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  background-color: white;
  color: #374151;
  transition: all 0.2s;
}

.view-logs-btn:hover {
  background-color: #f3f4f6;
}

/* 动画效果 */
@keyframes modalFadeIn {
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
@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    margin: 10px;
  }

  .modal-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .modal-footer {
    flex-direction: column;
  }

  .settings-panel {
    bottom: 10px;
    right: 10px;
  }

  .settings-content {
    bottom: 50px;
    right: 0;
    min-width: 150px;
  }
}
</style>
