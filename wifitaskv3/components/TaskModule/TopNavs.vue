<template>
  <div class="top-navs">
    <div v-for="item in navItems" class="nav-item" :class="{ active: activeTab === item.tab }" @click="handleNavClick(item.tab)">
      <img class="icon" :src="item.icon" alt="" />
      <div class="text">
        {{ item.text }}
        <div class="line" v-if="activeTab === item.tab"></div>
      </div>
    </div>
  </div>
  <ClosableImg
    :src="'https://p0.meituan.net/undertake/8f43ec06ebd68e5d6756002b654d8ced22272.png'"
    @close="showBanner = false"
    v-if="showBanner"
    class="banner"
  />
  <ProcessBar />
</template>

<script setup>
import { ref, computed } from "vue"
import { store } from "../../store"
import ProcessBar from "./ProcessBar.vue"
import ClosableImg from "../Common/ClosableImg.vue"

const showBanner = ref(true)

const navItems = ref([
  { tab: "TaskBundle", text: "前往门店" },
  { tab: "NearWiFi", text: "签报WiFi" },
  { tab: "TaskRecord", text: "任务记录" },
])

const activeTab = computed(() => {
  if (store.taskModuleTab === "TaskBundle" || store.taskModuleTab === "TaskDetail") {
    return "TaskBundle"
  }
  return store.taskModuleTab
})

const handleNavClick = (tab) => {
  store.setTaskModuleTab(tab)
}
</script>

<style scoped lang="scss">
.top-navs {
  flex: 0 0 100px;
  width: 100%;
  display: flex;
  background-color: #fff;
  border-bottom: 1px solid #e5e5e5;
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;

  .icon {
    width: 40px;
  }

  .text {
    font-size: 32px;
    color: rgba(0, 0, 0, 0.9);
    position: relative;
    height: 100%;
    display: flex;
    align-items: center;

    .line {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 4px;
      background-color: #00b300;
    }
  }

  &.active {
    .text {
      color: #00a72d;
    }
  }
}
</style>
