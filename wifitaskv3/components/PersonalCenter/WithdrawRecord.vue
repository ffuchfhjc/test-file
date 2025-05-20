<template>
  <div class="withdrawRecord-wrap">
    <div class="titlebar">
      <div class="titlebar-left" @click="closePage">
        <img class="titlebar-left-img" src="https://p0.meituan.net/undertake/3ac9a58b95b47c3e590d826dc75cabbb390.png"
          alt="">
      </div>
      <div class="titlebar-center">提现记录</div>
      <div class="titlebar-right"></div>
    </div>
    <div class="content" v-if="!showLoading">
      <div class="content-top">
        <div class="top-text">已累计提现</div>
        <div class="amount">
          <span class="amount-symbol">¥</span>
          <span class="amount-value">{{ formatAmount(totalWithdraw) }}</span>
        </div>
      </div>
      <div class="content-bottom">
        <div v-for="(item, index) in withdrawList" :key="index" class="record-item">
          <div class="record-amount">
            <span class="amount-symbol">¥</span>
            <span class="amount-value">{{ formatAmount(item.amount) }}</span>
          </div>
          <div class="record-time">{{ item.createTime }}</div>
        </div>
        <div v-if="withdrawList.length === 0" class="empty-tip">暂无提现记录</div>
      </div>
    </div>
    <Loading v-if="showLoading" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Loading from '@/components/Loading.vue';
import { formatAmount } from '@/utils/transform';
import { getWithdrawHistory } from '../../request';
import { withdrawHistoryData } from '../../mockdata';
import { sendMv } from '../../lxreport';

sendMv('b_lintopt_1i8qdg1o_mv')

const emit = defineEmits(['close'])
const closePage = () => { emit('close') }
const showLoading = ref(true)

const withdrawList = ref([])
const totalWithdraw = ref(0)

const getWithdrawHistoryFun = () => {
  // withdrawList.value = withdrawHistoryData.withdrawDetailBOList
  // totalWithdraw.value = withdrawHistoryData.totalWithdraw
  // showLoading.value = false
  getWithdrawHistory().then((res) => {
    console.log('getWithdrawHistory', res)
    withdrawList.value = res.data.withdrawDetailBOList
    totalWithdraw.value = res.data.totalWithdraw
    showLoading.value = false
  })
}
getWithdrawHistoryFun()
</script>

<style scoped lang="scss">
@import '@/styles/titlebar.css';

.withdrawRecord-wrap {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1002;
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
}

.titlebar {
  border-bottom: 1px solid #E5E5E5;
}

.content {
  flex: 1;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .content-top {
    flex: 0;
    display: flex;
    flex-direction: column;
    align-items: center;

    .top-text {
      margin-top: 36px;
      font-size: 32px;
      color: #888888;
    }

    .amount {
      margin: 7px 0 30px;

      .amount-symbol {
        color: #00A72D;
        font-family: MT New Digital Display;
        font-size: 48px;
        font-weight: bold;
        line-height: 66px;
      }

      .amount-value {
        font-family: MT New Digital Display;
        font-size: 90px;
        font-weight: bold;
        line-height: 126px;
        color: #00A72D;
      }
    }
  }

  .content-bottom {
    flex: 1;
    overflow-y: auto;
    padding: 0 32px;
    background-color: #fff;

    .record-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 36px 0;
      border-bottom: 0.5px solid rgba(0, 0, 0, 0.06);

      .record-amount {
        .amount-symbol {
          font-size: 28px;
          color: #333;
          font-weight: 500;
        }

        .amount-value {
          font-size: 36px;
          color: #333;
          font-weight: 500;
          font-family: MT New Digital Display;
        }
      }

      .record-time {
        font-size: 28px;
        color: rgba(0, 0, 0, 0.9);
      }
    }

    .empty-tip {
      text-align: center;
      padding: 60px 0;
      color: #999;
      font-size: 32px;
    }
  }

}
</style>
