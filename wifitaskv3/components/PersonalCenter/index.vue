<template>
  <div class="personal-center">
    <div class="header">
      <div class="header-left">
        <img :src="userAvatar" alt="">
      </div>
      <div class="header-mid">
        <div class="text">{{ personalInfo.wxUserName || '已登录' }}</div>
      </div>
      <div class="header-right">
        <Withdraw v-if="showWithdraw" @close="showWithdraw = false" />
        <div class="pay-btn" @click="handleWithdrawClick">提现</div>
      </div>
    </div>
    <div class="content">
      <div class="special-tab">
        <div class="title">我的收入</div>
        <div class="text">
          <div class="text-top">
            <span class="amount-symbol">¥</span>
            <span class="amount-value">{{ formatAmount(personalInfo.totalIncome) }}</span>
          </div>
          <div class="text-bottom">
            ¥{{ formatAmount(personalInfo.balance) }}未提现
          </div>
        </div>
      </div>
      <div class="tab" @click="handleTabClick('task')">
        <div class="title">任务收入</div>
        <div class="text">
          <span class="amount-symbol">¥</span>
          <span class="amount-value">{{ formatAmount(personalInfo.totalJob) }}</span>
          <img class="right-arrow" src="https://p1.meituan.net/undertake/f0659cefe98e380b9c513fca680dcbe9785.png"
            alt="">
        </div>
      </div>
      <div class="tab" @click="handleTabClick('share')">
        <div class="title">分享收入</div>
        <div class="text">
          <span class="amount-symbol">¥</span>
          <span class="amount-value">{{ formatAmount(personalInfo.totalShare) }}</span>
          <img class="right-arrow" src="https://p1.meituan.net/undertake/f0659cefe98e380b9c513fca680dcbe9785.png"
            alt="">
        </div>
      </div>
    </div>
    <span class="reward-title">限时冲单奖</span>
    <div class="block">
      <div class="tab" v-for="process in personalInfo.orderActivityProgress">
        <div class="title">{{ generateProcessText(process) }}</div>
        <div class="text" :class="{ 'doing': !process.status }">
          <span class="amount-text">额外得</span>
          <span class="amount-symbol">&thinsp;¥&thinsp;</span>
          <span class="amount-value">{{ formatAmount(process.reward) }}</span>
          <span class="right-arrow" />
        </div>
      </div>
    </div>
    <div class="footer">
      联系客服微信：AllenWang98997
    </div>
    <div class="footer-tip" @click="showActivityRule = true">
      活动规则说明
      <img src="https://p0.meituan.net/undertake/69e509badcb76c1f007130f25f12bd312288.png" alt="">
    </div>
    <ActivityRule v-if="showActivityRule" @close="showActivityRule = false" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { formatAmount } from '@/utils/transform';
import { store } from '../../store';
import Withdraw from './Withdraw.vue';
import { sendMv, sendMc } from '../../lxreport';
import ActivityRule from '../ActivityRule.vue';
import { orderActivityProgressData } from '../../mockdata'
sendMv('b_lintopt_iygulnuc_mv')

const showActivityRule = ref(false)
const personalInfo = computed(() => store.personalInfo)
const userAvatar = computed(() => {
  const defaultImg = 'https://p0.meituan.net/undertake/81e1989e595c6caa72b085755fb6fec8150419.jpg'
  const avatar = personalInfo.value.userAvatar || defaultImg
  return avatar.includes('%') ? avatar : encodeURI(avatar)
})
const showWithdraw = ref(false)

store.getWalletStatisticsFun()

const generateProcessText = (process) => {
  return `${process.orderActivityName}(${process.current}/${process.target})`
}

const handleTabClick = (tab) => {
  if (tab === 'task') {
    sendMc('b_lintopt_iygulnuc_mc', { title: '任务收入' })
    store.directShowApprove = true
    store.setTaskModuleTab('TaskRecord');
    store.setPageStatus('TaskModule');
  } else if (tab === 'share') {
    sendMc('b_lintopt_iygulnuc_mc', { title: '分享收入' })
    store.setPageStatus('ShareModule');
  }
}

const handleWithdrawClick = () => {
  sendMc('b_lintopt_iygulnuc_mc', { title: '提现按钮' })
  showWithdraw.value = true
}

</script>

<style scoped lang="scss">
.footer {
  padding: 40px 32px;
  margin-top: 24px;
  background-color: #fff;
  font-size: 32px;
  color: rgba(0, 0, 0, 0.9);
}

.footer-tip {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  color: #222;
  margin-top: 48px;

  img {
    margin-left: 4px;
    width: 24px;
  }
}

.content {
  background-color: #fff;
  padding: 0 32px;

  .special-tab {
    height: 157px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #E5E5E5;

    .title {
      font-size: 32px;
      color: rgba(0, 0, 0, 0.9);
    }

    .text {
      display: flex;
      flex-direction: column;
      align-items: flex-end;

      .text-top .amount-symbol {
        font-size: 28px;
        font-weight: bold;
        color: #FF2D19;
      }

      .text-top .amount-value {
        font-size: 44px;
        font-weight: bold;
        line-height: 64px;
        color: #FF2D19;
      }

      .text-bottom {
        font-size: 28px;
        color: rgba(0, 0, 0, 0.4);
      }
    }
  }
}

.reward-title {
  color: rgba(0, 0, 0, 0.6);
  font-size: 28px;
  padding: 24px 32px 0;
}

.block {
  margin-top: 24px;
  background-color: #fff;
  padding: 0 32px;
}

.tab {
  padding: 40px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #E5E5E5;

  .title {
    font-size: 32px;
    color: rgba(0, 0, 0, 0.9);
  }

  .text {
    .amount-text {
      font-size: 28px;
      font-weight: bold;
    }

    .amount-symbol {
      font-size: 22px;
      font-weight: bold;
    }

    .amount-value {
      font-family: MT New Digital Display;
      font-size: 32px;
      font-weight: bold;
      line-height: 44px;
    }

    .right-arrow {
      display: inline-block;
      height: 22px;
      width: 13px;
      margin-left: 17px;
    }
  }

  .text.doing {
    color: rgba(0, 0, 0, 0.24);
  }
}

.tab:last-child {
  border: none;
}

.header {
  background-color: #fff;
  display: flex;
  padding: 32px;
  align-items: center;
  border-bottom: 1px solid #E5E5E5;

  .header-right {
    flex: 0 0 152px;
    display: flex;
    align-items: center;

    .pay-btn {
      border-radius: 8px;
      background: #00B300;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 68px;
      font-size: 30px;
      font-weight: 500;
      color: #FFFFFF;
    }
  }

  .header-mid {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 16px;

    div {
      font-size: 32px;
      margin-left: 16px;
      color: rgba(0, 0, 0, 0.9);
    }
  }

  .header-left {
    flex: 0 0 90px;
    border-radius: 50%;
    overflow: hidden;
    height: 90px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}

.personal-center {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-bottom: 24px;
  box-sizing: border-box;
  overflow: auto;
  background-color: #f5f5f5;
}
</style>
