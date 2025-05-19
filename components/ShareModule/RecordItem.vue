<template>
  <!-- 临时先开启，因为业务实际状态可能变成进行中 -->
  <div class="item" v-if="true || !timeout">
    <div class="avatar">
      <img :src="userAvatar" alt="">
    </div>
    <div class="info">
      <div class="name">
        <div class="name-left">
          {{ props.item.name }}
        </div>
        <div class="reward" v-if="status !== STATUS.FAIL">
          <span class="label" v-if="status !== STATUS.SUCCESS">必得</span>
          <span class="symbol">¥</span>
          <span class="amount">{{ formatAmount(props.item.reward, 2, '0.00') }}</span>
        </div>
      </div>
      <div class="status">{{ STATUS_TEXT[status] }}</div>
      <div class="countdown" v-if="status === STATUS.PENDING">
        <span class="time">{{ countDownTime }}</span>后邀请失效
      </div>
    </div>
    <!-- <div class="reward" v-if="status !== STATUS.FAIL">
      <span class="label" v-if="status !== STATUS.SUCCESS">预计</span>
      <span class="symbol">¥</span>
      <span class="amount">{{ formatAmount(props.item.reward, 2, '0.00') }}</span>
    </div> -->
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { formatAmount, formatTimeHHMMSS, getDaysFromMilliseconds } from '@/utils/transform'
import logger from '../../utils/logger'

const log = logger('RecordItem')

const props = defineProps(['item'])
const status = ref(props.item.status)
const timeout = ref(false)

// 状态常量
const STATUS = {
  PENDING: 'pending',
  REVIEW: 'review',
  SUCCESS: 'success',
  FAIL: 'fail',
}

const STATUS_TEXT = computed(() => {
  return {
    [STATUS.PENDING]: '提醒TA完成任务',
    [STATUS.REVIEW]: props.item.schedule || '任务进行中',
    [STATUS.SUCCESS]: '任务已完成',
    [STATUS.FAIL]: '任务失败',
  }
})

const userAvatar = computed(() => {
  const defaultImg = 'https://p0.meituan.net/undertake/c9b74f4e50f184c8f110a258b7819dd91112.png'
  const avatar = props.item.userAvatar || defaultImg
  return avatar.includes('%') ? avatar : encodeURI(avatar)
})

// 倒计时相关
const remainingTime = ref(props.item.effectTime || 0)
const countDownTime = computed(() => {
  if (remainingTime.value > 2 * 24 * 60 * 60 * 1000) {
    return getDaysFromMilliseconds(remainingTime.value) + '天'
  }
  return formatTimeHHMMSS(remainingTime.value)
})

// 倒计时定时器
let timer = null

// 启动倒计时
const startCountDown = () => {
  if (remainingTime.value <= 0) return

  timer = setInterval(() => {
    remainingTime.value -= 1000
    if (remainingTime.value <= 0) {
      remainingTime.value = 0
      timeout.value = true
      clearInterval(timer)
    }
  }, 1000)
}

// 组件挂载时启动倒计时
onMounted(() => {
  startCountDown()
  log('RecordItem mounted', props.item)
})

// 组件卸载前清除定时器
onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped lang="scss">
.item {
  margin: 16px 8px;
  padding: 32px 24px;
  display: flex;
  background-color: #fff;
  border-radius: 8px;
}

.avatar {
  flex: 0 0 56px;
  height: 56px;
  border-radius: 50%;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.info {
  flex: 1;
  padding-left: 16px;

  .name {
    padding-bottom: 6px;
    font-size: 32px;
    font-weight: 500;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }

  .status {
    font-size: 28px;
    color: rgba(0, 0, 0, 0.9);
  }

  .countdown {
    margin-top: 6px;
    font-size: 28px;
    color: rgba(0, 0, 0, 0.9);

    .time {
      margin-right: 8px;
      color: #FF2D19;
    }
  }
}

.reward {
  // display: flex;
  // align-items: center;

  .label {
    font-size: 28px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.9);
    margin-right: 8px;
  }

  .symbol {
    color: #FF2D19;
    font-size: 28px;
    margin: 0 3px;
    font-weight: bold;
  }

  .amount {
    color: #FF2D19;
    font-size: 44px;
    font-weight: bold;
    line-height: 44px;
  }
}
</style>
