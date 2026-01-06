<template>
  <div class="smart-select" :class="{ 'is-open': isOpen, 'is-disabled': disabled }">
    <div class="smart-select-input-wrapper">
      <input
        ref="inputRef"
        v-model="inputValue"
        type="text"
        :placeholder="placeholder"
        :disabled="disabled"
        class="smart-select-input"
        @focus="handleFocus"
        @blur="handleBlur"
        @input="handleInput"
        @keydown="handleKeydown"
      />
      <svg 
        class="smart-select-arrow" 
        width="16" 
        height="16" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        stroke-width="2"
        @click="toggleDropdown"
      >
        <path d="M6 9l6 6 6-6"/>
      </svg>
    </div>
    <Teleport to="body">
      <div 
        v-if="isOpen && filteredOptions.length > 0" 
        class="smart-select-dropdown"
        :style="dropdownStyle"
      >
        <div
          v-for="(option, index) in filteredOptions"
          :key="index"
          :class="['smart-select-option', { 'is-highlighted': index === highlightedIndex, 'is-matched': option.matched, 'is-disabled': option.disabled }]"
          @mousedown.prevent="!option.disabled && selectOption(option.value)"
          @mouseenter="!option.disabled && (highlightedIndex = index)"
        >
          <span v-html="highlightMatch(option.label, inputValue)"></span>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean],
    default: ''
  },
  options: {
    type: Array,
    required: true,
    validator: (val) => {
      return val.every(opt => typeof opt === 'string' || (typeof opt === 'object' && opt.value !== undefined))
    }
  },
  placeholder: {
    type: String,
    default: '请选择或输入'
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const inputRef = ref(null)
const isOpen = ref(false)
const inputValue = ref('')
const highlightedIndex = ref(0)
const showAllOnClick = ref(false) // 标记是否应该显示所有选项（点击时）
const dropdownStyle = ref({})

// 规范化选项
const normalizedOptions = computed(() => {
  return props.options.map(opt => {
    if (typeof opt === 'string') {
      return { value: opt, label: opt }
    }
    return opt
  })
})

// 过滤选项：匹配的在前，不匹配的在后
const filteredOptions = computed(() => {
  // 如果标记为"点击打开"，显示所有选项
  if (showAllOnClick.value) {
    const searchText = inputValue.value.toLowerCase().trim()
    if (searchText) {
      // 有输入时，仍然显示所有选项，但标记匹配项
      const matched = []
      const unmatched = []
      
      normalizedOptions.value.forEach(opt => {
        const label = String(opt.label || opt.value).toLowerCase()
        const value = String(opt.value).toLowerCase()
        const searchTextField = String(opt.searchText || '').toLowerCase()
        const displayName = String(opt.displayName || '').toLowerCase()
        
        // 支持在 label、value、searchText 和 displayName 中搜索
        if (label.includes(searchText) || value.includes(searchText) || searchTextField.includes(searchText) || displayName.includes(searchText)) {
          matched.push({
            ...opt,
            matched: true
          })
        } else {
          unmatched.push({
            ...opt,
            matched: false
          })
        }
      })
      
      // 匹配的在前，不匹配的在后，但都显示
      return [...matched, ...unmatched]
    } else {
      // 没有输入，显示所有选项
      return normalizedOptions.value.map(opt => ({
        ...opt,
        matched: false
      }))
    }
  }
  
  // 正常过滤模式：根据输入过滤
  const searchText = inputValue.value.toLowerCase().trim()
  
  if (!searchText) {
    // 没有输入时，显示所有选项，标记为未匹配
    return normalizedOptions.value.map(opt => ({
      ...opt,
      matched: false
    }))
  }
  
  const matched = []
  const unmatched = []
  
  normalizedOptions.value.forEach(opt => {
    const label = String(opt.label || opt.value).toLowerCase()
    const value = String(opt.value).toLowerCase()
    const searchTextField = String(opt.searchText || '').toLowerCase()
    const displayName = String(opt.displayName || '').toLowerCase()
    
    // 支持在 label、value、searchText 和 displayName 中搜索
    if (label.includes(searchText) || value.includes(searchText) || searchTextField.includes(searchText) || displayName.includes(searchText)) {
      matched.push({
        ...opt,
        matched: true
      })
    } else {
      unmatched.push({
        ...opt,
        matched: false
      })
    }
  })
  
  // 匹配的在前，不匹配的在后
  return [...matched, ...unmatched]
})

// 高亮匹配文本
const highlightMatch = (text, searchText) => {
  if (!searchText || !text) return text
  
  const regex = new RegExp(`(${searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return String(text).replace(regex, '<mark>$1</mark>')
}

// 更新下拉框位置
const updateDropdownPosition = () => {
  if (!inputRef.value || !isOpen.value) return
  
  nextTick(() => {
    const rect = inputRef.value.getBoundingClientRect()
    dropdownStyle.value = {
      top: `${rect.bottom + window.scrollY + 4}px`,
      left: `${rect.left + window.scrollX}px`,
      width: `${rect.width}px`
    }
  })
}

// 处理输入
const handleInput = (event) => {
  inputValue.value = event.target.value
  emit('update:modelValue', inputValue.value)
  isOpen.value = true
  highlightedIndex.value = 0
  showAllOnClick.value = false // 输入时取消"显示全部"标记
  updateDropdownPosition()
}

// 处理焦点
const handleFocus = () => {
  if (!props.disabled) {
    // 点击输入框时，总是显示所有选项
    showAllOnClick.value = true
    isOpen.value = true
    updateDropdownPosition()
  }
}

// 处理失焦
const handleBlur = () => {
  // 延迟关闭，以便点击选项时能触发
  setTimeout(() => {
    isOpen.value = false
    highlightedIndex.value = 0
    showAllOnClick.value = false
  }, 200)
}

// 切换下拉框
const toggleDropdown = () => {
  if (!props.disabled) {
    const wasOpen = isOpen.value
    isOpen.value = !isOpen.value
    if (isOpen.value && !wasOpen) {
      // 点击箭头打开时，显示所有选项
      showAllOnClick.value = true
      nextTick(() => {
        inputRef.value?.focus()
        updateDropdownPosition()
      })
    } else if (!isOpen.value) {
      showAllOnClick.value = false
    }
  }
}

// 选择选项
const selectOption = (value) => {
  // 查找选中的选项，显示 displayName 或 label
  const option = normalizedOptions.value.find(opt => String(opt.value) === String(value))
  if (option && option.displayName) {
    inputValue.value = option.displayName
  } else if (option && option.label) {
    inputValue.value = option.label
  } else {
    inputValue.value = value
  }
  emit('update:modelValue', value)
  isOpen.value = false
  highlightedIndex.value = 0
}

// 处理键盘事件
const handleKeydown = (event) => {
  if (!isOpen.value || filteredOptions.value.length === 0) return
  
  // 获取可选择的选项（非禁用）
  const selectableOptions = filteredOptions.value.filter(opt => !opt.disabled)
  if (selectableOptions.length === 0) return
  
  // 找到当前高亮选项在可选择选项中的索引
  const currentHighlighted = filteredOptions.value[highlightedIndex.value]
  let currentSelectableIndex = selectableOptions.findIndex(opt => opt === currentHighlighted)
  if (currentSelectableIndex === -1) {
    currentSelectableIndex = 0
  }
  
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      // 找到下一个可选择的选项
      let nextIndex = currentSelectableIndex + 1
      if (nextIndex >= selectableOptions.length) {
        nextIndex = 0
      }
      const nextOption = selectableOptions[nextIndex]
      highlightedIndex.value = filteredOptions.value.findIndex(opt => opt === nextOption)
      break
    case 'ArrowUp':
      event.preventDefault()
      // 找到上一个可选择的选项
      let prevIndex = currentSelectableIndex - 1
      if (prevIndex < 0) {
        prevIndex = selectableOptions.length - 1
      }
      const prevOption = selectableOptions[prevIndex]
      highlightedIndex.value = filteredOptions.value.findIndex(opt => opt === prevOption)
      break
    case 'Enter':
      event.preventDefault()
      if (filteredOptions.value[highlightedIndex.value] && !filteredOptions.value[highlightedIndex.value].disabled) {
        selectOption(filteredOptions.value[highlightedIndex.value].value)
      }
      break
    case 'Escape':
      event.preventDefault()
      isOpen.value = false
      break
  }
}

// 监听外部值变化
watch(() => props.modelValue, (newVal) => {
  // 如果当前 inputValue 对应的 value 与 newVal 相同，不需要更新
  const currentOption = normalizedOptions.value.find(opt => {
    const displayName = opt.displayName || opt.label || ''
    return String(displayName) === String(inputValue.value) && String(opt.value) === String(newVal)
  })
  if (currentOption) {
    return // 已经显示正确的值，不需要更新
  }
  
  // 如果值变化，查找对应的选项并显示 displayName 或 label
  if (!newVal || newVal === '') {
    inputValue.value = ''
    return
  }
  
  const option = normalizedOptions.value.find(opt => String(opt.value) === String(newVal))
  if (option && option.displayName) {
    inputValue.value = option.displayName
  } else if (option && option.label) {
    inputValue.value = option.label
  } else {
    // 如果找不到选项，保持当前值或使用新值
    const currentOptionByValue = normalizedOptions.value.find(opt => String(opt.value) === String(inputValue.value))
    if (!currentOptionByValue) {
      inputValue.value = newVal || ''
    }
  }
}, { immediate: true })

// 监听下拉框打开状态，更新位置
watch(isOpen, (newVal) => {
  if (newVal) {
    updateDropdownPosition()
    // 监听滚动和窗口大小变化
    window.addEventListener('scroll', updateDropdownPosition, true)
    window.addEventListener('resize', updateDropdownPosition)
  } else {
    window.removeEventListener('scroll', updateDropdownPosition, true)
    window.removeEventListener('resize', updateDropdownPosition)
  }
})

// 初始化
watch(() => props.options, () => {
  // 选项变化时，如果当前值不在选项中，保持输入值
  const currentValue = inputValue.value
  const exists = normalizedOptions.value.some(opt => 
    String(opt.value) === String(currentValue)
  )
  if (!exists && currentValue) {
    // 值不在选项中，保持用户输入
    return
  }
}, { immediate: true })

// 组件卸载时清理
onUnmounted(() => {
  window.removeEventListener('scroll', updateDropdownPosition, true)
  window.removeEventListener('resize', updateDropdownPosition)
})
</script>

<style scoped>
.smart-select {
  position: relative;
  width: 100%;
  z-index: 1;
}

.smart-select.is-open {
  z-index: 9999;
}

.smart-select-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.smart-select-input {
  width: 100%;
  padding: 0.4rem 2rem 0.4rem 0.6rem;
  border: 2px solid #d0d0d0;
  border-radius: 5px;
  font-size: 0.85rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
  background: #ffffff;
  color: #1a1a1a;
  line-height: 1.4;
  font-weight: 500;
}

.smart-select-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
  background: #ffffff;
  color: #000000;
}

.smart-select-input:hover:not(:disabled) {
  border-color: #999999;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.05);
}

.smart-select-input:disabled {
  background: linear-gradient(135deg, #f8f9fa 0%, #f0f2f5 100%);
  cursor: not-allowed;
  color: #666;
  border-color: #d0d0d0;
}

.smart-select-arrow {
  position: absolute;
  right: 0.6rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #667eea;
  transition: transform 0.3s ease;
  cursor: pointer;
  pointer-events: auto;
}

.smart-select.is-open .smart-select-arrow {
  transform: translateY(-50%) rotate(180deg);
}

.smart-select-dropdown {
  position: fixed;
  margin-top: 0.2rem;
  background: #ffffff;
  border: 2px solid #d0d0d0;
  border-radius: 5px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
  max-height: 300px;
  overflow-y: auto;
  z-index: 99999;
  animation: slideDown 0.2s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.smart-select-dropdown::-webkit-scrollbar {
  width: 8px;
}

.smart-select-dropdown::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.smart-select-dropdown::-webkit-scrollbar-thumb {
  background: #667eea;
  border-radius: 4px;
}

.smart-select-dropdown::-webkit-scrollbar-thumb:hover {
  background: #5568d3;
}

.smart-select-option {
  padding: 0.6rem 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  color: #1a1a1a;
  font-weight: 500;
}

.smart-select-option:last-child {
  border-bottom: none;
}

.smart-select-option:hover,
.smart-select-option.is-highlighted {
  background: linear-gradient(135deg, #e8f0ff 0%, #d0e4ff 100%);
  color: #000000;
  font-weight: 600;
}

.smart-select-option.is-matched {
  background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
  font-weight: 500;
}

.smart-select-option.is-matched:hover,
.smart-select-option.is-matched.is-highlighted {
  background: linear-gradient(135deg, #bae6fd 0%, #7dd3fc 100%);
}

.smart-select-option mark {
  background: #667eea;
  color: white;
  padding: 0.1rem 0.2rem;
  border-radius: 2px;
  font-weight: 600;
}

.smart-select.is-disabled .smart-select-input {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>

