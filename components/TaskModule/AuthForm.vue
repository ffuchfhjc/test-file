<template>
  <div class="authform-wrap">
    <div class="top-img">
      <Carousel :pics />
    </div>
    <div class="content" @click.stop="() => { }">
      <!-- <div class="merchant-poster" @click="onClickMerchantPoster">
        <img src="https://p0.meituan.net/travelcube/f9b0ab0fd2671166370536b6ac11bd55588040.png" alt="商家海报" />
      </div> -->
      <div class="title">
        <div class="left-button" @click.stop="closePage">取消</div>
        <div class="text">{{ props.authWifi.poiName }}</div>
        <div class="right-button" style="visibility: hidden;">验证</div>
        <!-- <div class="right-button" :class="{ disable }" @click.stop="clickRightButton">验证</div> -->
      </div>
      <div class="wifiname">{{ props.authWifi.wifiName }}</div>
      <div class="input-container">
        <input class="input-field" placeholder="请输入Wi-Fi密码" v-model="password" ref="inputField"
          @blur.prevent="handleBlur" @keydown="captureEnter" />
        <img src="https://p0.meituan.net/undertake/b831c82b27d86fe00117bac8693446741105.png" alt="" class="clear-button"
          @click.self.stop="clearInput">
      </div>
      <div class="auth-checkbox">
        <RadioButton v-model="picked">商家已授权共享</RadioButton>
      </div>
      <div class="footer-btns">
        <div class="btn left-btn" :class="{ disable }" @click.stop="openDirectReport">直接提报</div>
        <div class="btn right-btn" :class="{ disable }" @click.stop="clickRightButton">验证并提报</div>
      </div>
    </div>
    <LoadingV2 v-if="loadingStatus" :loadingStatus />
    <DeleteWifi v-if="showDeleteWifi" :ssid="props.authWifi.wifiName" @delete-wifi="onDeleteWifi"
      @close="showDeleteWifi = false" />
    <ImgPoster v-if="showMerchantPoster" :showCloseButton="true" :src="imgSrcMerchantPoster" btnText="关闭"
      @close="showMerchantPoster = false" />
    <DirectReportTip v-if="showDirectReportTip" @close="showDirectReportTip = false" @confirm="directReport" />
  </div>
</template>

<script setup>
import { computed, nextTick, ref } from 'vue';
import DeleteWifi from './DeleteWifi.vue';
import { connectWifi } from '../../utils/utils'
import LoadingV2 from '@/components/LoadingV2.vue';
import { TTEInstance } from '@ttejs/web';
import { reportTaskWifi } from '../../request'
import { sendMv, sendMc } from '../../lxreport';
import RealtimeReport from '../../utils/realtimeReport'
import RadioButton from '../../../../components/RadioButton.vue';
import ImgPoster from '../Common/ImgPoster.vue';
import DirectReportTip from './DirectReportTip.vue';
import Carousel from '@/components/Carousel.vue';
import { store } from "../../store"

const pics = [
  'https://p0.meituan.net/undertake/5480d05f8b3ed8c0eb2497f68c2c7128186576.png',
  'https://p0.meituan.net/undertake/25238749e0ce0eda01d2de84e3de06de90649.png',
  'https://p0.meituan.net/undertake/f1a379bdab7c5594a5278f8b0b9057ac93319.png'
]
const realtimeReport = new RealtimeReport()

const tte = TTEInstance.create({
  biz: 'boss-wifi',
  algo: 'aes',
  env: window.isTest ? 'test' : 'prod'
});

const props = defineProps(['authWifi'])
sendMv('b_lintopt_6hepzdgd_mv', { task_id: props.authWifi.taskId })
const emit = defineEmits(['close', 'auth-success'])

const password = ref('')
const loadingStatus = ref('')
const disable = computed(() => password.value.length < 8 || password.value.length > 63 || !picked.value)
const inputField = ref(null);
const picked = ref(false)
const showMerchantPoster = ref(false)
const imgSrcMerchantPoster = ref('https://p0.meituan.net/travelcube/f9b0ab0fd2671166370536b6ac11bd55588040.png')
const showDeleteWifi = ref(false)

