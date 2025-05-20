<template>
  <div class="item" ref="taskItem">
    <div class="icon">
      <img class="wifi" src="https://p0.meituan.net/undertake/1fbb25e9c5425f40e33e401b2b9d25721571.png" alt="wifi图标" />
    </div>
    <div class="content">
      <div class="header">
        <span class="title">{{ props.task.wifiName }}</span>
        <div class="price">
          <span class="price-symbol">¥</span>
          <span class="price-num">{{ formatAmount(props.task.taskReward) }}</span>
        </div>
      </div>
      <div class="location" @click="gotoNavigation">
        <div class="name">{{ props.task.poiName }}</div>
        <img class="nav-icon" src="https://p0.meituan.net/undertake/6d0828b59f12e9f95d6fd08a9741810a872.png">
      </div>
      <div class="distance">
        距离&nbsp;<span class="distance-num">{{ formatDistance(props.task.distance) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatDistance, formatAmount } from '@/utils/transform'
import { openMapApp } from '../../utils/utils'
import { sendMv, sendMc } from '../../lxreport';
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps(['task', 'showMap'])
const taskItem = ref(null)
const hasReported = ref(false)

// 创建 Intersection Observer 来检测元素是否在视口中
let observer = null

onMounted(() => {
  // 创建 Intersection Observer 实例
  observer = new IntersectionObserver((entries) => {
    // 如果元素进入视口且尚未上报
    if (entries[0].isIntersecting && !hasReported.value) {
      sendMv('b_lintopt_51g9bohl_mv', {
        page_type: props.showMap ? 'map' : 'list',
        task_id: props.task.taskId
      })
      hasReported.value = true
      // 一旦上报过，就不再需要观察了
      observer.disconnect()
    }
  }, {
    threshold: 0.5 // 当元素有50%进入视口时触发
  })

  // 开始观察元素
  if (taskItem.value) {
    observer.observe(taskItem.value)
  }
})

onUnmounted(() => {
  // 组件卸载时，确保断开观察器连接
  if (observer) {
    observer.disconnect()
  }
})

const gotoNavigation = () => {
  sendMc('b_lintopt_51g9bohl_mc', {
    page_type: props.showMap ? 'map' : 'list',
    task_id: props.task.taskId
  })
  console.log('gotoNavigation')
  openMapApp({
    latitude: props.task.poiLat,
    longitude: props.task.poiLng,
    destination: props.task.poiName,
  })
}
</script>

<style scoped lang="scss">
.item {
  display: flex;
  width: 100%;
  margin: 16px 0;
  padding: 32px 24px;
  box-sizing: border-box;
  background: #FFFFFF;
  border-radius: 8px;

  .icon {
    flex: 0 0 72px;

    .wifi {
      position: relative;
      top: -4px;
      width: 56px;
    }
  }

  .content {
    display: flex;
    flex: 1;
    flex-direction: column;
    overflow: hidden;

    .header {
      display: flex;
      justify-content: space-between;
      font-size: 32px;
      overflow: hidden;
      align-items: center;

      .title {
        word-break: break-word;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }

    .location {
      display: flex;
      align-items: center;
      overflow: hidden;

      .name {
        overflow: hidden;
        color: #0A77F5;
        font-size: 28px;
        line-height: 40px;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .nav-icon {
        height: 32px;
        margin-left: 8px;
      }
    }

    .distance {
      color: rgba(0, 0, 0, 0.4);
      font-size: 28px;
      margin-top: 10px;

      &-num {
        color: rgba(0, 0, 0, 0.9);
      }
    }
  }

  .price {
    position: relative;
    line-height: 28px;
    color: #FF2D19;

    &-symbol {
      font-size: 28px;
      font-weight: bold;
    }

    &-num {
      font-family: MT New Digital Display;
      font-size: 44px;
      font-weight: bold;
      line-height: 64px;
    }
  }
}
</style>
