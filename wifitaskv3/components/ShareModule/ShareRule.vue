<template>
  <div class="wrap">
    <div class="titlebar">
      <div class="titlebar-left" @click="closePage">
        <img class="titlebar-left-img" src="https://p0.meituan.net/undertake/3ac9a58b95b47c3e590d826dc75cabbb390.png"
          alt="">
      </div>
      <div class="titlebar-center">活动规则</div>
      <div class="titlebar-right"></div>
    </div>
    <div class="content">
      <div class="content-title">分享活动说明：</div>
      <div class="content-text">分享邀请领现金链接给好友，如果您的好友在【门店任务】中未提交过任务，完成以下动作，您可获得对应邀请现金奖励：您邀请成功的好友在30天内<span
          class="red-text">提交并最终审核通过</span>25个门店任务。具体返现金额以及返现金额上限以页面具体为准，分享现金奖励支持提现。</div>
      <div class="content-title">温馨提示</div>
      <div class="content-text">1.好友提交的任务需要在审核通过后才会计入任务进度，审核中的任务不计入。</div>
      <div class="content-text">2.邀请有效期为30天，30天内未达标则显示任务失败。</div>
      <div class="content-title">限时分享有礼：分享给好友后，根据好友完成任务的时间发放不同的奖励。</div>
      <div class="content-text">1.前1-1000名，单人奖励40元</div>
      <div class="content-text">2.前1001-10000名，单人奖励20元</div>
      <div class="content-text">3.10001名及以后，单人奖励10元</div>
      <div class="content-title">活动问与答</div>
      <div class="content-text">Q:被推荐人接受邀请后，未在有效期内提交任务怎么办 </div>
      <div class="content-text">A:活动页面会以倒计时形式显示任务提交有效期，过期后若被邀请人没有接受其他邀请时，邀请人<span class="red-text">可再次发起邀请。</span></div>
      <div class="content-text">Q:好友提交了25单任务，为什么我的奖励没有到账？</div>
      <div class="content-text">A:符合条件的受邀好友提交任务后，系统会审核任务，审核通过后即可发放奖励，请耐心等待。</div>
      <div class="content-text">Q:为什么预计奖励金额和实际到账金额不一致？</div>
      <div class="content-text">A:系统会根据您好友完成任务在系统中的排名给予相应的奖励，最终以用户在系统中的实际排名为准进行对应的奖励发放。</div>
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

.red-text {
  color: #FF2D19;
}

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
