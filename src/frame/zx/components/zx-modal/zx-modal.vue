<template>
  <view class="zx-modal" v-if="visiable">
    <zx-transition key="1" name="fade" :customStyle="maskStyle" :duration="duration" :show="showTrans" />
    <zx-transition key="2" name="zoom-in" :customStyle="transStyle" :duration="duration" :show="showTrans">
      <view class="zx-modal-main" @touchmove.stop.prevent="">
        <view class="modal">
          <!-- 标题 -->
          <slot name="title">
            <view class="modal-title" v-show="title">{{ title }}</view>
          </slot>
          <!-- 内容区 -->
          <slot name="content">
            <view :class="{ 'modal-content': true, 'modal-content--notitle': !title }">
              <slot></slot>
            </view>
          </slot>
          <!-- 操作按钮 -->
          <slot name="operation">
            <view class="modal-footer">
              <view class="modal-footer-operation" v-if="showCancel" :style="{ color: cancelColor }" @click.stop="clickBtn('cancel')">
                {{ cancelText }}
              </view>
              <view class="modal-footer-operation" :style="{ color: confirmColor }" @click.stop="clickBtn('confirm')">{{ confirmText }}</view>
            </view>
          </slot>
        </view>
      </view>
    </zx-transition>
  </view>
</template>

<script lang="ts" setup>
import { ref, computed, nextTick, inject, watch } from 'vue'
import { RegUtil, CommonUtil } from '../../index'
import { defaultModalOptions, modalDefaultKey, modalDefaultOptionKey } from "./index"

import { ModalOptions } from './types'

interface Props {
  // Modal唯一标识
  id?: string
}
const props = withDefaults(defineProps<Props>(), {
  id: ''
})

const visiable = ref<boolean>(false) // 是否展示modal
const showTrans = ref<boolean>(false) // 是否展示过渡动画
const duration = ref<number>(200) // 动画时间
const title = ref<string>('提示') // 提示文字
const content = ref<string>('') // 弹出框内容
const showCancel = ref<boolean>(true) // 是否展示取消按钮
const cancelText = ref<string>('取消') // 取消按钮文字
const cancelColor = ref<string>('') // 取消按钮颜色
const confirmText = ref<string>('确定') // 确定按钮文字
const confirmColor = ref<string>('') // 确定按钮的颜色
// eslint-disable-next-line @typescript-eslint/ban-types
const success = ref<Function | null>(null) // 成功的回调

const modalKey = props.id ? '__MODAL__' + props.id : modalDefaultKey
const modalOptionKey = props.id ? '__MODAL_OPTION__' + props.id : modalDefaultOptionKey
const modalShow = inject(modalKey) || ref<boolean>(false) // 函数式调用是否展示modal组件
const modalOption = inject(modalOptionKey) || ref<ModalOptions>(defaultModalOptions) // modal选项

// 监听options变化展示
watch(
  () => modalOption.value,
  (newVal: ModalOptions) => {
    reset(newVal)
  }
)

// 监听函数式调用showModal的调用
watch(
  () => modalShow.value,
  (newVal) => {
    if (newVal) {
      show()
    }
  }
)

// 遮罩样式
const maskStyle = computed(() => {
  const styles = {
    position: 'fixed',
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)'
  }
  return CommonUtil.style(styles)
})
// 内容样式
const transStyle = computed(() => {
  const styles = {
    position: 'fixed',
    /* #ifndef APP-NVUE */
    display: 'flex',
    flexDirection: 'column',
    /* #endif */
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    justifyContent: 'center',
    alignItems: 'center'
  }
  return CommonUtil.style(styles)
})

// 打开
function show() {
  visiable.value = true
  nextTick(() => {
    showTrans.value = true
  })
}
// 关闭
function hide() {
  showTrans.value = false
  const timer = setTimeout(() => {
    clearTimeout(timer)
    visiable.value = false
    modalShow.value = false
    reset(defaultModalOptions)
  }, duration.value)
}
/**
 * 重置参数
 */
function reset(option) {
  if (option) {
    title.value = RegUtil.isDef(option.title) ? option.title : title.value
    content.value = RegUtil.isDef(option.content) ? option.content : content.value
    showCancel.value = RegUtil.isDef(option.showCancel) ? option.showCancel : showCancel.value
    cancelText.value = RegUtil.isDef(option.cancelText) ? option.cancelText : cancelText.value
    cancelColor.value = RegUtil.isDef(option.cancelColor) ? option.cancelColor : cancelColor.value
    confirmText.value = RegUtil.isDef(option.confirmText) ? option.confirmText : cancelText.value
    confirmColor.value = RegUtil.isDef(option.confirmColor) ? option.confirmColor : confirmColor.value
    success.value = RegUtil.isDef(option.success) ? option.success : success.value
  }
}
function clickBtn(res) {
  hide()
  if (success.value) {
    const resObj = {
      cancel: false,
      confirm: false
    }
    res == 'confirm' ? (resObj.confirm = true) : (resObj.cancel = true)
    nextTick(() => {
      success.value && success.value(resObj)
    })
  }
}
</script>

