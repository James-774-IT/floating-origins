import { ref, computed } from "vue";

// 全屏状态管理器
export const fullscreenManager = {
  // 核心状态
  isFullscreen: ref(false),
  isTransitioning: ref(false),
  error: ref(null),

  // 滚动位置保存
  scrollPositions: ref(new Map()),

  // 可滚动元素选择器
  scrollableSelectors: [".playlist-items", ".page-content", "html", "body"],

  // 获取所有可滚动元素
  getScrollableElements() {
    const elements = new Set();

    this.scrollableSelectors.forEach((selector) => {
      const foundElements = document.querySelectorAll(selector);
      foundElements.forEach((el) => {
        if (this.isActuallyScrollable(el)) {
          elements.add(el);
        }
      });
    });

    return Array.from(elements);
  },

  // 检查元素是否真的可滚动
  isActuallyScrollable(element) {
    if (element.offsetHeight === 0 || element.offsetWidth === 0) {
      return false;
    }

    const isVerticallyScrollable = element.scrollHeight > element.clientHeight;
    const isHorizontallyScrollable = element.scrollWidth > element.clientWidth;

    return isVerticallyScrollable || isHorizontallyScrollable;
  },

  // 保存所有滚动位置
  saveScrollPositions() {
    const elements = this.getScrollableElements();
    const positions = new Map();

    elements.forEach((el) => {
      const id = this.getElementId(el);
      positions.set(id, {
        scrollTop: el.scrollTop,
        scrollLeft: el.scrollLeft,
        element: el,
      });
    });

    this.scrollPositions.value = positions;
    return positions;
  },

  // 恢复所有滚动位置
  restoreScrollPositions() {
    const positions = this.scrollPositions.value;

    if (positions.size === 0) return;

    positions.forEach((pos, id) => {
      if (pos.element && pos.element.scrollTop !== undefined) {
        pos.element.scrollTop = pos.scrollTop;
        pos.element.scrollLeft = pos.scrollLeft;
        return;
      }

      // 尝试通过ID或XPath重新获取元素
      const element = this.getElementById(id) || this.getElementByXPath(id.replace("xpath:", ""));
      if (element && element.scrollTop !== undefined) {
        element.scrollTop = pos.scrollTop;
        element.scrollLeft = pos.scrollLeft;
      }
    });
  },

  // 获取元素唯一标识符
  getElementId(element) {
    if (element.id) {
      return `id:${element.id}`;
    }

    if (element === document.body) {
      return "xpath:/html/body";
    }

    if (element === document.documentElement) {
      return "xpath:/html";
    }

    return `xpath:${this.getElementXPath(element)}`;
  },

  // 通过ID获取元素
  getElementById(id) {
    if (id.startsWith("id:")) {
      return document.getElementById(id.replace("id:", ""));
    }
    return null;
  },

  // 获取元素XPath
  getElementXPath(element) {
    if (element === document || element === document.documentElement) {
      return "/html";
    }

    let path = "";
    let current = element;

    while (current && current.nodeType === Node.ELEMENT_NODE) {
      let index = 0;
      let sibling = current.previousSibling;

      while (sibling) {
        if (sibling.nodeType === Node.ELEMENT_NODE && sibling.tagName === current.tagName) {
          index++;
        }
        sibling = sibling.previousSibling;
      }

      const tagName = current.tagName.toLowerCase();
      const pathSegment = index > 0 ? `${tagName}[${index + 1}]` : tagName;
      path = `/${pathSegment}${path}`;

      current = current.parentNode;
    }

    return path;
  },

  // 通过XPath获取元素
  getElementByXPath(xpath) {
    try {
      const result = document.evaluate(
        xpath,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      );
      return result.singleNodeValue;
    } catch (error) {
      console.error("Error getting element by XPath:", error);
      return null;
    }
  },

  // 清除错误
  clearError() {
    this.error.value = null;
  },
};

// 浏览器兼容性处理
export const fullscreenAPI = {
  // 进入全屏
  async requestFullscreen(element) {
    if (element.requestFullscreen) {
      await element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
      await element.webkitRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
      await element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) {
      await element.msRequestFullscreen();
    } else {
      throw new Error("Fullscreen API is not supported by this browser");
    }
  },

  // 退出全屏
  async exitFullscreen() {
    if (document.exitFullscreen) {
      await document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      await document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      await document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      await document.msExitFullscreen();
    } else {
      throw new Error("Fullscreen API is not supported by this browser");
    }
  },

  // 获取全屏元素
  getFullscreenElement() {
    return (
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    );
  },

  // 检查是否支持全屏
  isFullscreenEnabled() {
    return (
      document.fullscreenEnabled ||
      document.webkitFullscreenEnabled ||
      document.mozFullScreenEnabled ||
      document.msFullscreenEnabled
    );
  },

  // 添加全屏变化事件监听
  addFullscreenChangeListener(callback) {
    document.addEventListener("fullscreenchange", callback);
    document.addEventListener("webkitfullscreenchange", callback);
    document.addEventListener("mozfullscreenchange", callback);
    document.addEventListener("MSFullscreenChange", callback);
  },

  // 移除全屏变化事件监听
  removeFullscreenChangeListener(callback) {
    document.removeEventListener("fullscreenchange", callback);
    document.removeEventListener("webkitfullscreenchange", callback);
    document.removeEventListener("mozfullscreenchange", callback);
    document.removeEventListener("MSFullscreenChange", callback);
  },
};

// 计算属性
export const isFullscreen = computed(() => fullscreenManager.isFullscreen.value);
export const isTransitioning = computed(() => fullscreenManager.isTransitioning.value);
export const error = computed(() => fullscreenManager.error.value);
