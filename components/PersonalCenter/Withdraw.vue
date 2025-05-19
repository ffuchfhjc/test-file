<template>
  <div class="withdraw">
    <div class="header">
      <div class="back" @click="closePage">
        <img src="https://p0.meituan.net/undertake/3ac9a58b95b47c3e590d826dc75cabbb390.png" alt="">
      </div>
      <div class="title">提现</div>
      <div class="placeholder"></div>
    </div>
    <div class="main">
      <LoadingV2 v-if="loadingStatus" :loadingStatus loadingText="提现中..." />
      <div class="balance">
        <div class="flex-1"></div>
        <div class="money">
          <span class="symbol">¥</span>
          <span class="value">{{ formatAmount(personalInfo.balance) }}</span>
        </div>
        <div class="rule-btn" @click="showWithdrawTip = true">
          规则
          <img class="arrow" src="https://p1.meituan.net/undertake/f0659cefe98e380b9c513fca680dcbe9785.png">
        </div>
        <WithdrawTip v-if="showWithdrawTip" @close="showWithdrawTip = false" />
      </div>
      <div class="options">
        <div class="amount-list">
          <div v-for="amount in withdrawAmounts" :key="amount" class="amount-item" :class="{
            'active': selectedAmount === amount,
            'disabled': personalInfo.balance < amount
          }" @click="selectAmount(amount)">
            <div class="money">
              <span class="symbol">¥</span>
              <span class="value">{{ formatAmount(amount) }}</span>
            </div>
            <div class="status">{{ getStatusText(amount) }}</div>
          </div>
        </div>
        <div class="btn" :class="{ 'disabled': !selectedAmount }"
          @click="selectedAmount && handleWithdraw()">提现到微信</div>
      </div>
      <div class="history" @click="showWithdrawRecode = true">
        历史提现记录
        <img class="arrow" src="https://p1.meituan.net/undertake/f0659cefe98e380b9c513fca680dcbe9785.png">
      </div>
      <WithdrawRecord v-if="showWithdrawRecode" @close="showWithdrawRecode = false" />
      <WithdrawResult :selectedAmount :resultStatus v-if="showWithdrawResult" @close="showWithdrawResult = false" />
    </div>
  </div>
</template>

<script setup>
import { store } from '../../store';
import { computed, ref } from 'vue';
import { formatAmount } from '@/utils/transform';
import WithdrawTip from './WithdrawTip.vue';
import WithdrawRecord from './WithdrawRecord.vue';
import WithdrawResult from './WithdrawResult.vue';
import LoadingV2 from '@/components/LoadingV2.vue';
import { createWithdraw } from '../../request';
import { sendMv, sendMc } from '../../lxreport';
import logger from '../../utils/logger';

const log = logger('Withdraw')

sendMv('b_lintopt_rcomuqst_mv')

const personalInfo = computed(() => store.personalInfo)
const emit = defineEmits(['close'])
const closePage = () => {
  emit('close')
}
const showWithdrawTip = ref(false)
const showWithdrawRecode = ref(false)
const showWithdrawResult = ref(false)
const loadingStatus = ref('')

const withdrawAmounts = [1000, 5000, 10000]
const selectedAmount = ref(null)
const resultStatus = ref('')

const selectAmount = (amount) => {
  log('selectAmount', amount)
  if (personalInfo.value.balance >= amount) {
    selectedAmount.value = amount
    sendMc('b_lintopt_ffl75mhc_mc', { amount })
  }
}

const handleWithdraw = () => {
  sendMc('b_lintopt_rcomuqst_mc', { amount: selectedAmount.value })
  // 处理提现逻辑
  loadingStatus.value = 'loading'
  log('提现金额:', selectedAmount.value)
  createWithdraw({ amount: selectedAmount.value }).then((res) => {
    log('createWithdraw', res)
    // ststus不为0，代表提现失败
    resultStatus.value = res.data.status ? 'fail' : 'success'
    showWithdrawResult.value = true
    store.getWalletStatisticsFun()
  }).catch((err) => {
    log('createWithdraw error', err)
    resultStatus.value = 'fail'
    showWithdrawResult.value = true
  }).finally(() => {
    // loadingStatus 为空时，loadingV2 不显示
    loadingStatus.value = '' 
  })
}

const getStatusText = (amount) => {
  if (personalInfo.value.balance >= amount) {
    return '可提现'
  } else {
    const diff = amount - personalInfo.value.balance
    return `差¥${(diff / 100).toFixed(2)}元`
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/titlebar.css';

.withdraw {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1001;
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
}

.header {
  border-bottom: 1px solid #E5E5E5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88px;
  padding: 0 24px;
  
  .back {
    width: 44px;
    height: 44px;
    
    img {
      width: 100%;
      height: 100%;
    }
  }
  
  .title {
    font-size: 36px;
    font-weight: 500;
  }
  
  .placeholder {
    width: 44px;
  }
}

.main {
  flex: 1;
  overflow-y: auto;
  padding: 44px 16px;
  background-color: #F5F5F5;
  position: relative;
}

.balance {
  height: 210px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 22px;
  
  .flex-1 {
    flex: 1;
  }
  
  .money {
    .symbol {
      color: #00A72D;
      font-family: MT New Digital Display;
      font-size: 48px;
      font-weight: bold;
      line-height: 66px;
    }
    
    .value {
      font-family: MT New Digital Display;
      font-size: 90px;
      font-weight: bold;
      line-height: 126px;
      color: #00A72D;
    }
  }
  
  .rule-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-size: 32px;
    color: #3D3D3D;
    
    .arrow {
      height: 22px;
      margin-left: 17px;
    }
  }
}

.options {
  padding: 44px 0;
  background-color: #fff;
  border-radius: 8px;
  
  .amount-list {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 46px;
    gap: 40px;
    
    .amount-item {
      flex: 1;
      border-radius: 8px;
      border: 0.5px solid rgba(0, 0, 0, 0.4);
      padding: 28px 0;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      transition: all 0.3s ease;
      
      &.active {
        border-color: #00B300;
        color: #00B300;
        
        .status {
          color: #00B300;
        }
      }
      
      &.disabled {
        border-color: rgba(0, 0, 0, 0.24);
        color: rgba(0, 0, 0, 0.24);
        
        .status {
          color: rgba(0, 0, 0, 0.24);
        }
      }
      
      .money {
        .symbol {
          font-size: 28px;
          font-weight: bold;
        }
        
        .value {
          font-size: 44px;
          font-weight: bold;
          line-height: 64px;
          font-family: MT New Digital Display;
        }
      }
      
      .status {
        font-size: 28px;
        color: rgba(0, 0, 0, 0.5);
      }
    }
  }
  
  .btn {
    margin: 44px 24px 0;
    background: #00B300;
    padding: 24px 0;
    text-align: center;
    border-radius: 8px;
    color: #fff;
    font-size: 36px;
    font-weight: 500;
    
    &.disabled {
      background: #EBEBEB;
      color: #999;
    }
  }
}

.history {
  margin-top: 44px;
  text-align: center;
  font-size: 32px;
  color: #3D3D3D;
  
  .arrow {
    height: 22px;
    margin-left: 5px;
  }
}

.arrow {
  height: 22px;
  margin-left: 5px;
}
</style>
