<template>
    <div class="module">
      <div class="loading" v-if="showLoading">
        <Loading />
      </div>
      <div class="container" v-else>
        <div class="header">
          <div class="title">累计收益</div>
          <div class="income">
            <span class="symbol">¥</span>
            <span class="amount">{{ formattedTotalReward }}</span>
          </div>
        </div>
        <div class="content" v-if="hasRecords">
          <RecordItem v-for="(item, index) in shareRecord.recordDTOList" :key="index" :item="item" />
        </div>
        <div class="empty" v-else>
          <!-- <div class="empty-img">
            <img src="https://p0.meituan.net/travelcube/f9b0ab0fd2671166370536b6ac11bd55588040.png" alt="空状态图片" />
          </div> -->
          <img src="https://p0.meituan.net/undertake/9f6ea5bec0c0eedfcd32966d92ac09bd25884.png" alt="空状态图片" />
          <div v-if="shareRecord.canInvite">邀请好友参与门店任务，</div>
          <div v-else>暂无邀请权限</div>
          <div v-if="shareRecord.canInvite">获取丰厚现金激励。</div>
          <div v-else>还需完成<span class="highlight">5个</span>门店任务</div>
        </div>
  
        <div class="footer">
          <!-- <button class="btn" :class="{ disabled: !shareRecord.canInvite }" :disabled="!shareRecord.canInvite" @click="emit('share')">邀好友得现金</button> -->
          <button class="btn"  @click="goback">返回邀请页</button>

          <!-- //  <div class="tip" @click="showRule">
          //   规则说明
          //   <img src="https://p0.meituan.net/undertake/69e509badcb76c1f007130f25f12bd312288.png" alt="规则说明图标" />
          // </div>  -->
        </div>
        <ShareRule v-if="showShareRule" @close="showShareRule = false" />
      </div>
    </div>
  </template>
  
  <script setup>
  import { shareData } from "../../mockdata"

  import { formatAmount } from "@/utils/transform"
  import Loading from "@/components/Loading.vue"
  import RecordItem from "./RecordItem.vue"
  import { ref, computed } from "vue"
  import ShareRule from "./ShareRule.vue"
  import { getShareRecords } from "../../request"
  import { sendMc, sendMv } from "../../lxreport"
  import logger from "../../utils/logger"

  const log = logger("ShareModule")
  
  sendMv("b_lintopt_j4thtvx6_mv")
  
  const emit = defineEmits(["init-complete",'share','onCloseShareModule'])
  const showLoading = ref(false)
  const showShareRule = ref(false)
  const shareRecord = ref({})
  
  // 计算属性
  const formattedTotalReward = computed(() => formatAmount(shareRecord.value.totalReward, 2, "0.00"))
  const hasRecords = computed(() => shareRecord.value.recordDTOList && shareRecord.value.recordDTOList.length > 0)
  
  getShareRecords().then((res) => {
    log("getShareRecords()-callback:", res)
    emit("init-complete")
    showLoading.value = false
    shareRecord.value = res.data
    // shareRecord.value = shareData
    // mock begin ===========>
    if (window.searchObject.isGzzTest) {
      shareRecord.value.canInvite = true
    }
    // mock end ===========>
    console.log("shareRecord.value", shareRecord.value)
  })

  const showRule = () => {
    sendMc("b_lintopt_j4thtvx6_mc", { title: "规则按钮" })
    showShareRule.value = true
  }

  const goback = ()=>{
    emit('onCloseShareModule')
  }
  </script>
  
  <style scoped lang="scss">
  .module {
    position: relative;
    display: flex;
    height: 100%;
    z-index: 1000
  }
  
  .loading {
    flex: 1;
  }
  
  .container {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background-color: #f5f5f5;
  }
  
  // 头部样式
  .header {
    flex: 0 0 128px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 32px;
    background-color: #fff;
  
    .title {
      font-size: 36px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.9);
    }
  
    .income {
      color: #ff2d19;
  
      .symbol {
        font-size: 28px;
      }
  
      .amount {
        font-size: 44px;
        font-weight: bold;
      }
    }
  }
  
  // 内容区域
  .content {
    flex: 1;
    overflow: auto;
  }
  
  // 空状态
  .empty {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 32px;
    color: rgba(0, 0, 0, 0.7);
  
    .empty-img {
      z-index: 1;
      width: 100%;
      overflow: hidden;
      img {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
      }
    }
  
    img {
      width: 325px;
      margin-bottom: 16px;
    }
  
    .highlight {
      color: #ff2d19;
    }
  }
  
  // 底部区域
  .footer {
    z-index: 2;
    flex: 0 0 202px;
    background-color: #fff;
  
    .btn {
      width: calc(100% - 64px);
      margin: 16px 32px 0;
      background: #00b300;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 96px;
      color: #ffffff;
      font-size: 36px;
      font-weight: 500;
      border: none;
      outline: none;
      cursor: pointer;
  
      &.disabled {
        background: #999999;
        cursor: not-allowed;
      }
    }
  
    .tip {
      font-size: 24px;
      line-height: 32px;
      margin-top: 25px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: rgba(0, 0, 0, 0.5);
  
      img {
        margin-left: 8px;
        height: 32px;
      }
    }
  }
  </style>