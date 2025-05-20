<template>
  <div class="process-bar" v-if="text" @click="handleNavClick">
    <div class="bar-left">
      <div class="process-text">
        {{ text }}
      </div>
      <div class="progress-bar-wrapper">
        <div class="progress-bar-fill" :style="{ width: progressPercent + '%' }"></div>
      </div>
    </div>
    <div class="bar-right">
      <span>
        <span>额外得&nbsp;</span>
        <span class="reward-symbol">¥</span>
        <span class="reward-num">{{ formatAmount(currentProcess.reward) }}</span>
      </span>
    </div>
  </div>
</template>

<script setup>
import { formatAmount } from '@/utils/transform'
import { store } from '../../store';
import { computed } from 'vue';

const currentProcess = computed(() => {
  const orderActivityProgress = store.personalInfo.orderActivityProgress || []
  return orderActivityProgress.find(item => !item.status)
})

const text = computed(() => {
  const process = currentProcess.value
  if (!process) return ''
  return `${process.orderActivityName}(${process.current}/${process.target})`
})
const progressPercent = computed(() => {
  const process = currentProcess.value
  if (!process) return 0
  return Math.min(Math.round((process.current / process.target) * 100), 100)
})
const handleNavClick = () => {
  store.setPageStatus('PersonalCenter')
};
</script>

<style scoped lang="scss">
.process-bar {
  flex: 0 0 100px;
  width: 100%;
  padding: 0 24px;
  box-sizing: border-box;
  display: flex;
  background-color: #fff;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #E5E5E5;
}

.bar-left {
  flex: 0 0 50%;
}

.bar-right {
  flex: 0 0 50%;
  text-align: right;
  font-size: 28px;
}

.process-text {
  font-size: 28px;
  color: #333;
  margin-bottom: 10px;
}

.progress-bar-wrapper {
  border: 1px solid #ddd;
  height: 12px;
  background-color: #f0f0f0;
  border-radius: 6px;
  width: 100%;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #8BC34A, #4CAF50);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.bar-right {
  white-space: nowrap;

  .reward-symbol {
    color: #FF2D19;
    font-size: 28px;
  }

  .reward-num {
    color: #FF2D19;
    font-family: MT New Digital Display;
    font-size: 44px;
    font-weight: bold;
  }

  .arrow {
    height: 30px;
    margin-left: 6px;
  }
}
</style>
