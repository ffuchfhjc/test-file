<template>
  <div class="item">
    <div class="icon">
      <img src="https://p0.meituan.net/undertake/1fbb25e9c5425f40e33e401b2b9d25721571.png" alt="wifi图标" />
    </div>
    <div class="content">
      <div class="row">
        <div class="name">{{ model.wifiName }}</div>
        <div class="price">
          <span class="symbol">¥</span>
          <span class="value">{{ formatAmount(model.taskReward) }}</span>
        </div>
      </div>
      <div class="poi">来自 {{ model.poiName }} 附近</div>
    </div>
    <div class="action">
      <div class="btn" @click="auth">验证</div>
    </div>
  </div>
</template>

<script setup>
import { formatAmount } from '@/utils/transform'
import { sendMv, sendMc } from '../../lxreport';

const model = defineModel()
sendMv('b_lintopt_5xrjwfwh_mv', { task_id: model.value.taskId })

const emit = defineEmits(['auth'])
const auth = () => {
  sendMc('b_lintopt_5xrjwfwh_mc', { task_id: model.value.taskId })
  emit('auth')
}
</script>

<style scoped lang="scss">
// 添加通用的文本省略混入
@mixin ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item {
  margin: 16px 0;
  display: flex;
  padding: 24px;
  border-radius: 8px;
  background: #fff;
}

.icon {
  width: 72px;

  img {
    width: 56px;
    margin-top: 4px;
  }
}

.content {
  flex: 1;
  min-width: 0;
  margin-right: 23px;

  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 6px;
  }

  .name {
    flex: 1;
    font-size: 32px;
    margin-right: 5px;
    color: rgba(0, 0, 0, 0.9);
    @include ellipsis;
  }

  .price {
    color: #FF2D19;
    font-family: MT New Digital Display;

    .symbol {
      font-size: 28px;
    }

    .value {
      font-size: 44px;
    }
  }

  .poi {
    font-size: 28px;
    color: rgba(0, 0, 0, 0.4);
    @include ellipsis;
  }
}

.action .btn {
  padding: 13px 46px;
  font-size: 30px;
  color: #fff;
  background: #00B300;
  border-radius: 8px;
}
</style>
