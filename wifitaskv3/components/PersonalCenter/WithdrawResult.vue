<template>
  <div class="withdraw-result" @click="closePage">
    <div class="content" @click.stop="() => { }">
      <div class="top-text">{{ isSuccess ? '提现成功' : '提现失败' }}</div>
      <img class="status-icon" :src="statusIcon">
      <div class="amount" :class="{ 'failed': !isSuccess }">
        <span class="amount-symbol">¥</span>
        <span class="amount-value">{{ formatAmount(props.selectedAmount) }}</span>
      </div>
      <div class="tip">{{ isSuccess ? '美团已发起打款，预计24小时到账' : '提现失败，请稍后重试' }}</div>
      <div class="btn" @click="closePage">完成</div>
    </div>
  </div>
</template>

<script setup>
import { formatAmount } from '@/utils/transform';
import { computed } from 'vue';

const props = defineProps(['resultStatus', 'selectedAmount'])
const emit = defineEmits(['close'])
const isSuccess = computed(() => props.resultStatus === 'success')
const statusIcon = computed(() => isSuccess.value
  ? 'https://p1.meituan.net/undertake/ff5911dd3109ab2e43dc699e0a00476a6896.png'
  : 'https://p0.meituan.net/undertake/93179ebc85587ce3bb30d4c28b0c3c267212.png'
)
const closePage = () => { emit('close') }

</script>

<style scoped lang="scss">
.withdraw-result {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1002;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.content {
  background: #F5F5F5;
  border-radius: 8px 8px 0px 0px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.top-text {
  font-size: 36px;
  font-weight: 500;
  text-align: center;
  margin-top: 60px;
}

.status-icon {
  width: 136px;
  margin-top: 36px;
}

.amount {
  .amount-symbol {
    color: #00A72D;
    font-family: MT New Digital Display;
    font-size: 45px;
    font-weight: bold;
    line-height: 66px;
  }

  .amount-value {
    font-family: MT New Digital Display;
    font-size: 72px;
    font-weight: bold;
    line-height: 102px;
    color: #00A72D;
  }

  &.failed {

    .amount-symbol,
    .amount-value {
      color: #FF2D19;
    }
  }
}

.tip {
  margin-top: 16px;
  font-size: 28px;
  color: rgba(0, 0, 0, 0.4);
}

.btn {
  margin: 60px 0 80px;
  border-radius: 8px;
  background: #FFFFFF;
  padding: 19px 0;
  text-align: center;
  font-size: 30px;
  font-weight: 500;
  color: #191919;
  width: calc(100% - 64px);
}
</style>
