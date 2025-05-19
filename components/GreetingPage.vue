<template>
  <div class="container">
    <div class="header"></div>
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

    <div class="content">
      <template v-if="isGreetPage">
        <div class="register-button" @click="close">
          <div class="txt">参与活动</div>
        </div>
        <div class="rule">
          <img src="https://p0.meituan.net/undertake/1bc509c7a675887a76f5095d6be00d6c897.png" alt="register-button" />
          <span
            >参与即同意
            <div class="rule-txt" @click="showActivityRule = true">《门店淘金规则》</div></span
          >
        </div>
      </template>
      <template v-else>
        <div class="share-join">
          <div class="direct-join" @click="miniProgramJoin">直接参与</div>

          <div class="share-button" @click="appJoin">
            <div class="hot-icon">
              <img src="https://p0.meituan.net/undertake/0c9fa5079d433a35b6d8091fbe63d551808.png" alt="icon" />
              提现更快
            </div>
            <div class="txt">美团App参与</div>
          </div>
        </div>
      </template>
    </div>

    <div class="role"></div>
    <ActivityRule v-if="showActivityRule" @close="showActivityRule = false" />
  </div>
</template>
<script setup>
import { ref } from "vue"
import ActivityRule from "./ActivityRule.vue"
const showActivityRule = ref(false)

const emit = defineEmits(["close", "miniProgramJoin", "appJoin"])

const close = () => {
  emit("close")
}

const miniProgramJoin = () => {
  emit("miniProgramJoin")
}

const appJoin = () => {
  emit("appJoin")
}

const props = defineProps({
  source: {
    type: String,
    default: "greet", //or share
    required: false,
  },
})

const isGreetPage = ref(props.source === "greet")
const avatarUrl = "https://p0.meituan.net/undertake/0b648ae615e5891e84cbc4a5a3b663501094.png"
const carouselMockData = [
  {
    userId: "001",
    avatar: avatarUrl,
    txt: "尾号6785用户，今日提现150元",
  },
  {
    userId: "002",
    avatar: avatarUrl,
    txt: "尾号2341用户，今日提现50元",
  },
  {
    userId: "003",
    avatar: avatarUrl,
    txt: "尾号8729用户，今日提现200元",
  },
  {
    userId: "004",
    avatar: avatarUrl,
    txt: "尾号1057用户，今日提现100元",
  },
  {
    userId: "005",
    avatar: avatarUrl,
    txt: "尾号3946用户，今日提现50元",
  },
  {
    userId: "006",
    avatar: avatarUrl,
    txt: "尾号8123用户，今日提现200元",
  },
]
</script>
<style lang="scss" scoped>
.container {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2002;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #a5e4fa 0%, #f7fab6 50%, #fcf6e4 100%);
  display: flex;
  flex-direction: column;
}

.header {
  margin-top: 19px;
  height: 185px;
  background-image: url("https://p1.meituan.net/undertake/862164a47f841136de5a4f31b2b5d26618177.png");
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
}
.carousel {
  margin-top: 8px;
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
    width: 398px;
    height: 56px;
    margin-right: 16px;
    // margin-right: 5px;
    border-radius: 80px;
    background: rgba(0, 0, 0, 0.05);
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
@keyframes infiniteScroll {
  0% {
    transform: translate3d(0, 0, 0);
  }

  100% {
    transform: translate3d(-100%, 0, 0);
  }
}

.content {
  position: relative;
  margin-top: 11px;
  height: 517px;

  background-image: url("https://p0.meituan.net/undertake/d818f2fd4c337784b6ff422c87d6e45c133854.png");
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
}

.register-button {
  width: 490px;
  height: 184px;
  position: absolute;
  bottom: -90px;

  left: 50%;
  transform: translateX(-50%);
  background-image: url("https://p0.meituan.net/undertake/fd84dab9a62fb6b524c1ac9b49c61d6642132.png");
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  font-family: HYYaKuHei;

  font-size: 42px;
  font-weight: bold;
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  .txt {
    margin-bottom: 45px;
  }
}
.share-join {
  height: 184px;
  position: absolute;
  bottom: -90px;

  left: 50%;
  transform: translateX(-50%);
  font-family: HYYaKuHei;

  font-size: 42px;
  font-weight: bold;
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  .direct-join {
    width: 276px;
    height: 110px;
    border-radius: 100px;

    background: linear-gradient(90deg, #00b300 0%, #22bc7c 50%, #3ec551 100%);
    border: 3px solid #ffeb80;

    display: flex;
    justify-content: center;
    align-items: center;
  }
  .share-button {
    position: relative;
    background: linear-gradient(90deg, #ff7144 0%, #ff334c 50%, #ff3838 100%);
    width: 392px;
    height: 110px;
    border-radius: 100px;
    border: 3px solid #ffed8a;
    box-shadow: 0px 4px 0px 0px #ffb637;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .hot-icon {
    position: absolute;
    top: -40px;
    right: 0;
    width: 200px;
    height: 60px;
    background-image: url("https://p0.meituan.net/undertake/dea44003dc73eddec63004c8ee410c092085.png");
    background-size: contain;
    font-family: PingFang SC;

    font-size: 26px;
    font-weight: 600;
    display: flex;
    justify-content: start;
    align-items: center;

    img {
      width: 28px;
      height: 40px;
      margin-left: 20px;
      margin-right: 10px;
    }
  }
}

.rule {
  position: absolute;
  width: 100%;
  bottom: -130px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  font-family: Source Han Sans;

  img {
    width: 40px;
    height: 40px;
    margin-right: 10px;
  }
  .rule-txt {
    color: #0a77f5;
    display: inline;
  }
}
.role {
  margin: 163px 20px 0 20px;
  height: 484px;
  background-image: url("https://p0.meituan.net/undertake/61df5d6329b0869864687c5971717e8a34086.png");
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
}
</style>
