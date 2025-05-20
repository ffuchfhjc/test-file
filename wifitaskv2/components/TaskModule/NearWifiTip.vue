<template>
  <div class="wrap">
    <div class="titlebar">
      <div class="titlebar-left" @click="closePage">
        <img class="titlebar-left-img"
          src="https://p0.meituan.net/undertake/3ac9a58b95b47c3e590d826dc75cabbb390.png" alt="">
      </div>
      <div class="titlebar-center">任务帮助</div>
      <div class="titlebar-right"></div>
    </div>
    <div class="content">
      <div class="content-title">验证建议</div>
      <div class="content-text">1.请在门店附近完成，避免设备无法扫描到门店Wi-Fi </div>
      <div class="content-text">2.输入密码前需验证Wi-Fi名称是否准确，避免验证失败。 </div>
      <div class="content-text">3.若门店无公示密码，可礼貌咨询商家是否可以连接Wi-Fi，以及是否同意上传和分享。 </div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['close'])
const closePage = () => {
  emit('close')
}
</script>

<style scoped lang="scss">
@import '@/styles/titlebar.css';

.wrap {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
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
  overflow-y: auto;
  padding: 44px 24px;
}

.content-title {
  font-size: 36px;
  color: #191919;
  font-weight: 600;
  margin-bottom: 8px;
}

.content-text {
  font-size: 30px;
  color: #191919;
  margin-left: 15px;
  margin-bottom: 15px;
  line-height: 160%;
  text-align: justify;
}
</style>
