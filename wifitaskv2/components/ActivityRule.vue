<template>
  <div class="withdrawTip-wrap">
    <div class="titlebar" v-if="showMode !== 'bottomReturn'">
      <div class="titlebar-left" @click="closePage">
        <img class="titlebar-left-img" src="https://p0.meituan.net/undertake/3ac9a58b95b47c3e590d826dc75cabbb390.png"
          alt="">
      </div>
      <div class="titlebar-center">活动规则</div>
      <div class="titlebar-right"></div>
    </div>
    <div class="content">
      <div class="content-text">用户参加门店淘金活动后，通过活动工具找到线下可淘金的门店，完成相应任务后可获取用户激励。活动主要流程如下：</div>
      <div class="content-text">1.任务查看：用户进入活动页后，可查看周边符合条件的门店，用户可以导航前往探索指定店铺。每个店铺标注预估奖励，用户通过完成任务获得奖励，并在累计到一定金额时可以结算提现。
      </div>
      <div class="content-text">2.任务完成条件：获得店铺Wi-Fi所有权人的授权（授权范围应当包括提报上传和分享给任何第三方使用）、验证门店Wi-Fi：提报门店Wi-Fi密码并完成验证（需用指定工具完成）。
      </div>
      <div class="content-text">3.邀请得奖励：除个人完成任务外，也可以通过邀请好友参加活动获得更多奖励，具体规则可参考分享规则说明。</div>
      <div class="content-text">4.结算与提现：用户通过任务获取的奖励达到兑换标准后，可以在指定页面进行兑换结算。具体兑换流程可参考提现规则。</div>
      <div class="content-text">5.注意和声明事项：</div>
      <div class="content-text tip">
        a.如用户出现任何违法违规行为，包括但不限于未获合法授权即提报和分享密码、使用Wi-Fi从事非法行为、恶意上传虚假密码、利用获取的密码从事非法交易或进行超过本次活动必要范围的行为、用户未经美团同意不得以美团名义或穿着带有美团商标服饰等进行推广行为等，活动将撤销用户的所有奖励，用户需要对上传行为，独立承担法律责任。
      </div>
      <div class="content-text tip">b.同一个账号、同一个手机号、同一个支付账号以及同一个设备号均视为同一用户。</div>
      <div class="content-text tip">
        c.活动期间，如果出现因网络攻击、黑客攻击、数据泄露等原因导致活动无法继续，平台有权利提前结束活动。如因不可抗力（包括但不限于重大自然灾害事件、政府主管部门指令暂停或停止举办、政策严格管控、暴力冲突、活动遭受严重网络攻击或系统故障等）导致本活动在部分区域或整体无法继续举办的，活动方可决定在部分区域设置围栏屏蔽活动、下线活动二维码、暂停或终止本活动，并依相关法律法规主张免责。
      </div>
      <div class="content-text tip">
        d.活动期间，用户需要恪守诚实信用原则，被发现存在有违规或作弊行为，包括但不限于：通过任何不正当手段达成交易或参与活动，如使用插件、外挂等工具或借助非自然流量或非正常社交关系完成好友助力任务（如使用专业助力群）、虚拟定位软件、使用非法工具分享、下载、安装、注册、登录多个账号、批量或非出于交易目的注册账号、买号、养号，利用技术漏洞或规则漏洞获取奖励、扰乱系统、实施网络攻击、使用黑客工具等，以及其他经合理判断属于违反诚实信用原则的行为，活动方有权对该用户的账号进行异常标记，并取消用户参与活动资格。活动方有权撤销相关交易、收回全部已发放奖励（包括已消费金额）等，追究用户的相应责任（包括不限于警告、暂停服务等），并保留追究法律责任的权利。
      </div>
    </div>
    <div class="footer" v-if="showMode === 'bottomReturn'">
      <div class="btn" @click="closePage">同意并进入活动</div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  showMode: {
    type: String,
    default: 'topReturn',
    required: false
  }
})
const emit = defineEmits(['close'])
const closePage = () => {
  if(props.showMode === 'bottomReturn'){
    localStorage.setItem('ActivityRule', true);
  }
  emit('close')
}
</script>

<style scoped lang="scss">
@import '@/styles/titlebar.css';

.footer {
  flex: 0 0 148px;
  background: #fff;
  box-shadow: 0px -2px 12px 0px rgba(0, 0, 0, 0.06);
  display: flex;
  justify-content: center;
  align-items: center;

  .btn {
    border-radius: 8px;
    height: 88px;
    font-size: 30px;
    font-weight: 500;
    color: #FFFFFF;
    background: #00B300;
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    margin: 0 28px;
  }
}

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
  z-index: 1001;

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
  font-size: 30px;
  color: #191919;
  line-height: 160%;
  margin-bottom: 30px;
  text-align: justify;
}

.tip {
  margin-left: 16px;
}
</style>
