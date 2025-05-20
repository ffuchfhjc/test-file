<template>
  <div class="task-view">
    <div class="header">
      <div class="header-left">
        <img class="back-img" @click="goBack"
          src="https://p0.meituan.net/undertake/3ac9a58b95b47c3e590d826dc75cabbb390.png" alt="">
        <div class="distance-tip">{{ props.bundle.packageName }}</div>
        <div>({{ props.bundle.taskCount }})</div>
      </div>
      <ModeSwitch v-model="showMap" />
    </div>
    <div v-show="!showMap" class="list-view">
      <PullRefresh v-model:loading="pullRefreshLoading" @refresh="emit('refresh')">
        <TaskDetailItem v-for="task in props.tasks" :task="task" :showMap />
        <div class="no-data" v-if="!props.tasks.length">
          <img class="blank-img" src="https://p0.meituan.net/undertake/e89812400d3bf03c6c8b1a79d6c41ab07638.png" alt="">
          <div class="blank-text">附近暂无任务</div>
          <div class="blank-btn" @click="goBack">找任务</div>
        </div>
      </PullRefresh>
    </div>
    <div class="map-view" v-show="showMap">
      <div id="bundle-detail-map"></div>
      <div id="map-overlay">
        <TaskDetailItem v-if="selectedTask" :task="selectedTask" :showMap />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { store } from '../../store'
import ModeSwitch from './ModeSwitch.vue'
import TaskDetailItem from './TaskDetailItem.vue'
import { sendMv, sendMc } from '../../lxreport';
import PullRefresh from '@/components/PullRefresh.vue'
sendMv('b_lintopt_eovakvz9_mv', { page_type: 'list' })

const props = defineProps(['tasks', 'bundle', 'showkey'])
const emit = defineEmits(['choose-bundle', 'refresh'])

const showMap = ref(false)
const pullRefreshLoading = ref(false)
const selectedTask = ref(null)

watch(() => props.showkey, () => pullRefreshLoading.value = false)

watch(showMap, (newVal) => {
  sendMv('b_lintopt_eovakvz9_mv', { page_type: newVal ? 'map' : 'list' })
  sendMc('b_lintopt_tlo0bevo_mc', { page_type: newVal ? 'map' : 'list' })
  if (newVal && props.tasks.length) {
    selectedTask.value = props.tasks[0]
  }
})

const goBack = () => {
  store.setTaskModuleTab('TaskBundle')
}

const mapInstance = ref(null)
const initMarker = (map) => {
  const imgUrl = 'https://p0.meituan.net/undertake/ec0eb42122e5fef99bd3b961470adda48748.png'
  const Icon = new mtdpMap.Icon(imgUrl, {
    size: [28, 36],
    imageSize: [28, 36],
  })
  for (let i = 0; i < props.tasks.length; i++) {
    const { poiLng, poiLat, poiName } = props.tasks[i]
    const marker = new mtdpMap.Marker({
      anchor: mtdpMap.BOTTOM_CENTER,
      clickable: true,
      position: [poiLng, poiLat],
      zIndex: 100,
      cursor: "pointer",
      map,
      topWhenClick: true,
      icon: Icon,
    })
    marker.on("click", () => {
      selectedTask.value = props.tasks[i]
    })
  }
}
const initGeo = (map) => {
  const { packageLat, packageLng } = props.bundle
  const geoLocateControl = new mtdpMap.GeoLocateControl({
    position: mtdpMap.ANCHOR_BOTTOM_RIGHT,
    timeout: 3000,
    currentLocation: [packageLng, packageLat],
    offset: [30, 10]
  });
  geoLocateControl.on('complete', (e) => {
    console.log(e)
    store.setLocation(e._data.position)
  })
  map.addControl(geoLocateControl);
}
const initMap = () => {
  const { packageLat, packageLng } = props.bundle
  const map = new mtdpMap.Map({
    container: '#bundle-detail-map',
    center: [packageLng, packageLat],
    zoom: 16
  });
  return map
}

onMounted(() => {
  mapInstance.value = initMap()
  initGeo(mapInstance.value)
  initMarker(mapInstance.value)
  mapInstance.value.on('click', () => {
    selectedTask.value = null
  })
})

onBeforeUnmount(() => {
  if (mapInstance.value) {
    mapInstance.value.destroy()
  }
})
</script>

<style scoped lang="scss">
.no-data {
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  background-color: #F5F5F5;

  .blank-img {
    width: 148px;
    height: 148px;
    margin-bottom: 40px;
  }

  .blank-text {
    font-size: 32px;
    color: rgba(0, 0, 0, 0.7);
    margin-bottom: 65px;
  }

  .blank-btn {
    width: 90%;
    padding: 23px 0;
    text-align: center;
    border-radius: 8px;
    background: #00B300;
    font-size: 36px;
    font-weight: 500;
    color: #fff;
  }
}

.task-view {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  height: 88px;
  flex-shrink: 0;
  font-size: 28px;
  color: #4D4D4D;
  background-color: #fff;
  width: 100%;
  box-sizing: border-box;

  .header-left {
    display: flex;
    align-items: center;
    font-size: 32px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.9);
    overflow: hidden;
    line-height: 44px;
    margin-right: 24px;

    .distance-tip {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }

    .back-img {
      height: 32px;
      margin-right: 12px;
    }
  }
}

.list-view {
  overflow-y: auto;
  padding: 0 8px;
  flex: 1;
}

.map-view {
  height: 100%;
  position: relative;
  overflow: hidden;
}

#bundle-detail-map {
  width: 100%;
  height: 100%;
}

#map-overlay {
  width: 100%;
  position: absolute;
  z-index: 500;
  left: 0;
  bottom: 0;
  padding: 0 8px;
  box-sizing: border-box;

  .task-item {
    margin-bottom: 16px;
  }
}
</style>