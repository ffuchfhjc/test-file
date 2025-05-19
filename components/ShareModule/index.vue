<template>
  <div class="module">
    <div class="loading" v-if="showLoading">
      <Loading />
    </div>
    <div class="container" v-else>
      <div class="content">
        <div class="pic"></div>
        <div class="carousel">
          <div class="scroll-inline-container">
            <div class="scroll-container">
              <div v-for="item in carouselMockData" class="carousel-item" :key="item.userId">
                <div class="scroll-item">
                  <img :src="item.avatar" alt="avatar" />
                  <div class="txt">{{ item.txt }}</div>
                </div>
              </div>
            </div>
            <div class="scroll-container">
              <div v-for="item in carouselMockData" class="carousel-item" :key="item.userId">
                <div class="scroll-item">
                  <img :src="item.avatar" alt="avatar" />
                  <div class="txt">{{ item.txt }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="invite">
          <div class="price">
            <div class="price-num">40<span class="price-unit">元</span></div>
          </div>
          <div class="invite-friend" @click="share">去邀请好友</div>
        </div>

        <div class="reward"></div>
      </div>
      <div class="tip" @click="showRule"></div>
      <div class="invite-record" @click="showRecordPage=true">
        <div class="txt">
          邀请记录
        </div>
      </div>
      <ShareRecordPage v-if="showRecordPage" @init-complete="emit('init-complete')" @share="share" @onCloseShareModule="onCloseShareModule"/>
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
import { getShareRecords, checkSharePermission } from "../../request"
import { sendMc, sendMv } from "../../lxreport"
import { store } from "../../store"
import createMpUrl from "../../utils/mpUrlCreator"
import logger from "../../utils/logger"
import { shareToWx } from "../../utils/utils"
import ShareRecordPage from "./ShareRecordPage.vue"

const avatarUrl = "https://p0.meituan.net/undertake/0b648ae615e5891e84cbc4a5a3b663501094.png"
const carouselMockData = [
  {
    userId: "001",
    avatar: avatarUrl,
    txt: "尾号 8738 用户,今日邀请 32人，已累计提现 800元",
  },
  {
    userId: "002",
    avatar: avatarUrl,
    txt: "尾号 5621 用户,今日邀请 28人，已累计提现 600元",
  },
  {
    userId: "003",
    avatar: avatarUrl,
    txt: "尾号 9145 用户,今日邀请 15人，已累计提现 800元",
  },
  {
    userId: "004",
    avatar: avatarUrl,
    txt: "尾号 3076 用户,今日邀请 25人，已累计提现 500元",
  },
  {
    userId: "005",
    avatar: avatarUrl,
    txt: "尾号 4892 用户,今日邀请 17人，已累计提现 300元",
  },
  {
    userId: "006",
    avatar: avatarUrl,
    txt: "尾号 7253 用户,今日邀请 29人，已累计提现 800元",
  },
  {
    userId: "007",
    avatar: avatarUrl,
    txt: "尾号 1368 用户,今日邀请 21人，已累计提现 400元",
  },
  {
    userId: "008",
    avatar: avatarUrl,
    txt: "尾号 6540 用户,今日邀请 20人，已累计提现 700元",
  },
  {
    userId: "009",
    avatar: avatarUrl,
    txt: "尾号 2987 用户,今日邀请 30人，已累计提现 600元",
  },
  {
    userId: "010",
    avatar: avatarUrl,
    txt: "尾号 4319 用户,今日邀请 12人，已累计提现 200元",
  },

]
const showRecordPage = ref(false)


getShareRecords().then((res) => {
  shareRecord.value = res.data
  if (shareRecord.value.recordDTOList && shareRecord.value.recordDTOList.length > 0) {
    showRecordPage.value = true
  }
  })

const log = logger("ShareModule")

sendMv("b_lintopt_j4thtvx6_mv")

const emit = defineEmits(["init-complete"])
const showLoading = ref(false)
const showShareRule = ref(false)
const shareRecord = ref({})



const share = () => {
  
  sendMc("b_lintopt_j4thtvx6_mc", { title: "分享按钮" })
  log("share(): ", store)

  checkSharePermission().then((res) => {
    log("checkSharePermission(): ", res)
    if (window.searchObject.isGzzTest) {
      res.data = true
    }
    const origin = window.location.origin
    const inviteInfoStr = "&inviterUserId=" + window.searchObject.userid + "&inviterUuid=" + window.searchObject.uuid
    let url = origin + "/kk/fetools/pages/wifitaskv3?isH5Starter=1" + (window.searchObject.isGzzTest ? "" : inviteInfoStr)
    console.log("url", url)
    // url = "https://w.dianping.com/cube/evoke/meituan.html?url=" + encodeURIComponent(url)

    // const origin = window.location.origin
    // let url =
    //   origin + "/kk/fetools/pages/wifitaskv3?isH5Starter=1&inviterUserId=" + window.searchObject.userid + "&inviterUuid=" + window.searchObject.uuid
    // url = "https://w.dianping.com/cube/evoke/meituan.html?url=" + encodeURIComponent(url)
    shareToWx({
      title: "手慢无！参与门店淘金活动，立得50元现金",
      desc: "快来点击链接参与活动吧",
      image: "https://p0.meituan.net/undertake/6fd547cece0fb37c54fb5dc9b5ee3719322032.png",
      url,
    })
  })
}
const showRule = () => {
  sendMc("b_lintopt_j4thtvx6_mc", { title: "规则按钮" })
  showShareRule.value = true
}

const showRecord = () => {
  showRecord.value = true
}

const onCloseShareModule = () => {
  showRecordPage.value = false
}
</script>

<style scoped lang="scss">
.module {
  position: relative;
  display: flex;
  height: 100%;
}

@font-face {
  font-family: HYYaKuHei;
  src: url("/src/fonts/HYYaKuHei.ttf");
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

// 内容区域
.content {
  flex: 1;
  overflow: auto;
  background: linear-gradient(180deg, #a5e4fa 0%, #f7fab6 50%, #fcf6e4 100%);

  .pic {
    width: 100%;
    height: 340px;
    margin-top: 17px;
    background-image: url("https://p0.meituan.net/undertake/b9326b8a44f3c752bc238cf8bb6d46cd55925.png");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }

  .carousel {
    width: 100%;
    height: 60px;
    overflow: hidden;

    .scroll-inline-container {
      white-space: nowrap;
      // overflow-x: scroll;
      font-size: 0;
      display: flex;
    }

    .scroll-container {
      display: flex;
      animation: infiniteScroll 30s linear infinite;
    }

    .scroll-item {
      width: 600px;
      height: 56px;
      margin-right: 16px;
      // margin-right: 5px;
      border-radius: 80px;
      background: rgba(255, 255, 255, 0.66);
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        width: 40px;
        height: 40px;
      }

      .txt {
        font-size: 24px;
        font-weight: normal;
        line-height: 32px;
        color: rgba(0, 0, 0, 0.9);
      }
    }
  }
  .invite {
    background-image: url("https://p0.meituan.net/undertake/8cf875d93f1fed31315b4fd10933bac26857.png");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    height: 405px;
    margin: 32px 39px;
    position: relative;

    .price {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: 33px;
      line-height: normal;
      text-align: center;
      font-weight: 700;
      font-size: 166.4px;
      color: #00b300;
      letter-spacing: 0px;
      font-family: HYYaKuHei;
      font-variation-settings: "opsz" auto;
      font-style: italic;
    }
    .price-unit {
      font-weight: 700;
      font-size: 67.2px;
      letter-spacing: 0px;
      font-family: HYYaKuHei;
      font-variation-settings: "opsz" auto;
    }
    .invite-friend {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: 32px;
      display: flex;
      border-radius: 73px;
      width: 60vw;
      color: white;

      flex-direction: row;
      justify-content: center;
      align-items: center;
      padding: 26px 64px;
      background: #00b300;
    }
  }
  .reward {
    height: 226px;
    margin: 0 20px;
    background-image: url("https://p0.meituan.net/undertake/565053aaa36b0182c252954f94d8d3d710197.png");
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
  }
  .tip {
    position: absolute;
    z-index: 999;
    top: 47px;
    right: 0;
    width: 135px;
    height: 62px;
    background-image: url("https://p0.meituan.net/undertake/035de4d836d4dce13245604d4f2bec522971.png");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }

  .invite-record{
    position: absolute;
    z-index: 999;
    top: 127px;
    right: 0;
    width: 135px;
    height: 62px;
    background-image: url('https://p0.meituan.net/undertake/8318f49509563c2dd33ee60b63ce7023660.png');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    
    display: flex;
    justify-content: center;
    align-items: center;
    .txt{
      color: #FFFFFF;
    opacity: 0.8;

    font-size: 24px;
    line-height: 22px;
    }
  }

  @keyframes infiniteScroll {
    0% {
      transform: translate3d(0, 0, 0);
    }

    100% {
      transform: translate3d(-100%, 0, 0);
    }
  }
}

// 空状态
</style>
