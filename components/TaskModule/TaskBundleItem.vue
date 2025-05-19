<template>
  <div class="card" ref="bundleCard">
    <div class="header" @click="selectBundle">
      <div class="title">{{ props.bundle.packageName }}</div>
      <div class="reward">
        <span class="reward-label">任务奖励</span>
        <span class="reward-symbol">¥</span>
        <span class="reward-num">{{ formatAmount(props.bundle.packageAmount) }}</span>
        <img class="arrow" src="https://p0.meituan.net/undertake/e49e8d579bb88058eee73d057e512045423.png" alt="" />
      </div>
    </div>
    <div class="footer">
      <div class="stat" @click="selectBundle">
        任务数&thinsp;<span class="stat-num">{{ props.bundle.taskCount }}&nbsp;&nbsp;</span>距离&thinsp;<span class="stat-num">{{
          formatDistance(props.bundle.distance)
        }}</span
        >&nbsp;&nbsp;预计耗时&thinsp;<span class="stat-num">{{ convertToHours(props.bundle.estimateDuration) }}</span>
      </div>
      <div v-if="props.bundle.distance < 50" class="task-btn" @click="onClickTaskBtn">做任务</div>
    </div>
  </div>
</template>

<script setup>
import { formatDistance, formatAmount, convertToHours } from "@/utils/transform"
import { sendMv, sendMc } from "../../lxreport"
import { ref, onMounted, onUnmounted } from "vue"
import { store } from "../../store"

const props = defineProps(["bundle", "showMap"])
const emit = defineEmits(["select-bundle"])
const bundleCard = ref(null)
const hasReported = ref(false)

// 创建 Intersection Observer 来检测元素是否在视口中
let observer = null

onMounted(() => {
  // 创建 Intersection Observer 实例
  observer = new IntersectionObserver(
    (entries) => {
      // 如果元素进入视口且尚未上报
      if (entries[0].isIntersecting && !hasReported.value) {
        sendMv("b_lintopt_wheky39c_mv", {
          page_type: props.showMap ? "map" : "list",
          bundle_id: props.bundle.packageId,
        })
        hasReported.value = true
        // 一旦上报过，就不再需要观察了
        observer.disconnect()
      }
    },
    {
      threshold: 0.5, // 当元素有50%进入视口时触发
    }
  )

  // 开始观察元素
  if (bundleCard.value) {
    observer.observe(bundleCard.value)
  }
})

onUnmounted(() => {
  // 组件卸载时，确保断开观察器连接
  if (observer) {
    observer.disconnect()
  }
})

const onClickTaskBtn = () => {
  store.setTaskModuleTab("NearWiFi")
}

const selectBundle = () => {
  sendMc("b_lintopt_wheky39c_mc", {
    page_type: props.showMap ? "map" : "list",
    bundle_id: props.bundle.packageId,
  })
  emit("select-bundle", props.bundle)
}
</script>

<style scoped lang="scss">
.card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 16px 0;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px;
    border-bottom: 1px solid #e5e5e5;
    overflow: hidden;

    .title {
      margin-right: 16px;
      font-size: 36px;
      font-weight: 500;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }

    .reward {
      white-space: nowrap;

      &-label {
        margin-right: 4px;
        color: rgba(0, 0, 0, 0.4);
        font-size: 28px;
      }

      &-symbol {
        color: #ff2d19;
        font-size: 28px;
      }

      &-num {
        color: #ff2d19;
        font-family: MT New Digital Display;
        font-size: 44px;
        font-weight: bold;
      }

      .arrow {
        height: 30px;
        margin-left: 6px;
      }
    }
  }

  .footer {
    position: relative; // 添加相对定位
    display: flex;
    justify-content: space-between; // 两端对齐
    align-items: center;
    padding: 30px 24px;
    color: rgba(0, 0, 0, 0.4);
    font-size: 28px;

    .stat {
      &:first-child {
        text-align: left;
      }

      &:nth-child(2) {
        position: absolute; // 绝对定位
        left: 50%; // 居中
        transform: translateX(-50%); // 向左偏移自身宽度的一半
      }

      &:last-child {
        text-align: right;
      }

      &-num {
        color: rgba(0, 0, 0, 0.9);
      }
    }
  }

  .task-btn {
    padding: 13px 20px;
    font-size: 30px;
    color: #fff;
    background: #00b300;
    border-radius: 8px;
  }
}
</style>
