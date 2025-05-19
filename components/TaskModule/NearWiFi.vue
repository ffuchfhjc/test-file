<template>
  <div class="near-wifi">
    <div class="tip" @click="showTip = true">
      <div class="text">点击查看任务帮助</div>
      <div class="icon">
        <img src="https://p0.meituan.net/undertake/e49e8d579bb88058eee73d057e512045423.png" alt="任务帮助">
      </div>
    </div>
    <NearWifiTip v-if="showTip" @close="showTip = false" />
    <div class="header">
      <div class="left">
        <img src="https://p0.meituan.net/undertake/9f2cd3d3f37a0718d4dc6983ab5b7e4f850.png" alt="">
        <span class="current-position">当前位置：{{ props.address }}</span>
      </div>
      <div class="right" @click="refresh">
        刷新任务
        <img src="https://p0.meituan.net/undertake/a4fbcda1b5bbbdf802e63d94350b17b32632.png" alt="">
      </div>
    </div>
    <div class="wifi-list" v-if="model.length">
      <NearWiFiItem v-model="model[index]" v-for="(item, index) in model" @auth="auth(item)" />
    </div>
    <div class="wifi-blank-list" v-else>
      <img class="blank-img" src="https://p0.meituan.net/undertake/e89812400d3bf03c6c8b1a79d6c41ab07638.png" alt="">
      <div class="blank-text">附近暂无任务</div>
      <div class="blank-btn" @click="gotoTaskBundle">找任务</div>
    </div>
    <AuthForm v-if="showAuthForm" @close="showAuthForm = false" :authWifi @auth-success="onAuthSuccess" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { store } from '../../store'
import NearWifiTip from './NearWifiTip.vue'
import AuthForm from './AuthForm.vue'
import NearWiFiItem from './NearWiFiItem.vue'
import { sendMv } from '../../lxreport';
import RealtimeReport from '../../utils/realtimeReport'
const realtimeReport = new RealtimeReport()

sendMv('b_lintopt_ii1z36b6_mv')
realtimeReport.reportRealTime('NEAR_WIFI_INIT')

const model = defineModel()
const props = defineProps(['address'])
const emit = defineEmits(['refresh'])
const authWifi = ref({})
const showTip = ref(false)
const showAuthForm = ref(false)

const auth = (item) => {
  authWifi.value = item
  showAuthForm.value = true
}
const refresh = () => { emit('refresh') }
const gotoTaskBundle = () => {
  store.setTaskModuleTab('TaskBundle')
}

const onAuthSuccess = () => {
  const index = model.value.findIndex(item => item.wifiName === authWifi.value.wifiName)
  if (index > -1) {
    model.value.splice(index, 1)
  }
  showAuthForm.value = false
}
</script>

<style scoped lang="scss">
// 添加通用的文本省略混入
@mixin ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88px;
  padding: 0 24px;
  background: #fff;

  .left,
  .right {
    display: flex;
    align-items: center;
  }

  .left {
    font-size: 32px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.9);
    overflow: hidden;

    img {
      height: 32px;
      margin-right: 16px;
    }

    .current-position {
      width: 100%;
      @include ellipsis;
    }
  }

  .right {
    font-size: 28px;
    color: #4D4D4D;
    flex-shrink: 0; // 防止right被压缩
    margin-left: 10px;

    img {
      height: 32px;
      margin-left: 4px;
    }
  }
}

.tip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  height: 80px;
  background: #FFFAD8;
  font-size: 32px;
  color: rgba(0, 0, 0, 0.9);

  .icon img {
    width: 24px;
  }
}

.near-wifi {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.wifi-list {
  flex: 1;
  padding: 0 8px;
  overflow-y: auto;
  background: #F5F5F5;
}

.wifi-blank-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 40px 0;
  background-color: #F5F5F5;

  .blank-img {
    width: 148px;
    height: 148px;
    margin-bottom: 40px;
  }

  .blank-text {
    font-size: 32px;
    color: rgba(0, 0, 0, 0.7);
    margin-bottom: 65px;
  }

  .blank-btn {
    width: 90%;
    padding: 23px 0;
    text-align: center;
    border-radius: 8px;
    background: #00B300;
    font-size: 36px;
    font-weight: 500;
    color: #fff;
  }
}
</style>
