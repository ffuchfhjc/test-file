<template>
  <div class="withdrawTip-wrap">
    <div class="titlebar">
      <div class="titlebar-left" @click="closePage">
        <img class="titlebar-left-img"
          src="https://p0.meituan.net/undertake/3ac9a58b95b47c3e590d826dc75cabbb390.png" alt="">
      </div>
      <div class="titlebar-center">提现规则</div>
      <div class="titlebar-right"></div>
    </div>
    <div class="content">
      <div class="content-text">1.每个用户单日只有1次提现额度。单次提现不超过100元，单日不超过500元。</div>
      <div class="content-text">2.每次提现时，您可以选择页面展示的某一种档位进行提现，剩余金额在下次满足提现门槛时申请提现。 </div>
      <div class="content-text">3.活动期间用户不得使用任何外挂、插件以及其他破坏活动规则、违背活动公平原则的方式参加本次活动。否则可能会导致无法提现。</div>
      <div class="content-text">4.提现通常在24小时内到账，但请您理解因为节假日、服务器波动等原因，提现时间可能会延长。</div>
      <div class="content-text">5.由于微信的限制，您必须在活动页面绑定已实名的微信账号才可以领取微信现金奖励。否则造成的损失由您自行承担。</div>
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

.withdrawTip-wrap {
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
  overflow-y: auto;
  padding: 44px 30px;
}

.content-title {
  font-size: 36px;
  color: #191919;
  font-weight: 600;
  margin-bottom: 8px;
}

.content-text {
  text-align: justify;
  font-size: 30px;
  color: #191919;
  line-height: 160%;
  margin-bottom: 30px;
}
</style>
