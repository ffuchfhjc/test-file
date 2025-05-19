<template>
  <div class="mode-switch" @click="toggleMode">
    <span class="text">{{ modelValue ? mode1.text : mode2.text }}</span>
    <img class="icon" :src="modelValue ? mode1.icon : mode2.icon" alt="">
  </div>
</template>

<script setup>
const model = defineModel()
const mode1 = {
  text: '切换为列表',
  icon: 'https://p1.meituan.net/undertake/fc585b7418c733d1201612477c1870d1744.png'
}
const mode2 = {
  text: '切换为地图',
  icon: 'https://p1.meituan.net/undertake/ac92043ad8f79d234eddb407a00519403421.png'
}
const toggleMode = () => {
  model.value = !model.value
}
</script>

<style scoped>
.mode-switch {
  display: flex;
  align-items: center;
  gap: 2px;
  white-space: nowrap;
  flex-shrink: 0;
}

.icon {
  height: 32px;
}

.text {
  font-size: 28px;
  color: #4D4D4D;
}
</style>
