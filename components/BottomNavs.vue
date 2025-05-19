<template>
  <div class="bottom-navs">
    <div v-for="item in navItems" class="nav-item" :class="{ active: store.pageStatus === item.pageStatus }"
      @click="handleNavClick(item.pageStatus)">
      <img class="icon" :src="store.pageStatus === item.pageStatus ? item.activeIcon : item.icon" alt="">
      <div class="text">{{ item.text }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { store } from '../store'

// const arrShareWhiteUserId = [
//   891936561, // 明辉
//   122907849, // 陈晨
//   4262500947, // 李明
//   188677989, // 振泽小
//   879569046, // 李明
//   4548770299, // 张琦
//   4733842606,  // 陈晨-new
//   153438345, // 翟超然
// ]
// const canShowShareModule = computed(() => arrShareWhiteUserId.concat(
//   arrShareWhiteUserId.map(item => String(item))
// ).includes(store.personalInfo?.userId));

const canShowShareModule = ref(true)

const navItems = computed(() => [
  {
    pageStatus: 'TaskModule',
    text: '做任务',
    icon: 'https://p0.meituan.net/undertake/7985c74ab31683717505bfb8d0c60b521505.png',
    activeIcon: 'https://p0.meituan.net/undertake/e699f16a8ec5f489672c61a6491f9d041149.png'
  },
  ...(canShowShareModule.value ? [{
    pageStatus: 'ShareModule',
    text: '邀请得现金',
    icon: 'https://p1.meituan.net/undertake/82e9eb753453c4d9cc5eb0f216f53b1c1793.png',
    activeIcon: 'https://p0.meituan.net/undertake/79d649e9bf678a920de346e7649399d11785.png'
  }]: []),
  {
    pageStatus: 'PersonalCenter',
    text: '提现',
    icon: 'https://p0.meituan.net/undertake/5db3940ad7c3662c6ba330f0fc3f831e1592.png',
    activeIcon: 'https://p0.meituan.net/undertake/cbf0ff1e0126ad89904f1535b2adfd251701.png'
  },
]);

const handleNavClick = (pageStatus) => {
  if (pageStatus === 'TaskModule') {
    store.setTaskModuleTab('TaskBundle')
  }
  store.setPageStatus(pageStatus)
};
</script>

<style scoped lang="scss">
.bottom-navs {
  flex: 0 0 100px;
  width: 100%;
  display: flex;
  background-color: #fff;
  box-shadow: 0px 8px 32px 0px rgba(0, 0, 0, 0.16);
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px 0;
  transition: all 0.3s;

  .icon {
    width: 40px;
  }

  .text {
    margin-top: 5px;
    font-size: 20px;
    color: #999;
  }

  &.active {
    .text {
      color: #00B300;
    }
  }
}
</style>
