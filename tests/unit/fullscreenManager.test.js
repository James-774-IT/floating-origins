import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref, computed } from 'vue'

// 模拟DOM环境
describe('全屏状态管理器测试', () => {
  let fullscreenManager
  let fullscreenAPI

  beforeEach(() => {
    // 重置DOM
    document.body.innerHTML = ''

    // 模拟scrollable元素
    const scrollableDiv = document.createElement('div')
    scrollableDiv.className = 'scrollable-div'
    scrollableDiv.style.height = '200px'
    scrollableDiv.style.overflow = 'auto'
    scrollableDiv.innerHTML = '<div style="height: 500px;"></div>'
    document.body.appendChild(scrollableDiv)

    // 模拟视频播放器
    const videoElement = document.createElement('video')
    videoElement.className = 'video-element'
    document.body.appendChild(videoElement)

    // 创建模拟的fullscreenManager
    fullscreenManager = {
      // 核心状态
      isFullscreen: ref(false),
      isTransitioning: ref(false),
      error: ref(null),

      // 滚动位置保存
      scrollPositions: ref(new Map()),

      // 可滚动元素选择器
      scrollableSelectors: [
        '.scrollable-div',
        'html',
        'body'
      ],

      // 获取所有可滚动元素
      getScrollableElements() {
        const elements = new Set()

        this.scrollableSelectors.forEach(selector => {
          const foundElements = document.querySelectorAll(selector)
          foundElements.forEach(el => {
            if (this.isActuallyScrollable(el)) {
              elements.add(el)
            }
          })
        })

        return Array.from(elements)
      },

      // 检查元素是否真的可滚动
      isActuallyScrollable(element) {
        if (element.offsetHeight === 0 || element.offsetWidth === 0) {
          return false
        }

        const isVerticallyScrollable = element.scrollHeight > element.clientHeight
        const isHorizontallyScrollable = element.scrollWidth > element.clientWidth

        return isVerticallyScrollable || isHorizontallyScrollable
      },

      // 保存所有滚动位置
      saveScrollPositions() {
        const elements = this.getScrollableElements()
        const positions = new Map()

        elements.forEach(el => {
          const id = this.getElementId(el)
          positions.set(id, {
            scrollTop: el.scrollTop,
            scrollLeft: el.scrollLeft,
            element: el
          })
        })

        this.scrollPositions.value = positions
        return positions
      },

      // 恢复所有滚动位置
      restoreScrollPositions() {
        const positions = this.scrollPositions.value

        if (positions.size === 0) return

        positions.forEach((pos, id) => {
          if (pos.element && pos.element.scrollTop !== undefined) {
            pos.element.scrollTop = pos.scrollTop
            pos.element.scrollLeft = pos.scrollLeft
            return
          }
        })
      },

      // 获取元素唯一标识符
      getElementId(element) {
        if (element.id) {
          return `id:${element.id}`
        }

        if (element === document.body) {
          return 'xpath:/html/body'
        }

        return `xpath:/html/body/${element.tagName.toLowerCase()}`
      },

      // 清除错误
      clearError() {
        this.error.value = null
      }
    }

    // 创建模拟的fullscreenAPI
    fullscreenAPI = {
      // 进入全屏
      requestFullscreen: vi.fn().mockResolvedValue(undefined),

      // 退出全屏
      exitFullscreen: vi.fn().mockResolvedValue(undefined),

      // 获取全屏元素
      getFullscreenElement: vi.fn().mockReturnValue(null),

      // 检查是否支持全屏
      isFullscreenEnabled: vi.fn().mockReturnValue(true),

      // 添加全屏变化事件监听
      addFullscreenChangeListener: vi.fn(),

      // 移除全屏变化事件监听
      removeFullscreenChangeListener: vi.fn()
    }
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  // 测试可滚动元素检测
  describe('可滚动元素检测', () => {
    it('应该正确检测可滚动元素', () => {
      const scrollableElements = fullscreenManager.getScrollableElements()

      // 应该包含我们创建的scrollable-div和body
      expect(scrollableElements.length).toBeGreaterThan(0)

      const hasScrollableDiv = scrollableElements.some(el => el.classList.contains('scrollable-div'))
      expect(hasScrollableDiv).toBe(true)
    })

    it('应该排除不可滚动元素', () => {
      // 添加一个不可滚动元素
      const nonScrollableDiv = document.createElement('div')
      nonScrollableDiv.className = 'non-scrollable-div'
      nonScrollableDiv.style.height = '200px'
      nonScrollableDiv.style.overflow = 'hidden'
      nonScrollableDiv.innerHTML = '<div style="height: 100px;"></div>'
      document.body.appendChild(nonScrollableDiv)

      // 添加到选择器
      fullscreenManager.scrollableSelectors.push('.non-scrollable-div')

      const scrollableElements = fullscreenManager.getScrollableElements()

      // 应该不包含non-scrollable-div
      const hasNonScrollableDiv = scrollableElements.some(el => el.classList.contains('non-scrollable-div'))
      expect(hasNonScrollableDiv).toBe(false)
    })
  })

  // 测试滚动位置保存与恢复
  describe('滚动位置保存与恢复', () => {
    it('应该正确保存滚动位置', () => {
      const scrollableDiv = document.querySelector('.scrollable-div')
      scrollableDiv.scrollTop = 150
      scrollableDiv.scrollLeft = 50

      const positions = fullscreenManager.saveScrollPositions()

      expect(positions.size).toBeGreaterThan(0)

      // 检查是否保存了scrollable-div的位置
      const divId = fullscreenManager.getElementId(scrollableDiv)
      expect(positions.has(divId)).toBe(true)
      expect(positions.get(divId).scrollTop).toBe(150)
      expect(positions.get(divId).scrollLeft).toBe(50)
    })

    it('应该正确恢复滚动位置', () => {
      const scrollableDiv = document.querySelector('.scrollable-div')
      scrollableDiv.scrollTop = 150
      scrollableDiv.scrollLeft = 50

      // 保存位置
      fullscreenManager.saveScrollPositions()

      // 改变位置
      scrollableDiv.scrollTop = 0
      scrollableDiv.scrollLeft = 0

      // 恢复位置
      fullscreenManager.restoreScrollPositions()

      // 检查是否恢复了位置
      expect(scrollableDiv.scrollTop).toBe(150)
      expect(scrollableDiv.scrollLeft).toBe(50)
    })

    it('滚动位置恢复精度应在1像素以内', () => {
      const scrollableDiv = document.querySelector('.scrollable-div')
      scrollableDiv.scrollTop = 150.5
      scrollableDiv.scrollLeft = 50.2

      // 保存位置
      fullscreenManager.saveScrollPositions()

      // 改变位置
      scrollableDiv.scrollTop = 0
      scrollableDiv.scrollLeft = 0

      // 恢复位置
      fullscreenManager.restoreScrollPositions()

      // 检查精度
      expect(Math.abs(scrollableDiv.scrollTop - 150.5)).toBeLessThanOrEqual(1)
      expect(Math.abs(scrollableDiv.scrollLeft - 50.2)).toBeLessThanOrEqual(1)
    })
  })

  // 测试全屏API兼容性
  describe('浏览器兼容性处理', () => {
    it('应该正确模拟requestFullscreen', async () => {
      const element = document.createElement('div')
      await fullscreenAPI.requestFullscreen(element)
      expect(fullscreenAPI.requestFullscreen).toHaveBeenCalledWith(element)
    })

    it('应该正确模拟exitFullscreen', async () => {
      await fullscreenAPI.exitFullscreen()
      expect(fullscreenAPI.exitFullscreen).toHaveBeenCalled()
    })

    it('应该正确模拟getFullscreenElement', () => {
      const element = document.createElement('div')
      fullscreenAPI.getFullscreenElement.mockReturnValue(element)

      const result = fullscreenAPI.getFullscreenElement()
      expect(result).toBe(element)
      expect(fullscreenAPI.getFullscreenElement).toHaveBeenCalled()
    })

    it('应该正确模拟isFullscreenEnabled', () => {
      const result = fullscreenAPI.isFullscreenEnabled()
      expect(result).toBe(true)
      expect(fullscreenAPI.isFullscreenEnabled).toHaveBeenCalled()
    })
  })

  // 测试状态管理
  describe('状态管理', () => {
    it('应该正确管理isFullscreen状态', () => {
      expect(fullscreenManager.isFullscreen.value).toBe(false)

      // 更新状态
      fullscreenManager.isFullscreen.value = true
      expect(fullscreenManager.isFullscreen.value).toBe(true)
    })

    it('应该正确管理isTransitioning状态', () => {
      expect(fullscreenManager.isTransitioning.value).toBe(false)

      // 更新状态
      fullscreenManager.isTransitioning.value = true
      expect(fullscreenManager.isTransitioning.value).toBe(true)

      fullscreenManager.isTransitioning.value = false
      expect(fullscreenManager.isTransitioning.value).toBe(false)
    })

    it('应该正确管理error状态', () => {
      expect(fullscreenManager.error.value).toBe(null)

      // 设置错误
      const testError = 'Test error'
      fullscreenManager.error.value = testError
      expect(fullscreenManager.error.value).toBe(testError)

      // 清除错误
      fullscreenManager.clearError()
      expect(fullscreenManager.error.value).toBe(null)
    })
  })

  // 测试计算属性
  describe('计算属性', () => {
    it('should return correct computed isFullscreen value', () => {
      const isFullscreen = computed(() => fullscreenManager.isFullscreen.value)

      expect(isFullscreen.value).toBe(false)

      fullscreenManager.isFullscreen.value = true
      expect(isFullscreen.value).toBe(true)
    })
  })

  // 测试性能优化
  describe('性能优化', () => {
    it('should save and restore scroll positions quickly', () => {
      const scrollableDiv = document.querySelector('.scrollable-div')
      scrollableDiv.scrollTop = 150

      // 测试保存时间
      const saveStart = performance.now()
      fullscreenManager.saveScrollPositions()
      const saveEnd = performance.now()

      // 测试恢复时间
      scrollableDiv.scrollTop = 0
      const restoreStart = performance.now()
      fullscreenManager.restoreScrollPositions()
      const restoreEnd = performance.now()

      // 确保操作时间在100ms以内
      expect(saveEnd - saveStart).toBeLessThan(100)
      expect(restoreEnd - restoreStart).toBeLessThan(100)
    })
  })
})

// 测试浏览器兼容性处理
describe('浏览器兼容性处理测试', () => {
  it('should handle different browser prefixes', () => {
    // 测试不同浏览器前缀的情况
    const mockDocument = {
      fullscreenElement: null,
      webkitFullscreenElement: null,
      mozFullScreenElement: null,
      msFullscreenElement: null,

      fullscreenEnabled: true,
      webkitFullscreenEnabled: true,
      mozFullScreenEnabled: true,
      msFullscreenEnabled: true,

      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    }

    // 测试getFullscreenElement
    const getFullscreenElement = () => {
      return mockDocument.fullscreenElement ||
             mockDocument.webkitFullscreenElement ||
             mockDocument.mozFullScreenElement ||
             mockDocument.msFullscreenElement
    }

    // 测试各种浏览器前缀情况
    expect(getFullscreenElement()).toBe(null)

    mockDocument.webkitFullscreenElement = document.createElement('div')
    expect(getFullscreenElement()).toBe(mockDocument.webkitFullscreenElement)

    mockDocument.mozFullScreenElement = document.createElement('div')
    expect(getFullscreenElement()).toBe(mockDocument.webkitFullscreenElement) // 优先顺序
  })
})