nextTick(() => { inputField.value.focus() })
const clearInput = () => { password.value = '' }
const closePage = () => {
  emit('close')
}
const handleBlur = (e) => {
  // 防止input失焦
  e.target.focus()
}
const captureEnter = (event) => {
  if (event.key === "Enter") {
    clickRightButton()
  }
}
const onDeleteWifi = () => {
  showDeleteWifi.value = false
  clickRightButton()
}
const clickRightButton = async () => {
  if (disable.value) return
  sendMc('b_lintopt_6hepzdgd_mc', { task_id: props.authWifi.taskId })
  loadingStatus.value = 'loading'
  try {
    const result = await connectWifi({
      ssid: props.authWifi.wifiName,
      password: password.value
    }); // 等待授权完成
    console.log('验证回调', result)
    if (result.code === 0) {
      handleSuccess()
    } else if (result.code === -2002 || result.code === -2013 || result.code === -2019) {
      realtimeReport.reportRealTime('connectwifi_need_delete', {}, result)
      setTimeout(() => {
        nextTick(() => { showDeleteWifi.value = true })
      }, 100)
    } else {
      realtimeReport.reportRealTime('connectWifi_error', {}, result)
      handleError(result.code); // 处理错误情况
    }
  } catch (err) {
    console.log('验证报错', err);
    handleError(-999); // 捕获异常，处理错误
  }
}

const retryReportWifi = async (params, retries = 1) => {
  try {
    await reportTaskWifi(params);
    console.log('wifi上报成功')
    sendMv('b_lintopt_pste714i_mv', { title: '验证成功' })
    loadingStatus.value = 'success'
    setTimeout(() => { loadingStatus.value = ''; emit('auth-success') }, 2000)
  } catch (error) {
    if (retries < 10 && error.code !== 1) { // 设置最大重试次数
      await new Promise(resolve => setTimeout(resolve, 1000)); // 等待 0.5 秒
      return retryReportWifi(params, retries + 1); // 递归重试
    } else {
      handleError(-997)
    }
  }
}

const handleSuccess = async (noVerify) => {
  const result = await tte.encrypt(password.value, 'string');
  if (!result.ok) { console.log('密码加密失败'); handleError(-998); return }
  const wifiPassword = result.value
  const mac = store.scanWifiList.find(item => item.ssid === props.authWifi.wifiName)?.bssid || ''
  retryReportWifi({
    taskId: props.authWifi.taskId,
    wifiDTO: {
      wifiName: props.authWifi.wifiName,
      wifiPassword,
      passUnverified: !!noVerify,
      mac
    }
  })
}

const handleError = (error_code) => {
  realtimeReport.reportRealTime('auth_fail', {}, { error_code })
  loadingStatus.value = 'fail'
  sendMv('b_lintopt_pste714i_mv', { title: '验证失败', error_code })
  setTimeout(() => { loadingStatus.value = '' }, 2000)
}

const onClickMerchantPoster = () => {
  showMerchantPoster.value = true
  inputField.value.blur()
}

const showDirectReportTip = ref(false)
const openDirectReport = () => {
  if (disable.value) return
  showDirectReportTip.value = true
}
const directReport = () => {
  console.log('直接提报')
  handleSuccess(true)
}

KNBP.setLLButton({
  handle: () => {
    store.resetBack()
    closePage()
  }
})

</script>

<style scoped lang="scss">
.auth-checkbox {
  margin: 12px 24px;
}

.poiname {
  margin: 0 48px;
  padding: 52px 0 32px;
  border-top: 1px solid #eee;
  font-size: 28px;
  color: rgba(0, 0, 0, 0.5);
}

.wifiname {
  margin-top: 40px;
  margin-left: 48px;
}

.clear-button {
  height: 26px;
}

.input-field {
  width: 80%;
  border: none;
  outline: none;
  font-size: 28px;
  line-height: 1;
  padding: 0;
  color: #222222;
  caret-color: #FFD100;
}

.input-container {
  position: relative;
  height: 84px;
  border-radius: 12px;
  margin: 0 24px;
  padding: 24px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.authform-wrap {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1002;
  width: 100%;
  height: 100%;
  // background: rgba(0, 0, 0, 0.8);
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.merchant-poster {
  max-height: 100px;
  overflow: hidden;
  border-bottom: 0.5px solid #E5E5E5;

  img {
    width: 100%;
  }
}

.content {
  width: 100%;
  background: #fff;
  border-radius: 18px 18px 0 0;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
}

.title {
  width: 100%;
  padding: 34px 48px;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  border-bottom: 0.5px solid #E5E5E5;
}

.left-button {
  font-size: 32px;
  color: #666666;
}

.text {
  font-size: 32px;
  color: #222222;
}

.right-button {
  font-size: 32px;
  font-weight: 500;
  color: #00A72D;
}

.right-button.disable {
  opacity: 0.4;
}

.footer-btns {
  display: flex;
  justify-content: space-between;
  padding: 24px;
  gap: 24px;

  .btn {
    flex: 1;
    height: 88px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    border-radius: 12px;
  }

  .left-btn {
    border: 1px solid #00A72D;
  }

  .right-btn {
    background: #00A72D;
    color: #fff;
  }

  .disable {
    background: #E5E5E5;
    color: #666666;
    border: none;
  }
}

.top-img {
  flex: 1;
}
</style>
