<template>
  <div class="bundle-container">
    <div class="header">
      <div class="distance-tip"><span v-show="!showMap">附近 3km</span></div>
      <ModeSwitch v-model="modeSwitchModel" />
    </div>

    <div v-show="!showMap" class="list-view">
      <PullRefresh v-model:loading="pullRefreshLoading" @refresh="emit('refresh')">
        <TaskBundleItem v-for="item in props.bundles" :bundle="item" @select-bundle="selectBundle" :showMap />
        <div class="no-data" v-if="!props.bundles.length">
          <img class="blank-img" src="https://p0.meituan.net/undertake/e89812400d3bf03c6c8b1a79d6c41ab07638.png" alt="">
          <div class="blank-text">附近暂无任务</div>
        </div>
      </PullRefresh>
    </div>
    <div v-show="showMap" class="map-view">
      <div id="bundle-map"></div>
      <div id="map-overlay">
        <TaskBundleItem v-if="selectedBundle" :bundle="selectedBundle" @select-bundle="selectBundle" :showMap />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'
import { store } from '../../store'
import ModeSwitch from './ModeSwitch.vue'
import TaskBundleItem from './TaskBundleItem.vue'
import { sendMv, sendMc } from '../../lxreport';
import PullRefresh from '@/components/PullRefresh.vue'
import { debounce } from 'lodash-es'; // 添加 lodash 依赖
import { getNearbyPackageInfoForMap } from '../../request'
sendMv('b_lintopt_ims73ui7_mv', { page_type: 'list' })

const props = defineProps(['bundles', 'showkey'])
const emit = defineEmits(['choose-bundle', 'refresh'])

const showMap = computed(() => store.showMap)
const pullRefreshLoading = ref(false)
const selectedBundle = ref(null)
const modeSwitchModel = ref(showMap.value)

const mapBundles = ref(props.bundles)

watch(() => props.showkey, () => pullRefreshLoading.value = false)
watch(modeSwitchModel, (newVal) => {
  store.showMap = newVal
})

watch(showMap, (newVal) => {
  sendMv('b_lintopt_ims73ui7_mv', { page_type: newVal ? 'map' : 'list' })
  sendMc('b_lintopt_126z3xrc_mc', { page_type: newVal ? 'map' : 'list' })
  if (newVal && props.bundles.length) {
    selectedBundle.value = props.bundles[0]
  }
})
const selectBundle = (item) => { emit('choose-bundle', item) }

let mapInstance = {}
const { lng, lat } = store.location
let markers = []
const initMarker = () => {
  const imgUrl = 'https://p0.meituan.net/undertake/ec0eb42122e5fef99bd3b961470adda48748.png'
  const Icon = new mtdpMap.Icon(imgUrl, {
    size: [28, 36],
    imageSize: [28, 36],
  })

  mapBundles.value.forEach((bundle, index) => {
    const { packageLng, packageLat } = bundle
    const marker = new mtdpMap.Marker({
      anchor: mtdpMap.BOTTOM_CENTER,
      clickable: true,
      position: [packageLng, packageLat],
      zIndex: 100,
      cursor: "pointer",
      map: mapInstance,
      icon: Icon,
      topWhenClick: true,
    })
    markers.push(marker)
    marker.on("click", () => {
      selectedBundle.value = mapBundles.value[index]
    })
  })
}

const initGeo = (map) => {
  const geoLocateControl = new mtdpMap.GeoLocateControl({
    position: mtdpMap.ANCHOR_BOTTOM_RIGHT,
    timeout: 3000,
    currentLocation: [lng, lat],
    offset: [30, 10]
  })

  geoLocateControl.on('complete', (e) => {
    store.setLocation(e._data.position)
  })

  map.addControl(geoLocateControl)
}

const initMap = () => {
  const map = new mtdpMap.Map({
    container: '#bundle-map',
    center: [lng, lat],
    zoom: 16,
    minZoom: 14,
  })
  return map
}
const getNewBundles = () => {
  console.log('getNewBundles')
  const zoom = mapInstance.getZoom()
  // if (zoom < 14.5) { return window.toast('请放大地图查看任务包') }
  const bounds = mapInstance.getBounds();
  const NW = bounds.getNorthWest();
  const SE = bounds.getSouthEast();
  console.log(NW, SE)
  const { Mn: leftUpperLat, In: leftUpperLng } = NW
  const { Mn: rightLowerLat, In: rightLowerLng } = SE
  getNearbyPackageInfoForMap({
    leftUpperLat,
    leftUpperLng,
    rightLowerLat,
    rightLowerLng
  }).then(res => {
    mapBundles.value = res.data
    markers.forEach((marker) => marker.destroy())
    markers = []
    initMarker()
  })
}
const handleHeapHotDebounce = debounce(getNewBundles, 1000);

onMounted(() => {
  mapInstance = initMap()
  initGeo(mapInstance)
  initMarker()
  mapInstance.on('click', () => {
    selectedBundle.value = null
  })
  mapInstance.on('moveend', handleHeapHotDebounce);
  mapInstance.on('zoomend', handleHeapHotDebounce);
})

onBeforeUnmount(() => {
  mapInstance && mapInstance.destroy()
})
</script>

<style scoped lang="scss">
.no-data {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  box-sizing: border-box;
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

.bundle-container {
  width: 100%;
  flex: 1;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
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

#bundle-map {
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

  .bundle-card {
    margin-bottom: 16px;
  }
}
</style>
